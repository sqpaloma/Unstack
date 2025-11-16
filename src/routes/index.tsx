import { useUser } from "@clerk/clerk-react";
import * as Sentry from "@sentry/tanstackstart-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAction, useMutation, useQuery } from "convex/react";
import {
	AlertCircle,
	ArrowRight,
	CheckCircle2,
	Code2,
	Github,
	Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Footer } from "@/components/home/Footer";
import { HowItWorks } from "@/components/home/HowItWorks";
import { TrustStrip } from "@/components/home/TrustStrip";
import { WhatWeDetect } from "@/components/home/WhatWeDetect";
import { WhyUse } from "@/components/home/WhyUse";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

type AssessmentLevel = "sei" | "nocao" | "nao_sei";

export const Route = createFileRoute("/")({
	component: HomePage,
});

function HomePage() {
	const { user } = useUser();
	const navigate = useNavigate();

	const [githubUrl, setGithubUrl] = useState("");
	const [codeSnippet, setCodeSnippet] = useState("");
	const [analysisId, setAnalysisId] = useState<Id<"githubAnalysis"> | null>(
		null,
	);
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
	const [assessments, setAssessments] = useState<
		Record<string, AssessmentLevel>
	>({});

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
	const saveAssessments = useMutation(api.assessments.save);
	const generatePlanAction = useAction(api.plans.generate);
	const plans = useQuery(api.plans.list, {});
	const plan = plans?.find((p) => p.analysisId === analysisId);

	const analysis = useQuery(
		api.analysis.getById,
		analysisId ? { id: analysisId } : "skip",
	);

	const allAssessed =
		analysis?.status === "done" &&
		analysis.detectedTechs &&
		analysis.detectedTechs.length > 0 &&
		analysis.detectedTechs.every((tech) => assessments[tech.key]);

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

			setAnalysisId(newAnalysisId as unknown as Id<"githubAnalysis">);

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
		if (analysis && analysis.status && analysis.error) {
			if (analysis.status === "done") {
				setIsAnalyzing(false);
			} else if (analysis.status === "failed") {
				setIsAnalyzing(false);
				alert("Análise falhou: " + (analysis.error || "Erro desconhecido"));
			}
		}
	}, [analysis]);

	const handleAssessmentChange = (techKey: string, level: AssessmentLevel) => {
		setAssessments((prev) => ({
			...prev,
			[techKey]: level,
		}));
	};

	const handleContinueToGenerate = async () => {
		if (!analysisId || !allAssessed) return;

		setIsGeneratingPlan(true);

		Sentry.captureMessage("analyze_generate_plan_clicked", {
			level: "info",
			extra: {
				userId: convexUser?._id,
				analysisId,
			},
		});

		try {
			// Salvar avaliações
			await saveAssessments({
				userId: convexUser?._id,
				analysisId,
				assessments: Object.entries(assessments).map(([key, level]) => {
					const tech = analysis?.detectedTechs?.find((t) => t.key === key);
					return {
						technology: tech?.key || key,
						level,
					};
				}),
			});

			// Gerar plano automaticamente
			Sentry.captureMessage("plan_generate_started", {
				level: "info",
				extra: {
					userId: convexUser?._id,
					analysisId,
				},
			});

			await generatePlanAction({
				userId: convexUser?._id,
				analysisId,
			});

			Sentry.captureMessage("plan_generate_success", {
				level: "info",
				extra: {
					userId: convexUser?._id,
					analysisId,
				},
			});

			// Navegar para /plan
			navigate({
				to: "/completion",
				search: { planId: plan?._id as string },
			});
		} catch (error) {
			console.error("Error saving assessments or generating plan:", error);
			Sentry.captureException(error, {
				extra: {
					userId: convexUser?._id,
					analysisId,
				},
			});
			alert("Erro ao gerar plano: " + (error as Error).message);
		} finally {
			setIsGeneratingPlan(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12 px-6">
			<div className="max-w-4xl mx-auto">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-white mb-4">
						Analyze Repository
					</h1>
					<p className="text-gray-400 text-lg">
						Paste the GitHub URL or a code snippet to get started
					</p>
				</div>

				{!analysisId ? (
					<div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
						<div className="space-y-6">
							<div>
								<label
									htmlFor="githubUrl"
									className="flex items-center gap-2 text-white font-semibold mb-3"
								>
									<Github className="w-5 h-5 text-cyan-400" />
									GitHub URL
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
								<span className="text-gray-500 text-sm">OR</span>
								<div className="flex-1 h-px bg-slate-700"></div>
							</div>

							<div>
								<label
									htmlFor="codeSnippet"
									className="flex items-center gap-2 text-white font-semibold mb-3"
								>
									<Code2 className="w-5 h-5 text-cyan-400" />
									Code snippet (optional)
								</label>
								<textarea
									value={codeSnippet}
									onChange={(e) => setCodeSnippet(e.target.value)}
									placeholder="Paste snippets from your package.json, imports, or any relevant code..."
									rows={8}
									className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors font-mono text-sm resize-none"
									disabled={isAnalyzing}
								/>
								<p className="text-gray-500 text-sm mt-2">
									This can help detect additional technologies
								</p>
							</div>

							<button
								type="button"
								onClick={handleAnalyze}
								disabled={isAnalyzing || (!githubUrl && !codeSnippet)}
								className="w-full px-8 py-4 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/50 flex items-center justify-center gap-2"
							>
								{isAnalyzing ? (
									<>
										<Loader2 className="w-5 h-5 animate-spin" />
										Analyzing...
									</>
								) : (
									<>
										Analyze repository
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
												Analyzing...
											</h2>
											<p className="text-gray-400">
												Detecting repository technologies
											</p>
										</div>
									</>
								)}
								{analysis?.status === "done" && (
									<>
										<CheckCircle2 className="w-8 h-8 text-green-400" />
										<div>
											<h2 className="text-xl font-semibold text-white">
												Analysis complete!
											</h2>
											<p className="text-gray-400">
												{analysis.detectedTechs?.length || 0} technologies
												detected
											</p>
										</div>
									</>
								)}
								{analysis?.status === "failed" && (
									<>
										<AlertCircle className="w-8 h-8 text-red-400" />
										<div>
											<h2 className="text-xl font-semibold text-white">
												Analysis failed
											</h2>
											<p className="text-gray-400">
												{analysis.error || "Unknown error"}
											</p>
										</div>
									</>
								)}
							</div>

							{analysis?.status === "done" && analysis.detectedTechs && (
								<>
									<div className="mb-6">
										<h3 className="text-lg font-semibold text-white mb-2">
											Assess your knowledge of each technology
										</h3>
										<p className="text-gray-400 text-sm mb-4">
											This will help personalize your study plan
										</p>
										<div className="space-y-4">
											{analysis.detectedTechs.map((tech) => (
												<div
													key={tech.key}
													className="bg-slate-700/50 border border-slate-600 rounded-lg p-4"
												>
													<div className="flex items-start justify-between mb-3">
														<div>
															<p className="text-white font-semibold">
																{tech.name}
															</p>
															<p className="text-gray-400 text-sm capitalize">
																{tech.category}
																{tech.version && " • v${tech.version}"}
															</p>
														</div>
														<span className="text-cyan-400 text-sm">
															{Math.round(tech.confidence * 100)}%
														</span>
													</div>

													<div className="flex gap-2">
														<button
															type="button"
															onClick={() =>
																handleAssessmentChange(tech.key, "sei")
															}
															className={`flex-1 px-4 py-2 rounded-full font-medium transition-all flex items-center justify-center gap-2 ${
																assessments[tech.key] === "sei"
																	? "bg-transparent text-green-400 border-2 border-green-500"
																	: "bg-transparent text-gray-300 border-2 border-slate-600 hover:border-cyan-400"
															}`}
														>
															{assessments[tech.key] === "sei" && (
																<CheckCircle2
																	className="w-4 h-4"
																	fill="currentColor"
																/>
															)}
															Know
														</button>
														<button
															type="button"
															onClick={() =>
																handleAssessmentChange(tech.key, "nocao")
															}
															className={`flex-1 px-4 py-2 rounded-full font-medium transition-all flex items-center justify-center gap-2 ${
																assessments[tech.key] === "nocao"
																	? "bg-transparent text-yellow-400 border-2 border-yellow-500"
																	: "bg-transparent text-gray-300 border-2 border-slate-600 hover:border-cyan-400"
															}`}
														>
															{assessments[tech.key] === "nocao" && (
																<CheckCircle2
																	className="w-4 h-4"
																	fill="currentColor"
																/>
															)}
															Heard of it
														</button>
														<button
															type="button"
															onClick={() =>
																handleAssessmentChange(tech.key, "nao_sei")
															}
															className={`flex-1 px-4 py-2 rounded-full font-medium transition-all flex items-center justify-center gap-2 ${
																assessments[tech.key] === "nao_sei"
																	? "bg-transparent text-red-400 border-2 border-red-500"
																	: "bg-transparent text-gray-300 border-2 border-slate-600 hover:border-cyan-400"
															}`}
														>
															{assessments[tech.key] === "nao_sei" && (
																<CheckCircle2
																	className="w-4 h-4"
																	fill="currentColor"
																/>
															)}
															Don't know
														</button>
													</div>
												</div>
											))}
										</div>
									</div>

									{analysis.analysisSummary && (
										<div className="mb-6">
											<h3 className="text-lg font-semibold text-white mb-2">
												Summary
											</h3>
											<p className="text-gray-400 leading-relaxed">
												{analysis.analysisSummary}
											</p>
										</div>
									)}

									<button
										type="button"
										onClick={handleContinueToGenerate}
										disabled={!allAssessed || isGeneratingPlan}
										className="w-full px-8 py-4 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/50 flex items-center justify-center gap-2"
									>
										{isGeneratingPlan ? (
											<>
												<Loader2 className="w-5 h-5 animate-spin" />
												Generating plan...
											</>
										) : allAssessed ? (
											<>
												Generate study plan
												<ArrowRight className="w-5 h-5" />
											</>
										) : (
											"Assess all technologies to continue"
										)}
									</button>
								</>
							)}
						</div>
					</div>
				)}
			</div>
			<TrustStrip />
			<HowItWorks />
			<WhatWeDetect />
			<WhyUse />
			<Footer />
		</div>
	);
}
