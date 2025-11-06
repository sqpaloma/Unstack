import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useUser } from "@clerk/clerk-react";
import { useAction, useQuery } from "convex/react";
import { useState, useEffect } from "react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import * as Sentry from "@sentry/tanstackstart-react";
import {
	Github,
	Code2,
	Loader2,
	CheckCircle2,
	AlertCircle,
	ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/analyze")({
	component: AnalyzePage,
});

function AnalyzePage() {
	const { user } = useUser();
	const navigate = useNavigate();

	const [githubUrl, setGithubUrl] = useState("");
	const [codeSnippet, setCodeSnippet] = useState("");
	const [analysisId, setAnalysisId] = useState<Id<"githubAnalysis"> | null>(
		null,
	);
	const [isAnalyzing, setIsAnalyzing] = useState(false);

	const convexUser = useQuery(
		api.users.getByClerkId,
		user ? { clerkId: user.id } : "skip",
	);

	const createAndAnalyzeFromUrl = useAction(
		api.analysis.createAndAnalyzeFromUrl,
	);
	const createAndAnalyzeFromCode = useAction(
		api.analysis.createAndAnalyzeFromCode,
	);

	const analysis = useQuery(
		api.analysis.getById,
		analysisId ? { id: analysisId } : "skip",
	);

	const isValidGitHubUrl = (url: string) => {
		const pattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+/;
		return pattern.test(url.trim());
	};

	const handleAnalyze = async () => {
		if (!githubUrl && !codeSnippet) {
			alert("Por favor, insira uma URL do GitHub ou um trecho de código");
			return;
		}

		if (githubUrl && !isValidGitHubUrl(githubUrl)) {
			alert(
				"Por favor, insira uma URL válida do GitHub (ex: https://github.com/owner/repo)",
			);
			return;
		}

		setIsAnalyzing(true);

		Sentry.captureMessage("analyze_started", {
			level: "info",
			extra: {
				userId: convexUser?._id,
				hasGithubUrl: !!githubUrl,
				hasCodeSnippet: !!codeSnippet,
			},
		});

		try {
			let newAnalysisId: string;

			if (githubUrl) {
				// Análise via URL do GitHub
				newAnalysisId = await createAndAnalyzeFromUrl({
					githubUrl,
					userId: convexUser?._id,
				});
			} else {
				// Análise via código manual
				newAnalysisId = await createAndAnalyzeFromCode({
					codeSnippet,
					userId: convexUser?._id,
				});
			}

			setAnalysisId(newAnalysisId);

			Sentry.captureMessage("analyze_success", {
				level: "info",
				extra: {
					userId: convexUser?._id,
					analysisId: newAnalysisId,
				},
			});
		} catch (error) {
			console.error("Error analyzing:", error);
			Sentry.captureException(error, {
				extra: {
					userId: convexUser?._id,
					githubUrl,
					hasCodeSnippet: !!codeSnippet,
				},
			});
			alert("Erro ao analisar: " + (error as Error).message);
			setIsAnalyzing(false);
		}
	};

	// Poll analysis status
	useEffect(() => {
		if (analysis) {
			if (analysis.status === "done") {
				setIsAnalyzing(false);
			} else if (analysis.status === "failed") {
				setIsAnalyzing(false);
				alert("Análise falhou: " + (analysis.error || "Erro desconhecido"));
			}
		}
	}, [analysis?.status]);

	const handleContinueToOptions = () => {
		if (!analysisId) return;

		Sentry.captureMessage("analyze_continue_clicked", {
			level: "info",
			extra: {
				userId: convexUser?._id,
				analysisId,
			},
		});

		navigate({
			to: "/options",
			search: { analysisId },
		});
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12 px-6">
			<div className="max-w-4xl mx-auto">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-white mb-4">
						Analisar Repositório
					</h1>
					<p className="text-gray-400 text-lg">
						Cole a URL do GitHub ou um trecho de código para começar
					</p>
				</div>

				{!analysisId ? (
					<div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
						<div className="space-y-6">
							<div>
								<label className="flex items-center gap-2 text-white font-semibold mb-3">
									<Github className="w-5 h-5 text-cyan-400" />
									URL do GitHub
								</label>
								<input
									type="url"
									value={githubUrl}
									onChange={(e) => setGithubUrl(e.target.value)}
									placeholder="https://github.com/owner/repo"
									className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
									disabled={isAnalyzing}
								/>
							</div>

							<div className="flex items-center gap-4">
								<div className="flex-1 h-px bg-slate-700"></div>
								<span className="text-gray-500 text-sm">OU</span>
								<div className="flex-1 h-px bg-slate-700"></div>
							</div>

							<div>
								<label className="flex items-center gap-2 text-white font-semibold mb-3">
									<Code2 className="w-5 h-5 text-cyan-400" />
									Trecho de código (opcional)
								</label>
								<textarea
									value={codeSnippet}
									onChange={(e) => setCodeSnippet(e.target.value)}
									placeholder="Cole aqui trechos do seu package.json, imports, ou qualquer código relevante..."
									rows={8}
									className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors font-mono text-sm resize-none"
									disabled={isAnalyzing}
								/>
								<p className="text-gray-500 text-sm mt-2">
									Isso pode ajudar a detectar tecnologias adicionais
								</p>
							</div>

							<button
								onClick={handleAnalyze}
								disabled={isAnalyzing || (!githubUrl && !codeSnippet)}
								className="w-full px-8 py-4 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/50 flex items-center justify-center gap-2"
							>
								{isAnalyzing ? (
									<>
										<Loader2 className="w-5 h-5 animate-spin" />
										Analisando...
									</>
								) : (
									<>
										Analisar repositório
										<ArrowRight className="w-5 h-5" />
									</>
								)}
							</button>
						</div>
					</div>
				) : (
					<div className="space-y-6">
						<div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
							<div className="flex items-center gap-4 mb-6">
								{analysis?.status === "analyzing" && (
									<>
										<Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
										<div>
											<h2 className="text-xl font-semibold text-white">
												Analisando...
											</h2>
											<p className="text-gray-400">
												Detectando tecnologias do repositório
											</p>
										</div>
									</>
								)}
								{analysis?.status === "done" && (
									<>
										<CheckCircle2 className="w-8 h-8 text-green-400" />
										<div>
											<h2 className="text-xl font-semibold text-white">
												Análise concluída!
											</h2>
											<p className="text-gray-400">
												{analysis.detectedTechs?.length || 0} tecnologias
												detectadas
											</p>
										</div>
									</>
								)}
								{analysis?.status === "failed" && (
									<>
										<AlertCircle className="w-8 h-8 text-red-400" />
										<div>
											<h2 className="text-xl font-semibold text-white">
												Falha na análise
											</h2>
											<p className="text-gray-400">
												{analysis.error || "Erro desconhecido"}
											</p>
										</div>
									</>
								)}
							</div>

							{analysis?.status === "done" && analysis.detectedTechs && (
								<>
									<div className="mb-6">
										<h3 className="text-lg font-semibold text-white mb-4">
											Tecnologias detectadas
										</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
											{analysis.detectedTechs.map((tech) => (
												<div
													key={tech.key}
													className="bg-slate-700/50 border border-slate-600 rounded-lg p-4"
												>
													<div className="flex items-start justify-between">
														<div>
															<p className="text-white font-semibold">
																{tech.name}
															</p>
															<p className="text-gray-400 text-sm capitalize">
																{tech.category}
																{tech.version && ` • v${tech.version}`}
															</p>
														</div>
														<span className="text-cyan-400 text-sm">
															{Math.round(tech.confidence * 100)}%
														</span>
													</div>
												</div>
											))}
										</div>
									</div>

									{analysis.analysisSummary && (
										<div className="mb-6">
											<h3 className="text-lg font-semibold text-white mb-2">
												Resumo
											</h3>
											<p className="text-gray-400 leading-relaxed">
												{analysis.analysisSummary}
											</p>
										</div>
									)}

									<button
										onClick={handleContinueToOptions}
										className="w-full px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/50 flex items-center justify-center gap-2"
									>
										Continuar para autoavaliação
										<ArrowRight className="w-5 h-5" />
									</button>
								</>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
