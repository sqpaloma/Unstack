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

export const get = query({
  args: { id: v.id('plans') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
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

export const checkDuplicates = query({
  args: {
    userId: v.optional(v.id('users')),
    technologies: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.userId) {
      return { existingTechs: [], newTechs: args.technologies, hasExisting: false }
    }

    // Use index to fetch only user's plans
    const userPlans = await ctx.db
      .query('plans')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect()
    
    const existingTechSet = new Set(userPlans.map((p) => p.technology))

    const existingTechs = args.technologies.filter((tech) =>
      existingTechSet.has(tech)
    )
    const newTechs = args.technologies.filter(
      (tech) => !existingTechSet.has(tech)
    )

    return {
      existingTechs,
      newTechs,
      hasExisting: existingTechs.length > 0,
    }
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

export const removeByTechnology = mutation({
  args: {
    userId: v.optional(v.id('users')),
    technology: v.string(),
  },
  handler: async (ctx, args) => {
    const plans = await ctx.db.query('plans').collect()
    const userPlans = plans.filter(
      (p) => p.userId === args.userId && p.technology === args.technology
    )

    const deletedIds: Id<'plans'>[] = []
    for (const plan of userPlans) {
      await ctx.db.delete(plan._id)
      deletedIds.push(plan._id)
    }

    return {
      deleted: deletedIds.length,
      ids: deletedIds,
    }
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
        title: `${techName} Fundamentals`,
        description: `Introduction to basic concepts and ${techName} architecture`,
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
        title: `Getting Started with ${techName}`,
        description: `Environment setup and first project`,
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
        title: `${techName} Practice`,
        description: `Practical exercises and basic project`,
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
        title: `Advanced ${techName} Concepts`,
        description: `Deep dive into advanced features and patterns`,
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
        title: `${techName} Best Practices`,
        description: `Architecture patterns and best practices`,
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
      title: `${techName} Optimization and Performance`,
      description: `Advanced optimization techniques and edge cases`,
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
      title: `${techName} Security and Authentication`,
      description: `OAuth, JWT, sessions, and security best practices`,
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
      title: `${techName} Modeling and Queries`,
      description: `Schema design, efficient queries, and migrations`,
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
    const startTime = Date.now()

    console.log('[Plan Generation] Started', {
      userId: args.userId,
      analysisId: args.analysisId,
    })

    // TODO: Send to Sentry
    // Sentry.captureMessage('plan_generate_started', {
    //   extra: {
    //     userId: args.userId,
    //     analysisId: args.analysisId,
    //   },
    // })

    try {
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

      // Fetch existing plans for this user to avoid duplicates
      const existingPlans = args.userId 
        ? await ctx.runQuery(api.plans.getByUser, { userId: args.userId })
        : []
      
      const existingTechSet = new Set(existingPlans.map(p => p.technology))

      // Generate plans for each technology that needs learning (not 'sei')
      const planIds: Id<'plans'>[] = []
      const skippedTechs: string[] = []

      for (const tech of analysis.detectedTechs) {
        const level = assessmentMap.get(tech.key) || 'nao_sei'

        // Skip if user already knows it
        if (level === 'sei') {
          continue
        }

        // Skip if plan already exists for this technology
        if (existingTechSet.has(tech.key)) {
          skippedTechs.push(tech.name)
          console.log(`[Plan Generation] Skipping duplicate: ${tech.name}`)
          continue
        }

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

      if (skippedTechs.length > 0) {
        console.log('[Plan Generation] Skipped duplicates:', skippedTechs.join(', '))
      }

      if (planIds.length === 0 && skippedTechs.length === 0) {
        throw new Error('No plans generated - you already know all technologies!')
      }

      if (planIds.length === 0 && skippedTechs.length > 0) {
        throw new Error(`Nenhum plano novo gerado. Você já possui planos para todas as tecnologias detectadas (${skippedTechs.join(', ')}).`)
      }

      const duration = Date.now() - startTime
      console.log('[Plan Generation] Success', {
        userId: args.userId,
        analysisId: args.analysisId,
        plansCount: planIds.length,
        skippedCount: skippedTechs.length,
        duration,
      })

      // TODO: Send to Sentry
      // Sentry.captureMessage('plan_generate_success', {
      //   extra: {
      //     userId: args.userId,
      //     analysisId: args.analysisId,
      //     plansCount: planIds.length,
      //     duration,
      //   },
      // })

      return planIds
    } catch (error) {
      const duration = Date.now() - startTime
      console.error('[Plan Generation] Error', {
        userId: args.userId,
        analysisId: args.analysisId,
        error,
        duration,
      })

      // TODO: Send to Sentry
      // Sentry.captureException(error, {
      //   extra: {
      //     userId: args.userId,
      //     analysisId: args.analysisId,
      //     duration,
      //   },
      // })

      throw error
    }
  },
})
