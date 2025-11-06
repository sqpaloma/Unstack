import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('progress')
      .withIndex('by_creation_time')
      .order('desc')
      .collect()
  },
})

export const getByUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const progress = await ctx.db.query('progress').collect()
    return progress.filter((p) => p.userId === args.userId)
  },
})

export const getByPlan = query({
  args: { planId: v.id('plans') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('progress')
      .withIndex('by_plan', (q) => q.eq('planId', args.planId))
      .collect()
  },
})

export const getByUserAndTech = query({
  args: {
    userId: v.optional(v.id('users')),
    technology: v.string(),
  },
  handler: async (ctx, args) => {
    const progress = await ctx.db.query('progress').collect()
    return progress.filter(
      (p) => p.userId === args.userId && p.technology === args.technology
    )
  },
})

export const create = mutation({
  args: {
    userId: v.optional(v.id('users')),
    planId: v.id('plans'),
    technology: v.string(),
    moduleIndex: v.number(),
    completedAt: v.optional(v.number()),
    notes: v.optional(v.string()),
    timeSpentMinutes: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('progress', {
      userId: args.userId,
      planId: args.planId,
      technology: args.technology,
      moduleIndex: args.moduleIndex,
      completedAt: args.completedAt,
      notes: args.notes,
      timeSpentMinutes: args.timeSpentMinutes,
    })
  },
})

export const markCompleted = mutation({
  args: {
    id: v.id('progress'),
    notes: v.optional(v.string()),
    timeSpentMinutes: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      completedAt: Date.now(),
      notes: args.notes,
      timeSpentMinutes: args.timeSpentMinutes,
    })
  },
})

export const update = mutation({
  args: {
    id: v.id('progress'),
    notes: v.optional(v.string()),
    timeSpentMinutes: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    return await ctx.db.patch(id, updates)
  },
})

export const toggleItem = mutation({
  args: {
    userId: v.optional(v.id('users')),
    planId: v.id('plans'),
    technology: v.string(),
    moduleIndex: v.number(),
  },
  handler: async (ctx, args) => {
    // Check if progress already exists for this module
    const existing = await ctx.db
      .query('progress')
      .withIndex('by_plan', (q) => q.eq('planId', args.planId))
      .collect()

    const existingProgress = existing.find(
      (p) => p.moduleIndex === args.moduleIndex
    )

    if (existingProgress) {
      // If exists, toggle by deleting it (uncomplete)
      await ctx.db.delete(existingProgress._id)
      return { completed: false }
    } else {
      // If doesn't exist, create it (complete)
      await ctx.db.insert('progress', {
        userId: args.userId,
        planId: args.planId,
        technology: args.technology,
        moduleIndex: args.moduleIndex,
        completedAt: Date.now(),
      })
      return { completed: true }
    }
  },
})

export const remove = mutation({
  args: { id: v.id('progress') },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id)
  },
})
