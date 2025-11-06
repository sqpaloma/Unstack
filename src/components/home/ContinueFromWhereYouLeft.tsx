import { SignedIn, useUser } from "@clerk/clerk-react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ArrowRight, BookOpen } from "lucide-react";
import * as Sentry from "@sentry/tanstackstart-react";

export function ContinueFromWhereYouLeft() {
	const { user } = useUser();
	const navigate = useNavigate();

	const convexUser = useQuery(
		api.users.getByClerkId,
		user ? { clerkId: user.id } : "skip",
	);

	const plans = useQuery(api.plans.list, {});
	const userPlans = plans?.filter((p) => p.userId === convexUser?._id);

	const allProgress = useQuery(api.progress.list, {});
	const userProgress = allProgress?.filter((p) => p.userId === convexUser?._id);

	const hasProgress = userPlans && userPlans.length > 0;

	if (!hasProgress) return null;

	// Calculate incomplete tasks
	const incompleteTasks =
		userPlans?.flatMap((plan) => {
			const planProgress = userProgress?.filter(
				(p) => p.planId === plan._id,
			) || [];
			const completedIndexes = new Set(
				planProgress.map((p) => p.moduleIndex),
			);

			return plan.modules
				.map((module, idx) => ({
					planId: plan._id,
					technology: plan.technology,
					moduleIndex: idx,
					moduleTitle: module.title,
					completed: completedIndexes.has(idx),
				}))
				.filter((t) => !t.completed)
				.slice(0, 2); // Get first 2 incomplete modules per plan
		}) || [];

	const nextTasks = incompleteTasks.slice(0, 3); // Show max 3 tasks

	if (nextTasks.length === 0) return null;

	const handleContinue = () => {
		Sentry.captureMessage("home_continue_clicked", {
			level: "info",
			extra: {
				userId: convexUser?._id,
				tasksCount: nextTasks.length,
			},
		});

		navigate({ to: "/dashboard" });
	};

	return (
		<SignedIn>
			<section className="py-16 px-6">
				<div className="max-w-5xl mx-auto">
					<div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-8">
						<div className="flex items-start gap-4 mb-6">
							<BookOpen className="w-8 h-8 text-cyan-400 flex-shrink-0 mt-1" />
							<div className="flex-1">
								<h2 className="text-2xl font-bold text-white mb-2">
									Continuar de onde parei
								</h2>
								<p className="text-gray-400">
									Você tem {incompleteTasks.length} módulos pendentes
								</p>
							</div>
						</div>

						<div className="space-y-3 mb-6">
							{nextTasks.map((task) => (
								<div
									key={`${task.planId}-${task.moduleIndex}`}
									className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-center justify-between hover:border-cyan-500/50 transition-all"
								>
									<div>
										<p className="text-white font-semibold">
											{task.moduleTitle}
										</p>
										<p className="text-sm text-gray-400 capitalize">
											{task.technology}
										</p>
									</div>
									<ArrowRight className="w-5 h-5 text-cyan-400" />
								</div>
							))}
						</div>

						<button
							onClick={handleContinue}
							className="w-full md:w-auto px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/50 flex items-center justify-center gap-2"
						>
							Ir para o Dashboard
							<ArrowRight className="w-5 h-5" />
						</button>
					</div>
				</div>
			</section>
		</SignedIn>
	);
}
