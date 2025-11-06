import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useState, useEffect } from 'react'
import { Id } from '../../convex/_generated/dataModel'

export const Route = createFileRoute('/options')({
  component: OptionsPage,
})

type TechLevel = 'sei' | 'nocao' | 'nao_sei'

interface TechAssessment {
  key: string
  name: string
  category: string
  level: TechLevel
}

function OptionsPage() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [assessments, setAssessments] = useState<TechAssessment[]>([])
  const [isSaving, setIsSaving] = useState(false)

  // Fetch Convex user by Clerk ID
  const convexUser = useQuery(
    api.users.getByClerkId,
    user ? { clerkId: user.id } : 'skip'
  )

  // Fetch latest analysis for the user
  const analyses = useQuery(api.analysis.list)
  const latestAnalysis = analyses?.[0]

  // Fetch existing assessments
  const existingAssessments = useQuery(
    api.assessments.getByAnalysis,
    latestAnalysis?._id ? { analysisId: latestAnalysis._id } : 'skip'
  )

  const saveMutation = useMutation(api.assessments.save)

  // Initialize assessments from detectedTechs
  useEffect(() => {
    if (latestAnalysis?.detectedTechs) {
      const techAssessments = latestAnalysis.detectedTechs.map((tech) => {
        const existing = existingAssessments?.find(
          (a) => a.technology === tech.key
        )
        return {
          key: tech.key,
          name: tech.name,
          category: tech.category,
          level: (existing?.level as TechLevel) || 'nao_sei',
        }
      })
      setAssessments(techAssessments)
    }
  }, [latestAnalysis, existingAssessments])

  const handleLevelChange = (techKey: string, level: TechLevel) => {
    setAssessments((prev) =>
      prev.map((tech) => (tech.key === techKey ? { ...tech, level } : tech))
    )
  }

  const handleSave = async () => {
    if (!user || !latestAnalysis || !convexUser) return

    setIsSaving(true)
    try {
      await saveMutation({
        userId: convexUser._id,
        analysisId: latestAnalysis._id,
        assessments: assessments.map((tech) => ({
          technology: tech.key,
          level: tech.level,
        })),
      })
      alert('Assessments salvos com sucesso!')
    } catch (error) {
      console.error('Error saving assessments:', error)
      alert('Erro ao salvar assessments')
    } finally {
      setIsSaving(false)
    }
  }

  const handleGeneratePlan = () => {
    // TODO: Implement plan generation
    navigate({ to: '/plan' })
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
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">
                Avalie seu Conhecimento
              </h1>
              <p className="text-gray-400">
                Avalie seu nível de conhecimento nas tecnologias detectadas no
                seu repositório
              </p>
            </div>

            {!latestAnalysis && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
                <p className="text-gray-400">
                  Nenhuma análise encontrada. Analise um repositório primeiro.
                </p>
              </div>
            )}

            {latestAnalysis && (
              <>
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-6">
                  <h2 className="text-xl font-semibold text-white mb-2">
                    Repositório Analisado
                  </h2>
                  <a
                    href={latestAnalysis.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {latestAnalysis.githubUrl}
                  </a>
                  {latestAnalysis.analysisSummary && (
                    <p className="text-gray-400 mt-2">
                      {latestAnalysis.analysisSummary}
                    </p>
                  )}
                </div>

                <div className="space-y-4 mb-8">
                  {assessments.map((tech) => (
                    <div
                      key={tech.key}
                      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {tech.name}
                          </h3>
                          <p className="text-sm text-gray-400 capitalize">
                            {tech.category}
                          </p>
                        </div>

                        <div className="flex gap-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`tech-${tech.key}`}
                              value="sei"
                              checked={tech.level === 'sei'}
                              onChange={() => handleLevelChange(tech.key, 'sei')}
                              className="w-4 h-4 text-cyan-500 focus:ring-cyan-500"
                            />
                            <span className="text-white">Sei</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`tech-${tech.key}`}
                              value="nocao"
                              checked={tech.level === 'nocao'}
                              onChange={() =>
                                handleLevelChange(tech.key, 'nocao')
                              }
                              className="w-4 h-4 text-cyan-500 focus:ring-cyan-500"
                            />
                            <span className="text-white">Noção</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`tech-${tech.key}`}
                              value="nao_sei"
                              checked={tech.level === 'nao_sei'}
                              onChange={() =>
                                handleLevelChange(tech.key, 'nao_sei')
                              }
                              className="w-4 h-4 text-cyan-500 focus:ring-cyan-500"
                            />
                            <span className="text-white">Não sei</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    {isSaving ? 'Salvando...' : 'Salvar Avaliação'}
                  </button>

                  <button
                    onClick={handleGeneratePlan}
                    className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    Gerar Plano de Estudos
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </SignedIn>
    </>
  )
}
