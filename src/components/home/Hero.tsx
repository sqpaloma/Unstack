import { SignedIn, SignedOut } from "@clerk/clerk-react";
import * as Sentry from "@sentry/tanstackstart-react";
import { useNavigate } from "@tanstack/react-router";
import { Github } from "lucide-react";

export function Hero() {
	const navigate = useNavigate();

	const handleAnalyze = () => {
		Sentry.captureMessage("home_analyze_clicked", {
			level: "info",
		});

		navigate({ to: "/analyze" });
	};

	return (
		<section className="relative py-20 px-6 overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10"></div>
			<div className="relative max-w-7xl mx-auto">
				<div className="grid md:grid-cols-2 gap-8 items-center">
					{/* Left side - Content */}
					<div className="text-left">
						<div className="flex items-center gap-6 mb-6">
							<img
								src="/tanstack-circle-logo.png"
								alt="Unstack Logo"
								className="w-40 h-40 md:w-48 md:h-48 rounded-full"
							/>
							<h1 className="text-6xl md:text-7xl font-black text-white [letter-spacing:-0.08em]">
								<span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
									UNSTACK
								</span>
							</h1>
						</div>

						<h2 className="text-3xl md:text-4xl text-white mb-4 font-bold">
							Your Code Trainer
						</h2>

						<p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
							We analyze your repository, detect languages/frameworks, you
							assess your knowledge and we generate a personalized study plan.
						</p>

						<SignedIn>
							<div className="flex flex-col items-start gap-4">
								<button
									onClick={handleAnalyze}
									className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/50 flex items-center gap-2"
								>
									<Github className="w-5 h-5" />
									Analyze repository
								</button>
								<a
									href="#how-it-works"
									className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm underline"
								>
									View demo
								</a>
							</div>
						</SignedIn>

						<SignedOut>
							<div className="flex flex-col items-start gap-4">
								<p className="text-gray-400 mb-2">
									Sign in to analyze your repository
								</p>
								<div className="flex gap-4">
									<a
										href="/sign-in"
										className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/50"
										onClick={() => {
											Sentry.captureMessage("home_signin_clicked", {
												level: "info",
											});
										}}
									>
										Sign In
									</a>
									<a
										href="#how-it-works"
										className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
										onClick={() => {
											Sentry.captureMessage("home_demo_clicked", {
												level: "info",
											});
										}}
									>
										View demo
									</a>
								</div>
							</div>
						</SignedOut>
					</div>

					{/* Right side - Image */}
					<div className="flex justify-center items-center">
						<img
							src="/gato.jpeg"
							alt="Cat"
							className="w-full max-w-md rounded-lg shadow-2xl"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
