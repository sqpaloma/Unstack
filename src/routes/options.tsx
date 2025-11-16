import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAction, useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import * as Sentry from "@sentry/tanstackstart-react";
import { Github, Code2, Loader2, CheckCircle2, AlertCircle, Plus } from "lucide-react";

export const Route = createFileRoute("/options")({
	component: OptionsPage,
});

type TechLevel = "sei" | "nocao" | "nao_sei";

interface TechAssessment {
	key: string;
	name: string;
	category: string;
	level: TechLevel;
}

function OptionsPage() {
	const { user } = useUser();
	const navigate = useNavigate();
	const [assessments, setAssessments] = useState<TechAssessment[]>([]);
	const [isSaving, setIsSaving] = useState(false);
	const [showNewAnalysis, setShowNewAnalysis] = useState(false);
	const [githubUrl, setGithubUrl] = useState("");
	const [codeSnippet, setCodeSnippet] = useState("");
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [newAnalysisId, setNewAnalysisId] = useState<Id<"githubAnalysis"> | null>(null);

	// Fetch Convex user by Clerk ID
	const convexUser = useQuery(
		api.users.getByClerkId,
		user ? { clerkId: user.id } : "skip",
	);

	// Fetch latest analysis for the user
	const analyses = useQuery(api.analysis.list);
	const latestAnalysis = analyses?.[0];

	// Fetch existing assessments
	const existingAssessments = useQuery(
		api.assessments.getByAnalysis,
		latestAnalysis?._id ? { analysisId: latestAnalysis._id } : "skip",
	);

	const saveMutation = useMutation(api.assessments.save);
	const generatePlanAction = useAction(api.plans.generate);
	const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

	const createAndAnalyzeFromUrl = useAction(api.analysis.createAndAnalyzeFromUrl);
	const createAndAnalyzeFromCode = useAction(api.analysis.createAndAnalyzeFromCode);

	const newAnalysis = useQuery(
		api.analysis.getById,
		newAnalysisId ? { id: newAnalysisId } : "skip",
	);

	// Check for duplicate plans
	const duplicateCheck = useQuery(
		api.plans.checkDuplicates,
		convexUser && latestAnalysis?.detectedTechs
			? {
					userId: convexUser._id,
					technologies: latestAnalysis.detectedTechs.map((t) => t.key),
				}
			: "skip",
	);

	// Initialize assessments from detectedTechs
	useEffect(() => {
		if (latestAnalysis?.detectedTechs) {
			const techAssessments = latestAnalysis.detectedTechs.map((tech) => {
				const existing = existingAssessments?.find(
					(a) => a.technology === tech.key,
				);
				return {
					key: tech.key,
					name: tech.name,
					category: tech.category,
					level: (existing?.level as TechLevel) || "nao_sei",
				};
			});
			setAssessments(techAssessments);
		}
	}, [latestAnalysis, existingAssessments]);

	// Poll new analysis status
	useEffect(() => {
		if (newAnalysis?.status === "done") {
			setIsAnalyzing(false);
			setShowNewAnalysis(false);
			setGithubUrl("");
			setCodeSnippet("");
			setNewAnalysisId(null);
			// Refresh page to show new analysis
			window.location.reload();
		} else if (newAnalysis?.status === "failed") {
			setIsAnalyzing(false);
			alert("Analysis failed: " + (newAnalysis.error || "Unknown error"));
		}
	}, [newAnalysis]);

	const isValidGitHubUrl = (url: string) => {
		const pattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+/;
		return pattern.test(url.trim());
	};

	const handleAnalyzeNew = async () => {
		if (!githubUrl && !codeSnippet) {
			alert("Please enter a GitHub URL or code snippet");
			return;
		}

		if (githubUrl && !isValidGitHubUrl(githubUrl)) {
			alert("Please enter a valid GitHub URL (e.g., https://github.com/owner/repo)");
			return;
		}

		setIsAnalyzing(true);

		try {
			let analysisId: string;

			if (githubUrl) {
				analysisId = await createAndAnalyzeFromUrl({
					githubUrl,
					userId: convexUser?._id,
				});
			} else {
				analysisId = await createAndAnalyzeFromCode({
					codeSnippet,
					userId: convexUser?._id,
				});
			}

			setNewAnalysisId(analysisId as unknown as Id<"githubAnalysis">);
		} catch (error) {
			console.error("Error analyzing:", error);
			alert("Error analyzing: " + (error as Error).message);
			setIsAnalyzing(false);
		}
	};

	const handleLevelChange = (techKey: string, level: TechLevel) => {
		setAssessments((prev) =>
			prev.map((tech) => (tech.key === techKey ? { ...tech, level } : tech)),
		);
	};

	const handleSave = async () => {
		if (!user || !latestAnalysis || !convexUser) return;

		setIsSaving(true);
		try {
			await saveMutation({
				userId: convexUser._id,
				analysisId: latestAnalysis._id,
				assessments: assessments.map((tech) => ({
					technology: tech.key,
					level: tech.level,
				})),
			});
			alert("Assessments saved successfully!");
		} catch (error) {
			console.error("Error saving assessments:", error);
			alert("Error saving assessments");
		} finally {
			setIsSaving(false);
		}
	};

	const handleGeneratePlan = async () => {
		if (!convexUser || !latestAnalysis) return;

		setIsGeneratingPlan(true);

		// Telemetry: plan_generate_started
		Sentry.captureMessage("plan_generate_started", {
			level: "info",
			extra: {
				userId: convexUser._id,
				analysisId: latestAnalysis._id,
			},
		});

		try {
			await generatePlanAction({
				userId: convexUser._id,
				analysisId: latestAnalysis._id,
			});

			// Telemetry: plan_generate_success
			Sentry.captureMessage("plan_generate_success", {
				level: "info",
				extra: {
					userId: convexUser._id,
					analysisId: latestAnalysis._id,
				},
			});

			// Navigate to plan page with analysisId
			navigate({
				to: "/plan",
				search: { analysisId: latestAnalysis._id },
			});
		} catch (error) {
			console.error("Error generating plan:", error);

			// Telemetry: plan_generate_error
			Sentry.captureException(error, {
				extra: {
					userId: convexUser._id,
					analysisId: latestAnalysis._id,
				},
			});

			alert("Error generating plan: " + (error as Error).message);
		} finally {
			setIsGeneratingPlan(false);
		}
	};

	return (
		<>
			<SignedOut>
				<div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
					<div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 max-w-md">
						<h2 className="text-2xl font-bold text-white mb-4">
							Restricted Access
						</h2>
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
					<div className="max-w-5xl mx-auto">
						<div className="mb-8 flex items-center justify-between">
							<div>
								<h1 className="text-4xl font-bold text-white mb-2">
									Assess Your Knowledge
								</h1>
								<p className="text-gray-400">
									Assess your knowledge level in the technologies detected in
									your repository
								</p>
							</div>
							{latestAnalysis && (
								<button
									onClick={() => setShowNewAnalysis(!showNewAnalysis)}
									className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
								>
									<Plus className="w-5 h-5" />
									{showNewAnalysis ? "Cancel" : "Analyze New Repository"}
								</button>
							)}
						</div>

						{showNewAnalysis && (
							<div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 mb-6">
								<h2 className="text-xl font-semibold text-white mb-4">
									Analyze New Repository
								</h2>
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
											placeholder="Paste your package.json, imports, or any relevant code..."
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
										onClick={handleAnalyzeNew}
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
											</>
										)}
									</button>
								</div>
							</div>
						)}

						{!latestAnalysis && !showNewAnalysis && (
							<div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 text-center">
								<p className="text-gray-400 mb-4">
									No analysis found. Analyze a repository to get started.
								</p>
								<button
									onClick={() => setShowNewAnalysis(true)}
									className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
								>
									Analyze Repository
								</button>
							</div>
						)}

						{latestAnalysis && (
							<>
								<div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-6">
									<h2 className="text-xl font-semibold text-white mb-2">
										Analyzed Repository
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
															checked={tech.level === "sei"}
															onChange={() =>
																handleLevelChange(tech.key, "sei")
															}
															className="w-4 h-4 text-cyan-500 focus:ring-cyan-500"
														/>
														<span className="text-white">Know</span>
													</label>

													<label className="flex items-center gap-2 cursor-pointer">
														<input
															type="radio"
															name={`tech-${tech.key}`}
															value="nocao"
															checked={tech.level === "nocao"}
															onChange={() =>
																handleLevelChange(tech.key, "nocao")
															}
															className="w-4 h-4 text-cyan-500 focus:ring-cyan-500"
														/>
														<span className="text-white">Basic</span>
													</label>

													<label className="flex items-center gap-2 cursor-pointer">
														<input
															type="radio"
															name={`tech-${tech.key}`}
															value="nao_sei"
															checked={tech.level === "nao_sei"}
															onChange={() =>
																handleLevelChange(tech.key, "nao_sei")
															}
															className="w-4 h-4 text-cyan-500 focus:ring-cyan-500"
														/>
														<span className="text-white">Don't know</span>
													</label>
												</div>
								</div>
							</div>
						))}
					</div>

					{/* Warning about existing plans */}
					{duplicateCheck?.hasExisting && (
						<div className="bg-yellow-900/20 border border-yellow-500/50 rounded-xl p-6">
							<div className="flex items-start gap-3">
								<div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
									<span className="text-yellow-400 text-lg">⚠️</span>
								</div>
								<div className="flex-1">
									<h3 className="text-lg font-semibold text-yellow-400 mb-2">
										Existing Plans Detected
									</h3>
									<p className="text-gray-300 mb-3">
										You already have study plans for the following
										technologies:
									</p>
									<div className="flex flex-wrap gap-2 mb-3">
										{duplicateCheck.existingTechs.map((tech) => {
											const techInfo = latestAnalysis?.detectedTechs?.find(
												(t) => t.key === tech,
											);
											return (
												<span
													key={tech}
													className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-300 text-sm"
												>
													{techInfo?.name || tech}
												</span>
											);
										})}
									</div>
									<p className="text-gray-400 text-sm">
										When generating new plans, these technologies will be skipped to
										avoid duplicates. To recreate them, delete the existing plans
										first in the Dashboard.
									</p>
								</div>
							</div>
						</div>
					)}

					<div className="flex gap-4">
						<Button
							onClick={() => navigate({ to: "/analyze" })}
							type="button"
							className="px-6 py-3 bg-slate-700 hover:bg-slate-600"
						>
							Analyze New Repository
						</Button>
						<Button
							onClick={handleSave}
							disabled={isSaving}
							type="button"
							className="px-6 py-3"
						>
							{isSaving ? "Saving..." : "Save Assessment"}
						</Button>
						<Button
							onClick={handleGeneratePlan}
							disabled={isGeneratingPlan}
							type="button"
							className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600"
						>
							{isGeneratingPlan ? "Generating Plan..." : "Generate Study Plan"}
						</Button>
					</div>
							</>
						)}
					</div>
				</div>
			</SignedIn>
		</>
	);
}
