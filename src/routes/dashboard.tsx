import { createFileRoute, Link } from '@tanstack/react-router'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useMemo } from 'react'
import { BookOpen, Trophy, Target, TrendingUp, CheckCircle2 } from 'lucide-react'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

interface TechProgress {
  technology: string
  planId: string
  totalModules: number
  completedModules: number
  percentage: number
  estimatedHours: number
}

function DashboardPage() {
  const { user } = useUser()

  // Fetch Convex user
  const convexUser = useQuery(
    api.users.getByClerkId,
    user ? { clerkId: user.id } : 'skip'
  )

  // Fetch user's plans
  const plans = useQuery(
    api.plans.getByUser,
    convexUser ? { userId: convexUser._id } : 'skip'
  )

  // Fetch all progress
  const allProgress = useQuery(api.progress.list, {})

  // Calculate progress per technology
  const techProgress = useMemo((): TechProgress[] => {
    if (!plans || !allProgress) return []

    return plans.map((plan) => {
      const totalModules = plan.modules.length
      const planProgress = allProgress.filter(
        (p) => p.planId === plan._id && p.completedAt
      )
      const completedModules = planProgress.length
      const percentage =
        totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0

      const estimatedHours = plan.modules.reduce(
        (sum, module) => sum + module.estimatedHours,
        0
      )

      return {
        technology: plan.technology,
        planId: plan._id,
        totalModules,
        completedModules,
        percentage,
        estimatedHours,
      }
    })
  }, [plans, allProgress])

  // Calculate global progress
  const globalProgress = useMemo(() => {
    if (techProgress.length === 0) {
      return { percentage: 0, totalModules: 0, completedModules: 0, totalHours: 0 }
    }

    const totalModules = techProgress.reduce((sum, tech) => sum + tech.totalModules, 0)
    const completedModules = techProgress.reduce(
      (sum, tech) => sum + tech.completedModules,
      0
    )
    const percentage =
      totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0
    const totalHours = techProgress.reduce((sum, tech) => sum + tech.estimatedHours, 0)

    return { percentage, totalModules, completedModules, totalHours }
  }, [techProgress])

  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return 'text-green-400 bg-green-500/20 border-green-500/50'
    if (percentage >= 50) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50'
    if (percentage >= 25) return 'text-orange-400 bg-orange-500/20 border-orange-500/50'
    return 'text-red-400 bg-red-500/20 border-red-500/50'
  }

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 75) return 'bg-green-500'
    if (percentage >= 50) return 'bg-yellow-500'
    if (percentage >= 25) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <>
      <SignedOut>
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Acesso Restrito</h2>
            <p className="text-gray-400 mb-6">
              Você precisa estar autenticado para acessar esta página.
            </p>
            <a
              href="/sign-in"
              className="inline-block px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
            >
              Fazer Login
            </a>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-gray-400">
                Acompanhe seu progresso nos planos de estudo
              </p>
            </div>

            {/* No plans state */}
            {(!plans || plans.length === 0) && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 text-center">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Nenhum Plano Criado
                </h2>
                <p className="text-gray-400 mb-6">
                  Comece analisando um repositório e criando seu plano de estudos
                  personalizado.
                </p>
                <Link
                  to="/options"
                  className="inline-block px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Criar Plano de Estudos
                </Link>
              </div>
            )}

            {/* Global Progress Card */}
            {plans && plans.length > 0 && (
              <>
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-8 mb-8">
                  <div className="flex items-center gap-4 mb-6">
                    <Trophy className="w-12 h-12 text-cyan-400" />
                    <div>
                      <h2 className="text-3xl font-bold text-white">
                        Progresso Global
                      </h2>
                      <p className="text-gray-300">
                        {techProgress.length} tecnologias em aprendizado
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Target className="w-5 h-5 text-cyan-400" />
                        <span className="text-gray-400 text-sm">Conclusão</span>
                      </div>
                      <p className="text-3xl font-bold text-white">
                        {globalProgress.percentage}%
                      </p>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                        <span className="text-gray-400 text-sm">Módulos</span>
                      </div>
                      <p className="text-3xl font-bold text-white">
                        {globalProgress.completedModules}/{globalProgress.totalModules}
                      </p>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="w-5 h-5 text-purple-400" />
                        <span className="text-gray-400 text-sm">Tecnologias</span>
                      </div>
                      <p className="text-3xl font-bold text-white">
                        {techProgress.length}
                      </p>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-5 h-5 text-orange-400" />
                        <span className="text-gray-400 text-sm">Horas Totais</span>
                      </div>
                      <p className="text-3xl font-bold text-white">
                        {globalProgress.totalHours}h
                      </p>
                    </div>
                  </div>

                  {/* Global Progress Bar */}
                  <div className="w-full bg-slate-700/50 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${getProgressBarColor(
                        globalProgress.percentage
                      )}`}
                      style={{ width: `${globalProgress.percentage}%` }}
                    />
                  </div>
                </div>

                {/* Technology Progress Cards */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Progresso por Tecnologia
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {techProgress.map((tech) => (
                      <Link
                        key={tech.planId}
                        to="/plan"
                        search={{ analysisId: plans[0]?.analysisId }}
                        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-xl font-semibold text-white capitalize group-hover:text-cyan-400 transition-colors">
                            {tech.technology.replace(/-/g, ' ')}
                          </h3>
                          <div
                            className={`px-3 py-1 rounded-full text-sm font-semibold border ${getProgressColor(
                              tech.percentage
                            )}`}
                          >
                            {tech.percentage}%
                          </div>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Módulos</span>
                            <span className="text-white font-medium">
                              {tech.completedModules}/{tech.totalModules}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Horas estimadas</span>
                            <span className="text-white font-medium">
                              {tech.estimatedHours}h
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${getProgressBarColor(
                              tech.percentage
                            )}`}
                            style={{ width: `${tech.percentage}%` }}
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Link
                    to="/plan"
                    search={{ analysisId: plans[0]?.analysisId }}
                    className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    Continuar Estudando
                  </Link>
                  <Link
                    to="/options"
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    Criar Novo Plano
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </SignedIn>
    </>
  )
}
