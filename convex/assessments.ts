import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('assessments')
      .withIndex('by_creation_time')
      .order('desc')
      .collect()
  },
})

export const getByUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const assessments = await ctx.db.query('assessments').collect()
    return assessments.filter((a) => a.userId === args.userId)
  },
})

export const getByAnalysis = query({
  args: { analysisId: v.id('githubAnalysis') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('assessments')
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
    const assessments = await ctx.db.query('assessments').collect()
    return assessments.find(
      (a) => a.userId === args.userId && a.technology === args.technology
    )
  },
})

export const create = mutation({
  args: {
    userId: v.optional(v.id('users')),
    analysisId: v.optional(v.id('githubAnalysis')),
    technology: v.string(),
    level: v.union(v.literal('sei'), v.literal('nocao'), v.literal('nao_sei')),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('assessments', {
      userId: args.userId,
      analysisId: args.analysisId,
      technology: args.technology,
      level: args.level,
      createdAt: Date.now(),
    })
  },
})

export const update = mutation({
  args: {
    id: v.id('assessments'),
    level: v.union(v.literal('sei'), v.literal('nocao'), v.literal('nao_sei')),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      level: args.level,
    })
  },
})

export const save = mutation({
  args: {
    userId: v.optional(v.id('users')),
    analysisId: v.optional(v.id('githubAnalysis')),
    assessments: v.array(
      v.object({
        technology: v.string(),
        level: v.union(v.literal('sei'), v.literal('nocao'), v.literal('nao_sei')),
      })
    ),
  },
  handler: async (ctx, args) => {
    const results = []

    for (const assessment of args.assessments) {
      // Check if assessment already exists for this user + tech
      const assessments = await ctx.db.query('assessments').collect()
      const existing = assessments.find(
        (a) => a.userId === args.userId && a.technology === assessment.technology
      )

      if (existing) {
        // Update existing
        await ctx.db.patch(existing._id, {
          level: assessment.level,
          analysisId: args.analysisId,
        })
        results.push(existing._id)
      } else {
        // Create new
        const id = await ctx.db.insert('assessments', {
          userId: args.userId,
          analysisId: args.analysisId,
          technology: assessment.technology,
          level: assessment.level,
          createdAt: Date.now(),
        })
        results.push(id)
      }
    }

    return results
  },
})

export const remove = mutation({
  args: { id: v.id('assessments') },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id)
  },
})
