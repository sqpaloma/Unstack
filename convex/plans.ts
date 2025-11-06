import { mutation, query, action } from './_generated/server'
import { v } from 'convex/values'
import { api } from './_generated/api'
import { Id } from './_generated/dataModel'

const moduleSchema = v.object({
  title: v.string(),
  description: v.string(),
  estimatedHours: v.number(),
  resources: v.array(
    v.object({
      type: v.union(v.literal('doc'), v.literal('video'), v.literal('article'), v.literal('course')),
      title: v.string(),
      url: v.string(),
    })
  ),
  completed: v.boolean(),
})

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('plans')
      .withIndex('by_creation_time')
      .order('desc')
      .collect()
  },
})

export const getByUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const plans = await ctx.db.query('plans').collect()
    return plans.filter((p) => p.userId === args.userId)
  },
})

export const getByAnalysis = query({
  args: { analysisId: v.id('githubAnalysis') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('plans')
      .withIndex('by_analysis', (q) => q.eq('analysisId', args.analysisId))
      .collect()
  },
})

export const getByUserAndTech = query({
  args: {
    userId: v.optional(v.id('users')),
    technology: v.string(),
  },
  handler: async (ctx, args) => {
    const plans = await ctx.db.query('plans').collect()
    return plans.find(
      (p) => p.userId === args.userId && p.technology === args.technology
    )
  },
})

export const create = mutation({
  args: {
    userId: v.optional(v.id('users')),
    analysisId: v.optional(v.id('githubAnalysis')),
    technology: v.string(),
    modules: v.array(moduleSchema),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('plans', {
      userId: args.userId,
      analysisId: args.analysisId,
      technology: args.technology,
      modules: args.modules,
      createdAt: Date.now(),
    })
  },
})

export const updateModules = mutation({
  args: {
    id: v.id('plans'),
    modules: v.array(moduleSchema),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      modules: args.modules,
    })
  },
})

export const toggleModuleCompletion = mutation({
  args: {
    id: v.id('plans'),
    moduleIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const plan = await ctx.db.get(args.id)
    if (!plan) {
      throw new Error('Plan not found')
    }

    const modules = [...plan.modules]
    if (modules[args.moduleIndex]) {
      modules[args.moduleIndex].completed = !modules[args.moduleIndex].completed
      return await ctx.db.patch(args.id, { modules })
    }

    throw new Error('Module not found')
  },
})

export const remove = mutation({
  args: { id: v.id('plans') },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id)
  },
})

// Helper function to generate modules based on tech level
function generateModulesForTech(
  techKey: string,
  techName: string,
  category: string,
  level: 'sei' | 'nocao' | 'nao_sei'
) {
  const modules = []

  // Base module structure varies by level
  if (level === 'nao_sei') {
    // Beginner: fundamentals + basics + practice
    modules.push(
      {
        title: `Fundamentos de ${techName}`,
        description: `Introdução aos conceitos básicos e arquitetura do ${techName}`,
        estimatedHours: 4,
        resources: [
          {
            type: 'doc' as const,
            title: `${techName} Official Documentation`,
            url: `https://www.google.com/search?q=${encodeURIComponent(techName + ' official documentation')}`,
          },
          {
            type: 'video' as const,
            title: `${techName} Tutorial for Beginners`,
            url: `https://www.youtube.com/results?search_query=${encodeURIComponent(techName + ' tutorial for beginners')}`,
          },
        ],
        completed: false,
      },
      {
        title: `Primeiros Passos com ${techName}`,
        description: `Configuração de ambiente e primeiro projeto`,
        estimatedHours: 6,
        resources: [
          {
            type: 'article' as const,
            title: `Getting Started with ${techName}`,
            url: `https://www.google.com/search?q=${encodeURIComponent(techName + ' getting started guide')}`,
          },
        ],
        completed: false,
      },
      {
        title: `Prática com ${techName}`,
        description: `Exercícios práticos e projeto básico`,
        estimatedHours: 8,
        resources: [
          {
            type: 'course' as const,
            title: `${techName} Hands-on Course`,
            url: `https://www.google.com/search?q=${encodeURIComponent(techName + ' course')}`,
          },
        ],
        completed: false,
      }
    )
  } else if (level === 'nocao') {
    // Intermediate: advanced concepts + best practices
    modules.push(
      {
        title: `Conceitos Avançados de ${techName}`,
        description: `Aprofundamento em recursos avançados e padrões`,
        estimatedHours: 5,
        resources: [
          {
            type: 'doc' as const,
            title: `${techName} Advanced Guide`,
            url: `https://www.google.com/search?q=${encodeURIComponent(techName + ' advanced guide')}`,
          },
        ],
        completed: false,
      },
      {
        title: `Best Practices com ${techName}`,
        description: `Padrões de arquitetura e melhores práticas`,
        estimatedHours: 4,
        resources: [
          {
            type: 'article' as const,
            title: `${techName} Best Practices`,
            url: `https://www.google.com/search?q=${encodeURIComponent(techName + ' best practices')}`,
          },
        ],
        completed: false,
      }
    )
  } else {
    // Expert: optimization + edge cases
    modules.push({
      title: `Otimização e Performance com ${techName}`,
      description: `Técnicas avançadas de otimização e casos especiais`,
      estimatedHours: 3,
      resources: [
        {
          type: 'article' as const,
          title: `${techName} Performance Optimization`,
          url: `https://www.google.com/search?q=${encodeURIComponent(techName + ' performance optimization')}`,
        },
      ],
      completed: false,
    })
  }

  // Add category-specific modules
  if (category === 'auth' && level !== 'sei') {
    modules.push({
      title: `Segurança e Autenticação com ${techName}`,
      description: `OAuth, JWT, sessions, e melhores práticas de segurança`,
      estimatedHours: 6,
      resources: [
        {
          type: 'doc' as const,
          title: `${techName} Security Guide`,
          url: `https://www.google.com/search?q=${encodeURIComponent(techName + ' security authentication guide')}`,
        },
      ],
      completed: false,
    })
  }

  if (category === 'db' && level !== 'sei') {
    modules.push({
      title: `Modelagem e Queries com ${techName}`,
      description: `Schema design, queries eficientes, e migrations`,
      estimatedHours: 7,
      resources: [
        {
          type: 'doc' as const,
          title: `${techName} Schema Design`,
          url: `https://www.google.com/search?q=${encodeURIComponent(techName + ' schema design best practices')}`,
        },
      ],
      completed: false,
    })
  }

  return modules
}

// Action to generate learning plan from analysis + assessments
export const generate = action({
  args: {
    userId: v.optional(v.id('users')),
    analysisId: v.id('githubAnalysis'),
  },
  handler: async (ctx, args): Promise<Id<'plans'>[]> => {
    // Fetch analysis
    const analysis = await ctx.runQuery(api.analysis.getById, {
      id: args.analysisId,
    })

    if (!analysis) {
      throw new Error('Analysis not found')
    }

    if (!analysis.detectedTechs || analysis.detectedTechs.length === 0) {
      throw new Error('No technologies detected in analysis')
    }

    // Fetch assessments for this analysis
    const assessments = await ctx.runQuery(api.assessments.getByAnalysis, {
      analysisId: args.analysisId,
    })

    // Create assessment map for quick lookup
    const assessmentMap = new Map<string, 'sei' | 'nocao' | 'nao_sei'>()
    assessments.forEach((a) => {
      assessmentMap.set(a.technology, a.level)
    })

    // Generate plans for each technology that needs learning (not 'sei')
    const planIds: Id<'plans'>[] = []

    for (const tech of analysis.detectedTechs) {
      const level = assessmentMap.get(tech.key) || 'nao_sei'

      // Only create plan if user doesn't fully know it
      if (level !== 'sei') {
        const modules = generateModulesForTech(
          tech.key,
          tech.name,
          tech.category,
          level
        )

        const planId = await ctx.runMutation(api.plans.create, {
          userId: args.userId,
          analysisId: args.analysisId,
          technology: tech.key,
          modules,
        })

        planIds.push(planId)
      }
    }

    if (planIds.length === 0) {
      throw new Error('No plans generated - you already know all technologies!')
    }

    return planIds
  },
})
