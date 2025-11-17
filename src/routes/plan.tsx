import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import {
	ArrowLeft,
	BookOpen,
	CheckCircle2,
	Clock,
	Target,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export const Route = createFileRoute("/plan")({
	component: PlanPage,
	validateSearch: (search: Record<string, unknown>) => {
		return {
			planId: (search.planId as string) || "",
			analysisId: (search.analysisId as string) || "",
		};
	},
});

function PlanPage() {
	const { planId, analysisId } = Route.useSearch();
	const { user } = useUser();
	const navigate = useNavigate();
	const [selectedModule, setSelectedModule] = useState<number | null>(null);

	// Fetch Convex user
	const convexUser = useQuery(
		api.users.getByClerkId,
		user ? { clerkId: user.id } : "skip",
	);

	// Fetch plan by ID directly
	const planById = useQuery(
		api.plans.get,
		planId ? { id: planId as Id<"plans"> } : "skip",
	);

	// Fetch plans by analysis ID
	const plansByAnalysis = useQuery(
		api.plans.getByAnalysis,
		analysisId ? { analysisId: analysisId as Id<"githubAnalysis"> } : "skip",
	);

	// Use the plan found
	const plan = planById || plansByAnalysis?.[0];

	// Fetch all progress
	const allProgress = useQuery(api.progress.list, {});

	// Mutation for toggling items
	const toggleItemMutation = useMutation(api.progress.toggleItem);

	// Calculate completed modules
	const completedModules = new Set(
		allProgress
			?.filter((p) => plan && p.planId === plan._id && p.completedAt)
			.map((p) => p.moduleIndex) || [],
	);

	const completionPercentage = plan
		? Math.round((completedModules.size / plan.modules.length) * 100)
		: 0;

	// Auto-select first incomplete module
	useEffect(() => {
		if (plan && selectedModule === null) {
			const firstIncomplete = plan.modules.findIndex(
				(_, idx) => !completedModules.has(idx),
			);
			setSelectedModule(firstIncomplete >= 0 ? firstIncomplete : 0);
		}
	}, [plan, completedModules, selectedModule]);

	// Toggle module handler
	const handleToggleModule = async (moduleIndex: number) => {
		if (!convexUser || !plan) return;

		try {
			await toggleItemMutation({
				userId: convexUser._id,
				planId: plan._id,
				technology: plan.technology,
				moduleIndex,
			});
		} catch (error) {
			console.error("Error toggling module:", error);
		}
	};

	if (!planId && !analysisId) {
		return (
			<div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
				<div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 max-w-md text-center">
					<h2 className="text-2xl font-bold text-white mb-4">
						No Plan Selected
					</h2>
					<p className="text-gray-400 mb-6">
						Please select a study plan to view.
					</p>
					<Link
						to="/dashboard"
						className="inline-block px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
					>
						Go to Dashboard
					</Link>
				</div>
			</div>
		);
	}

	return (
		<>
			<SignedOut>
				<div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
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
				<div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12 px-6">
					<div className="max-w-7xl mx-auto">
						{/* Loading state */}
						{!plan &&
							(plansByAnalysis === undefined || planById === undefined) && (
								<div className="flex items-center justify-center py-20">
									<div className="text-center">
										<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4" />
										<p className="text-gray-400">Loading study plan...</p>
									</div>
								</div>
							)}

						{/* No plan found */}
						{!plan &&
							plansByAnalysis !== undefined &&
							planById !== undefined && (
								<div className="flex items-center justify-center py-20">
									<div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 max-w-md text-center">
										<BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
										<h2 className="text-2xl font-bold text-white mb-4">
											No Study Plan Found
										</h2>
										<p className="text-gray-400 mb-6">
											No study plan was found for this analysis. Please create a plan first.
										</p>
										<Link
											to="/options"
											search={{ analysisId: analysisId || planId }}
											className="inline-block px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
										>
											Create Study Plan
										</Link>
									</div>
								</div>
							)}

						{/* Plan content */}
						{plan && (
							<>
								{/* Header */}
								<div className="mb-8">
									<Link
										to="/dashboard"
										className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors mb-4"
									>
										<ArrowLeft className="w-4 h-4" />
										Back to Dashboard
									</Link>
									<div className="flex items-start justify-between">
										<div>
											<h1 className="text-4xl font-bold text-white mb-2 capitalize">
												{plan.technology.replace(/-/g, " ")}
											</h1>
											<p className="text-gray-400">Study Plan</p>
										</div>
										<div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-4">
											<div className="text-center">
												<p className="text-gray-400 text-sm mb-1">Progress</p>
												<p className="text-3xl font-bold text-white">
													{completionPercentage}%
												</p>
												<p className="text-gray-400 text-sm mt-1">
													{completedModules.size}/{plan.modules.length} modules
												</p>
											</div>
										</div>
									</div>
								</div>

								{/* Progress bar */}
								<div className="mb-8">
									<div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
										<div
											className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
											style={{ width: `${completionPercentage}%` }}
										/>
									</div>
								</div>

								{/* Main content */}
								<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
									{/* Module list */}
									<div className="lg:col-span-1">
										<div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sticky top-6">
											<h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
												<BookOpen className="w-5 h-5 text-cyan-400" />
												Modules
											</h2>
											<div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
												{plan.modules.map((module, idx) => {
													const isCompleted = completedModules.has(idx);
													const isSelected = selectedModule === idx;
													const firstResource = module.resources[0];

													return (
														<div key={idx} className="relative">
															<button
																type="button"
																onClick={(e) => {
																	e.stopPropagation();
																	setSelectedModule(idx);
																}}
																className={`w-full text-left p-4 rounded-lg transition-all border ${
																	isSelected
																		? "bg-cyan-500/20 border-cyan-500/50"
																		: isCompleted
																			? "bg-green-900/20 border-green-500/30"
																			: "bg-slate-900/50 border-slate-600 hover:bg-slate-700/50 hover:border-slate-500"
																}`}
															>
																<div className="flex items-start gap-3">
																	<button
																		type="button"
																		onClick={(e) => {
																			e.stopPropagation();
																			handleToggleModule(idx);
																		}}
																		className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all mt-0.5 flex-shrink-0 ${
																			isCompleted
																				? "border-green-500 bg-transparent"
																				: "border-gray-400 bg-transparent hover:border-cyan-400"
																		}`}
																	>
																		{isCompleted && (
																			<CheckCircle2
																				className="w-5 h-5 text-green-500"
																				fill="currentColor"
																			/>
																		)}
																	</button>
																	<div className="flex-1 min-w-0">
																		<p
																			className={`text-sm font-medium ${
																				isCompleted
																					? "text-green-400 line-through"
																					: isSelected
																						? "text-white"
																						: "text-gray-300"
																			}`}
																		>
																			{module.title}
																		</p>
																		<div className="flex items-center gap-2 mt-1">
																			<Clock className="w-3 h-3 text-gray-500" />
																			<span className="text-xs text-gray-500">
																				{module.estimatedHours}h
																			</span>
																		</div>
																	</div>
																	{firstResource && (
																		<a
																			href={firstResource.url}
																			target="_blank"
																			rel="noopener noreferrer"
																			onClick={(e) => e.stopPropagation()}
																			className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-semibold rounded-lg transition-colors"
																		>
																			Start Course
																		</a>
																	)}
																</div>
															</button>
														</div>
													);
												})}
											</div>
										</div>
									</div>

									{/* Module details */}
									<div className="lg:col-span-2">
										{selectedModule !== null &&
											plan.modules[selectedModule] && (
												<div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
													<div className="flex items-start justify-between mb-6">
														<div className="flex-1">
															<div className="flex items-center gap-3 mb-2">
																<span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-sm font-semibold rounded-full">
																	Module {selectedModule + 1}
																</span>
																{completedModules.has(selectedModule) && (
																	<span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-semibold rounded-full">
																		Completed
																	</span>
																)}
															</div>
															<h2 className="text-3xl font-bold text-white mb-3">
																{plan.modules[selectedModule].title}
															</h2>
															<div className="flex items-center gap-4 text-gray-400">
																<div className="flex items-center gap-2">
																	<Clock className="w-4 h-4" />
																	<span className="text-sm">
																		{plan.modules[selectedModule].estimatedHours}h
																	</span>
																</div>
																<div className="flex items-center gap-2">
																	<Target className="w-4 h-4" />
																	<span className="text-sm">
																		{plan.modules[selectedModule].resources.length}{" "}
																		resources
																	</span>
																</div>
															</div>
														</div>
														<Button
															onClick={() => handleToggleModule(selectedModule)}
															className={`px-6 py-3 rounded-lg font-semibold transition-all ${
																completedModules.has(selectedModule)
																	? "bg-green-500/20 text-green-400 border-2 border-green-500 hover:bg-green-500/30"
																	: "bg-cyan-500 text-white hover:bg-cyan-600"
															}`}
														>
															{completedModules.has(selectedModule)
																? "Mark as Incomplete"
																: "Mark as Complete"}
														</Button>
													</div>

													<div className="prose prose-invert max-w-none mb-8">
														<p className="text-gray-300 leading-relaxed">
															{plan.modules[selectedModule].description}
														</p>
													</div>

													{/* Resources */}
													<div>
														<h3 className="text-xl font-bold text-white mb-4">
															Learning Resources
														</h3>
														<div className="space-y-3">
															{plan.modules[selectedModule].resources.map(
																(resource, idx) => (
																	<a
																		key={idx}
																		href={resource.url}
																		target="_blank"
																		rel="noopener noreferrer"
																		className="block p-4 bg-slate-900/50 border border-slate-600 rounded-lg hover:bg-slate-700/50 hover:border-cyan-500/50 transition-all group"
																	>
																		<div className="flex items-start justify-between">
																			<div className="flex-1">
																				<p className="font-medium text-white group-hover:text-cyan-400 transition-colors">
																					{resource.title}
																				</p>
																				<p className="text-sm text-gray-400 mt-1">
																					{resource.type}
																				</p>
																			</div>
																			<ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors rotate-180" />
																		</div>
																	</a>
																),
															)}
														</div>
													</div>

													{/* Navigation */}
													<div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-700">
														<Button
															onClick={() =>
																setSelectedModule(
																	Math.max(0, selectedModule - 1),
																)
															}
															disabled={selectedModule === 0}
															className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
														>
															<ArrowLeft className="w-4 h-4 mr-2" />
															Previous
														</Button>
														<Button
															onClick={() =>
																setSelectedModule(
																	Math.min(
																		plan.modules.length - 1,
																		selectedModule + 1,
																	),
																)
															}
															disabled={
																selectedModule === plan.modules.length - 1
															}
															className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
														>
															Next
															<ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
														</Button>
													</div>
												</div>
											)}
									</div>
								</div>
							</>
						)}
					</div>
				</div>
			</SignedIn>
		</>
	);
}
