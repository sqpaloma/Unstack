import { mutation, query, action } from './_generated/server'
import { v } from 'convex/values'
import { api } from './_generated/api'
import { fetchGitHubFilesFallback, parseGitHubUrl } from './lib/firecrawl'
import { detectTechnologies, generateAnalysisSummary } from './lib/detector'
import { Id } from './_generated/dataModel'

// Queries
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('githubAnalysis')
      .withIndex('by_creation_time')
      .order('desc')
      .collect()
  },
})

export const getByUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const analyses = await ctx.db.query('githubAnalysis').collect()
    return analyses.filter((analysis) => analysis.userId === args.userId)
  },
})

export const getById = query({
  args: { id: v.id('githubAnalysis') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const getByStatus = query({
  args: { status: v.union(v.literal('pending'), v.literal('analyzing'), v.literal('done'), v.literal('failed')) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('githubAnalysis')
      .withIndex('by_status', (q) => q.eq('status', args.status))
      .collect()
  },
})

// Mutations
export const create = mutation({
  args: {
    userId: v.optional(v.id('users')),
    githubUrl: v.string(),
    owner: v.string(),
    repo: v.string(),
    branch: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('githubAnalysis', {
      userId: args.userId,
      githubUrl: args.githubUrl,
      owner: args.owner,
      repo: args.repo,
      branch: args.branch,
      status: 'pending',
      createdAt: Date.now(),
    })
  },
})

export const updateStatus = mutation({
  args: {
    id: v.id('githubAnalysis'),
    status: v.union(v.literal('pending'), v.literal('analyzing'), v.literal('done'), v.literal('failed')),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    return await ctx.db.patch(id, updates)
  },
})

export const updateResults = mutation({
  args: {
    id: v.id('githubAnalysis'),
    detectedTechs: v.array(
      v.object({
        key: v.string(),
        name: v.string(),
        category: v.union(
          v.literal('language'),
          v.literal('framework'),
          v.literal('auth'),
          v.literal('db'),
          v.literal('infra'),
          v.literal('tool')
        ),
        version: v.optional(v.string()),
        confidence: v.number(),
        sources: v.array(v.string()),
      })
    ),
    analysisSummary: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      detectedTechs: args.detectedTechs,
      analysisSummary: args.analysisSummary,
      status: 'done',
      analyzedAt: Date.now(),
    })
  },
})

export const remove = mutation({
  args: { id: v.id('githubAnalysis') },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id)
  },
})

// Action para criar e analisar repositório a partir de URL
export const createAndAnalyzeFromUrl = action({
  args: {
    githubUrl: v.string(),
    userId: v.optional(v.id('users')),
  },
  handler: async (ctx, args): Promise<Id<'githubAnalysis'>> => {
    // Parse URL do GitHub
    const parsed = parseGitHubUrl(args.githubUrl)
    if (!parsed) {
      throw new Error('Invalid GitHub URL format. Expected: https://github.com/<owner>/<repo>[/tree/<branch>]')
    }

    // Criar registro de análise
    const analysisId: Id<'githubAnalysis'> = await ctx.runMutation(api.analysis.create, {
      userId: args.userId,
      githubUrl: args.githubUrl,
      owner: parsed.owner,
      repo: parsed.repo,
      branch: parsed.branch,
    })

    // Iniciar análise
    await ctx.runAction(api.analysis.analyzeRepo, { id: analysisId })

    return analysisId
  },
})

// Action para análise de repositório
export const analyzeRepo = action({
  args: {
    id: v.id('githubAnalysis'),
  },
  handler: async (ctx, args) => {
    const startTime = Date.now()

    // Atualizar status para analyzing
    await ctx.runMutation(api.analysis.updateStatus, {
      id: args.id,
      status: 'analyzing',
    })

    try {
      const analysis = await ctx.runQuery(api.analysis.getById, { id: args.id })
      if (!analysis) throw new Error('Analysis not found')

      console.log(`[GitHub Analysis] Starting analysis for ${analysis.owner}/${analysis.repo}`)

      // Buscar arquivos do GitHub
      const files = await fetchGitHubFilesFallback(
        analysis.owner,
        analysis.repo,
        analysis.branch
      )

      console.log(`[GitHub Analysis] Fetched ${files.length} files`)

      if (files.length === 0) {
        throw new Error('No files found. Repository may be private or does not exist.')
      }

      // Detectar tecnologias
      const detectedTechs = detectTechnologies(files)

      console.log(`[GitHub Analysis] Detected ${detectedTechs.length} technologies`)

      if (detectedTechs.length === 0) {
        throw new Error('No technologies detected. Repository may not contain recognized frameworks.')
      }

      // Gerar resumo
      const analysisSummary = generateAnalysisSummary(detectedTechs)

      console.log(`[GitHub Analysis] Summary: ${analysisSummary}`)

      // Atualizar resultados
      await ctx.runMutation(api.analysis.updateResults, {
        id: args.id,
        detectedTechs,
        analysisSummary,
      })

      const duration = Date.now() - startTime
      console.log(`[GitHub Analysis] Analysis completed in ${duration}ms`)

      // TODO: Enviar telemetria para Sentry
      // Sentry.captureMessage('github_analysis_success', {
      //   extra: {
      //     analysisId: args.id,
      //     duration,
      //     techCount: detectedTechs.length,
      //     repo: `${analysis.owner}/${analysis.repo}`,
      //   },
      // })
    } catch (error) {
      const duration = Date.now() - startTime
      console.error('[GitHub Analysis] Failed:', error)

      await ctx.runMutation(api.analysis.updateStatus, {
        id: args.id,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      })

      // TODO: Enviar erro para Sentry
      // Sentry.captureException(error, {
      //   extra: {
      //     analysisId: args.id,
      //     duration,
      //   },
      // })

      throw error
    }
  },
})
