import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    createdAt: v.number(),
  }).index('by_clerk_id', ['clerkId']),

  githubAnalysis: defineTable({
    userId: v.optional(v.id('users')),
    githubUrl: v.string(),
    owner: v.string(),
    repo: v.string(),
    branch: v.optional(v.string()),
    status: v.union(v.literal('pending'), v.literal('analyzing'), v.literal('done'), v.literal('failed')),
    detectedTechs: v.optional(
      v.array(
        v.object({
          key: v.string(), // tanstack-router, clerk, convex, etc
          name: v.string(), // TanStack Router, Clerk, Convex, etc
          category: v.union(
            v.literal('language'),
            v.literal('framework'),
            v.literal('auth'),
            v.literal('db'),
            v.literal('infra'),
            v.literal('tool')
          ),
          version: v.optional(v.string()),
          confidence: v.number(), // 0.0 - 1.0
          sources: v.array(v.string()), // ['package.json', 'tsconfig.json']
        })
      )
    ),
    analysisSummary: v.optional(v.string()),
    error: v.optional(v.string()),
    createdAt: v.number(),
    analyzedAt: v.optional(v.number()),
  })
    .index('by_user', ['userId'])
    .index('by_status', ['status']),

  assessments: defineTable({
    userId: v.optional(v.id('users')),
    analysisId: v.optional(v.id('githubAnalysis')),
    technology: v.string(),
    level: v.union(v.literal('sei'), v.literal('nocao'), v.literal('nao_sei')),
    createdAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_analysis', ['analysisId'])
    .index('by_user_and_tech', ['userId', 'technology']),

  plans: defineTable({
    userId: v.optional(v.id('users')),
    analysisId: v.optional(v.id('githubAnalysis')),
    technology: v.string(),
    modules: v.array(
      v.object({
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
    ),
    createdAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_analysis', ['analysisId'])
    .index('by_user_and_tech', ['userId', 'technology']),

  progress: defineTable({
    userId: v.optional(v.id('users')),
    planId: v.id('plans'),
    technology: v.string(),
    moduleIndex: v.number(),
    completedAt: v.optional(v.number()),
    notes: v.optional(v.string()),
    timeSpentMinutes: v.optional(v.number()),
  })
    .index('by_user', ['userId'])
    .index('by_plan', ['planId'])
    .index('by_user_and_tech', ['userId', 'technology']),
})
