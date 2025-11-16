import { createFileRoute, Link } from '@tanstack/react-router'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useMemo, useState } from 'react'
import { BookOpen, Trophy, Target, TrendingUp, CheckCircle2, Clock, ArrowRight, Filter, Trash2 } from 'lucide-react'
import { Id } from '../../convex/_generated/dataModel'

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
  nextModules: { moduleIndex: number; title: string; estimatedHours: number }[]
}

interface NextTask {
  technology: string
  planId: Id<'plans'>
  moduleIndex: number
  moduleTitle: string
  estimatedHours: number
}

function DashboardPage() {
  const { user } = useUser()
  const [selectedTech, setSelectedTech] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

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

  // Mutation for toggling items
  const toggleItemMutation = useMutation(api.progress.toggleItem)
  const removePlanMutation = useMutation(api.plans.remove)

  // Calculate progress per technology
  const techProgress = useMemo((): TechProgress[] => {
    if (!plans || !allProgress) return []

    return plans.map((plan) => {
      const totalModules = plan.modules.length
      const planProgress = allProgress.filter(
        (p) => p.planId === plan._id && p.completedAt
      )
      const completedModulesIndexes = new Set(
        planProgress.map((p) => p.moduleIndex)
      )
      const completedModules = planProgress.length
      const percentage =
        totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0

      const estimatedHours = plan.modules.reduce(
        (sum, module) => sum + module.estimatedHours,
        0
      )

      // Find next incomplete modules (up to 3)
      const nextModules = plan.modules
        .map((module, idx) => ({
          moduleIndex: idx,
          title: module.title,
          estimatedHours: module.estimatedHours,
          completed: completedModulesIndexes.has(idx),
        }))
        .filter((m) => !m.completed)
        .slice(0, 3)
        .map(({ moduleIndex, title, estimatedHours }) => ({
          moduleIndex,
          title,
          estimatedHours,
        }))

      return {
        technology: plan.technology,
        planId: plan._id,
        totalModules,
        completedModules,
        percentage,
        estimatedHours,
        nextModules,
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

  // Get "Continue from where you left off" tasks
  const nextTasks = useMemo((): NextTask[] => {
    const tasks: NextTask[] = []

    techProgress.forEach((tech) => {
      tech.nextModules.forEach((module) => {
        tasks.push({
          technology: tech.technology,
          planId: tech.planId as Id<'plans'>,
          moduleIndex: module.moduleIndex,
          moduleTitle: module.title,
          estimatedHours: module.estimatedHours,
        })
      })
    })

    // Sort by technology and return first 3
    return tasks.slice(0, 3)
  }, [techProgress])

  // Filter tech progress
  const filteredTechProgress = useMemo(() => {
    let filtered = techProgress

    // Filter by technology
    if (selectedTech !== 'all') {
      filtered = filtered.filter((tech) => tech.technology === selectedTech)
    }

    // Filter by status
    if (selectedStatus === 'pending') {
      filtered = filtered.filter((tech) => tech.percentage < 100)
    } else if (selectedStatus === 'completed') {
      filtered = filtered.filter((tech) => tech.percentage === 100)
    }

    return filtered
  }, [techProgress, selectedTech, selectedStatus])

  // Check if module is completed
  const isModuleCompleted = (planId: Id<'plans'>, moduleIndex: number) => {
    if (!allProgress) return false
    return allProgress.some(
      (p) => p.planId === planId && p.moduleIndex === moduleIndex && p.completedAt
    )
  }

  // Toggle module handler
  const handleToggleModule = async (
    e: React.MouseEvent,
    planId: Id<'plans'>,
    technology: string,
    moduleIndex: number
  ) => {
    e.preventDefault() // Prevent Link navigation
    e.stopPropagation()

    if (!convexUser) return

    try {
      await toggleItemMutation({
        userId: convexUser._id,
        planId,
        technology,
        moduleIndex,
      })
    } catch (error) {
      console.error('Error toggling module:', error)
    }
  }

  // Delete plan handler
  const handleDeletePlan = async (
    e: React.MouseEvent,
    planId: Id<'plans'>,
    technology: string
  ) => {
    e.preventDefault()
    e.stopPropagation()

    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o plano de estudos para ${technology.replace(/-/g, ' ')}? Esta ação não pode ser desfeita.`
    )

    if (!confirmed) return

    try {
      await removePlanMutation({ id: planId })
    } catch (error) {
      console.error('Error deleting plan:', error)
      alert('Erro ao excluir plano: ' + (error as Error).message)
    }
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

                {/* Continue from where you left off */}
                {nextTasks.length > 0 && (
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <ArrowRight className="w-6 h-6 text-cyan-400" />
                      <h2 className="text-2xl font-bold text-white">
                        Continuar de onde parei
                      </h2>
                    </div>
                    <div className="space-y-3">
                      {nextTasks.map((task, idx) => {
                        const isCompleted = isModuleCompleted(task.planId, task.moduleIndex)
                        return (
                          <div
                            key={`${task.planId}-${task.moduleIndex}`}
                            className={`flex items-center justify-between p-4 rounded-lg transition-all border ${
                              isCompleted
                                ? 'bg-green-900/20 border-green-500/50'
                                : 'bg-slate-900/50 border-slate-600 hover:bg-slate-700/50 hover:border-cyan-500/50'
                            }`}
                          >
                            <div className="flex items-center gap-4 flex-1">
                              <label className="flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={isCompleted}
                                  onChange={(e) =>
                                    handleToggleModule(
                                      e as any,
                                      task.planId,
                                      task.technology,
                                      task.moduleIndex
                                    )
                                  }
                                  className="w-5 h-5 text-green-500 bg-slate-700 border-slate-600 rounded focus:ring-green-500 focus:ring-2"
                                />
                              </label>
                              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 font-bold">
                                {idx + 1}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-gray-400 capitalize mb-1">
                                  {task.technology.replace(/-/g, ' ')}
                                </p>
                                <Link
                                  to="/plan"
                                  search={{ analysisId: plans[0]?.analysisId }}
                                  className={`font-medium hover:text-cyan-400 transition-colors ${
                                    isCompleted ? 'text-green-400 line-through' : 'text-white'
                                  }`}
                                >
                                  {task.moduleTitle}
                                </Link>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2 text-gray-400">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">{task.estimatedHours}h</span>
                              </div>
                              <Link
                                to="/plan"
                                search={{ analysisId: plans[0]?.analysisId }}
                                className="text-gray-400 hover:text-cyan-400 transition-colors"
                              >
                                <ArrowRight className="w-5 h-5" />
                              </Link>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Filters */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Filter className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-lg font-semibold text-white">Filtros</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Technology Filter */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Tecnologia
                      </label>
                      <select
                        value={selectedTech}
                        onChange={(e) => setSelectedTech(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                      >
                        <option value="all">Todas</option>
                        {techProgress.map((tech) => (
                          <option key={tech.planId} value={tech.technology}>
                            {tech.technology.replace(/-/g, ' ')}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Status
                      </label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                      >
                        <option value="all">Todos</option>
                        <option value="pending">Pendentes</option>
                        <option value="completed">Concluídos</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Technology Progress Cards */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Tecnologias ({filteredTechProgress.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTechProgress.map((tech) => (
                      <div
                        key={tech.planId}
                        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all relative"
                      >
                        {/* Delete button */}
                        <button
                          onClick={(e) =>
                            handleDeletePlan(
                              e,
                              tech.planId as Id<'plans'>,
                              tech.technology
                            )
                          }
                          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors z-10"
                          title="Excluir plano"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <Link
                          to="/plan"
                          search={{ analysisId: plans[0]?.analysisId }}
                          className="block"
                        >
                          <div className="flex items-start justify-between mb-4 pr-8">
                            <h3 className="text-xl font-semibold text-white capitalize hover:text-cyan-400 transition-colors">
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
                          <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden mb-4">
                            <div
                              className={`h-full transition-all duration-500 ${getProgressBarColor(
                                tech.percentage
                              )}`}
                              style={{ width: `${tech.percentage}%` }}
                            />
                          </div>
                        </Link>

                        {/* Next modules to complete */}
                        {tech.nextModules.length > 0 && (
                          <div className="border-t border-slate-700 pt-4">
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">
                              Próximos módulos
                            </p>
                            <div className="space-y-2">
                              {tech.nextModules.slice(0, 2).map((module) => {
                                const isCompleted = isModuleCompleted(
                                  tech.planId as Id<'plans'>,
                                  module.moduleIndex
                                )
                                return (
                                  <div
                                    key={module.moduleIndex}
                                    className="flex items-start gap-3"
                                  >
                                    <label className="flex items-center cursor-pointer mt-0.5">
                                      <input
                                        type="checkbox"
                                        checked={isCompleted}
                                        onChange={(e) =>
                                          handleToggleModule(
                                            e as any,
                                            tech.planId as Id<'plans'>,
                                            tech.technology,
                                            module.moduleIndex
                                          )
                                        }
                                        className="w-4 h-4 text-green-500 bg-slate-700 border-slate-600 rounded focus:ring-green-500 focus:ring-2"
                                      />
                                    </label>
                                    <div className="flex-1 min-w-0">
                                      <p
                                        className={`text-sm ${
                                          isCompleted
                                            ? 'text-green-400 line-through'
                                            : 'text-gray-300'
                                        }`}
                                      >
                                        {module.title}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {module.estimatedHours}h
                                      </p>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
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
