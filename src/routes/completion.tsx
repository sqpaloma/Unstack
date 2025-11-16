import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useMemo } from 'react'
import { Trophy, Share2, CheckCircle2, PartyPopper, Sparkles, Home } from 'lucide-react'
import { Id } from '../../convex/_generated/dataModel'
import confetti from 'canvas-confetti'
import { useEffect } from 'react'

export const Route = createFileRoute('/completion')({
  component: CompletionPage,
  validateSearch: (search: Record<string, unknown>): { planId: string } => {
    return {
      planId: (search.planId as string) || '',
    }
  },
})

function CompletionPage() {
  const { user } = useUser()
  const navigate = useNavigate()
  const { planId } = Route.useSearch()

  // Fetch Convex user
  const convexUser = useQuery(
    api.users.getByClerkId,
    user ? { clerkId: user.id } : 'skip'
  )

  // Fetch the specific plan
  const plans = useQuery(
    api.plans.getByUser,
    convexUser ? { userId: convexUser._id } : 'skip'
  )

  const plan = useMemo(() => {
    return plans?.find((p) => p._id === planId)
  }, [plans, planId])

  // Fetch all progress for this plan
  const allProgress = useQuery(api.progress.list, {})

  const completedModules = useMemo(() => {
    if (!plan || !allProgress) return []

    const planProgress = allProgress.filter(
      (p) => p.planId === plan._id && p.completedAt
    )

    return plan.modules
      .map((module, idx) => ({
        ...module,
        moduleIndex: idx,
        completedAt: planProgress.find((p) => p.moduleIndex === idx)?.completedAt,
      }))
      .filter((m) => m.completedAt)
      .sort((a, b) => {
        if (!a.completedAt || !b.completedAt) return 0
        return a.completedAt - b.completedAt
      })
  }, [plan, allProgress])

  const totalHours = useMemo(() => {
    return completedModules.reduce((sum, module) => sum + module.estimatedHours, 0)
  }, [completedModules])

  // Confetti effect on load
  useEffect(() => {
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: NodeJS.Timeout = setInterval(function () {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  const handleShare = async () => {
    const shareText = `🎉 I just completed my ${plan?.technology.replace(/-/g, ' ')} study plan on Unstack! 🚀\n\n✅ ${completedModules.length} modules completed\n⏱️ ${totalHours} hours of learning\n\n#LearnToCode #Unstack`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Study Plan Completed!',
          text: shareText,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText)
        alert('Share text copied to clipboard!')
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Plan Not Found</h2>
          <p className="text-gray-400 mb-6">
            The study plan you're looking for doesn't exist.
          </p>
          <Link
            to="/dashboard"
            className="inline-block px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <SignedOut>
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Restricted Access</h2>
            <p className="text-gray-400 mb-6">
              You need to be authenticated to access this page.
            </p>
            <a
              href="/sign-in"
              className="inline-block px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
            >
              Sign In
            </a>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header with Celebration */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-4 mb-6">
                <PartyPopper className="w-16 h-16 text-yellow-400 animate-bounce" />
                <Trophy className="w-20 h-20 text-yellow-400" />
                <Sparkles className="w-16 h-16 text-yellow-400 animate-pulse" />
              </div>

              <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
                <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">
                  CONGRATULATIONS!
                </span>
              </h1>

              <p className="text-2xl md:text-3xl text-white mb-4 capitalize">
                You completed the{' '}
                <span className="font-bold text-cyan-400">
                  {plan.technology.replace(/-/g, ' ')}
                </span>{' '}
                study plan!
              </p>

              <p className="text-lg text-gray-300">
                You've successfully finished all {completedModules.length} modules
              </p>
            </div>

            {/* Stats Card */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800/50 rounded-lg p-6 text-center">
                  <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-white mb-1">
                    {completedModules.length}
                  </p>
                  <p className="text-gray-400">Modules Completed</p>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-6 text-center">
                  <Trophy className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-white mb-1">100%</p>
                  <p className="text-gray-400">Progress</p>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-6 text-center">
                  <Sparkles className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-white mb-1">{totalHours}h</p>
                  <p className="text-gray-400">Hours Invested</p>
                </div>
              </div>
            </div>

            {/* Completed Modules List */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <CheckCircle2 className="w-7 h-7 text-green-400" />
                Modules Completed
              </h2>

              <div className="space-y-3">
                {completedModules.map((module) => (
                  <div
                    key={module.moduleIndex}
                    className="flex items-start gap-4 p-4 bg-green-900/20 border border-green-500/30 rounded-lg"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" fill="currentColor" />
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-1">{module.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">{module.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>⏱️ {module.estimatedHours}h</span>
                        {module.completedAt && (
                          <span>
                            ✅ Completed on {new Date(module.completedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all shadow-lg shadow-cyan-500/50"
              >
                <Share2 className="w-5 h-5" />
                Share Your Achievement
              </button>

              <Link
                to="/dashboard"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
              >
                <Home className="w-5 h-5" />
                Back to Dashboard
              </Link>
            </div>

            {/* Motivational Message */}
            <div className="mt-8 text-center">
              <p className="text-gray-400 text-lg">
                🎯 Keep up the great work! Continue learning and growing your skills.
              </p>
            </div>
          </div>
        </div>
      </SignedIn>
    </>
  )
}
