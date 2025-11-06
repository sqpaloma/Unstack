import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Id } from '../../convex/_generated/dataModel'
import { BookOpen, Clock, ExternalLink, CheckCircle2 } from 'lucide-react'

export const Route = createFileRoute('/plan')({
  component: PlanPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      analysisId: search.analysisId as string | undefined,
    }
  },
})

function PlanPage() {
  const { user } = useUser()
  const navigate = useNavigate()
  const { analysisId } = Route.useSearch()

  // Fetch Convex user
  const convexUser = useQuery(
    api.users.getByClerkId,
    user ? { clerkId: user.id } : 'skip'
  )

  // Fetch plans for this analysis
  const plans = useQuery(
    api.plans.getByAnalysis,
    analysisId ? { analysisId: analysisId as Id<'githubAnalysis'> } : 'skip'
  )

  // Fetch analysis for context
  const analysis = useQuery(
    api.analysis.getById,
    analysisId ? { id: analysisId as Id<'githubAnalysis'> } : 'skip'
  )

  const handleGoToDashboard = () => {
    navigate({ to: '/' })
  }

  const getTotalHours = () => {
    if (!plans) return 0
    return plans.reduce((total, plan) => {
      return (
        total +
        plan.modules.reduce((sum, module) => sum + module.estimatedHours, 0)
      )
    }, 0)
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'doc':
        return '📄'
      case 'video':
        return '🎥'
      case 'article':
        return '📰'
      case 'course':
        return '🎓'
      default:
        return '🔗'
    }
  }

  return (
    <>
      <SignedOut>
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">
              Acesso Restrito
            </h2>
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
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">
                Seu Plano de Estudos
              </h1>
              <p className="text-gray-400">
                Plano personalizado baseado nas tecnologias do seu projeto
              </p>
            </div>

            {!analysisId && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                <p className="text-gray-400">
                  Nenhum plano encontrado. Volte para{' '}
                  <a href="/options" className="text-cyan-400 hover:underline">
                    /options
                  </a>{' '}
                  e gere um plano primeiro.
                </p>
              </div>
            )}

            {analysisId && analysis && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-6">
                <h2 className="text-xl font-semibold text-white mb-2">
                  Repositório Analisado
                </h2>
                <a
                  href={analysis.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  {analysis.githubUrl}
                </a>
                {plans && plans.length > 0 && (
                  <div className="mt-4 flex items-center gap-4 text-gray-300">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      <span>{plans.length} tecnologias</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      <span>{getTotalHours()}h estimadas</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {plans && plans.length === 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                <p className="text-gray-400">
                  Nenhum plano gerado. Você já domina todas as tecnologias
                  detectadas! 🎉
                </p>
              </div>
            )}

            {plans && plans.length > 0 && (
              <div className="space-y-6 mb-8">
                {plans.map((plan) => (
                  <div
                    key={plan._id}
                    className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
                  >
                    <h2 className="text-2xl font-bold text-white mb-4 capitalize">
                      {plan.technology.replace(/-/g, ' ')}
                    </h2>

                    <div className="space-y-4">
                      {plan.modules.map((module, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-900/50 border border-slate-600 rounded-lg p-5"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-white mb-1">
                                {module.title}
                              </h3>
                              <p className="text-gray-400 text-sm">
                                {module.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Clock className="w-4 h-4 text-cyan-400" />
                              <span className="text-cyan-400 font-medium">
                                {module.estimatedHours}h
                              </span>
                            </div>
                          </div>

                          {module.resources.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                                Recursos
                              </p>
                              {module.resources.map((resource, resIdx) => (
                                <a
                                  key={resIdx}
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors group"
                                >
                                  <span className="text-xl">
                                    {getResourceIcon(resource.type)}
                                  </span>
                                  <span className="text-white group-hover:text-cyan-400 transition-colors flex-1">
                                    {resource.title}
                                  </span>
                                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-cyan-400" />
                                </a>
                              ))}
                            </div>
                          )}

                          {module.completed && (
                            <div className="mt-3 flex items-center gap-2 text-green-400">
                              <CheckCircle2 className="w-5 h-5" />
                              <span className="text-sm font-medium">
                                Concluído
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {plans && plans.length > 0 && (
              <div className="flex gap-4">
                <button
                  onClick={handleGoToDashboard}
                  className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Salvar e ir para Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </SignedIn>
    </>
  )
}
