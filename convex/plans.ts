import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

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
