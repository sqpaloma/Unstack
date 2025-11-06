import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { useNavigate } from "@tanstack/react-router";
import * as Sentry from "@sentry/tanstackstart-react";
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
		<section className="relative py-20 px-6 text-center overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10"></div>
			<div className="relative max-w-5xl mx-auto">
				<div className="flex items-center justify-center gap-6 mb-6">
					<img
						src="/tanstack-circle-logo.png"
						alt="Unstack Logo"
						className="w-24 h-24 md:w-32 md:h-32"
					/>
					<h1 className="text-6xl md:text-7xl font-black text-white [letter-spacing:-0.08em]">
						<span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
							UNSTACK
						</span>
					</h1>
				</div>

				<h2 className="text-3xl md:text-4xl text-white mb-4 font-bold">
					Entenda sua stack. Evolua com foco.
				</h2>

				<p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
					Analisamos seu repositório, detectamos linguagens/frameworks, você
					avalia seu conhecimento e geramos um plano de estudos personalizado.
				</p>

				<SignedIn>
					<div className="flex flex-col items-center gap-4">
						<button
							onClick={handleAnalyze}
							className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/50 flex items-center gap-2"
						>
							<Github className="w-5 h-5" />
							Analisar repositório
						</button>
						<a
							href="#como-funciona"
							className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm underline"
						>
							Ver demo do fluxo
						</a>
					</div>
				</SignedIn>

				<SignedOut>
					<div className="flex flex-col items-center gap-4">
						<p className="text-gray-400 mb-2">
							Faça login para analisar seu repositório
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
								Fazer Login
							</a>
							<a
								href="#como-funciona"
								className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
								onClick={() => {
									Sentry.captureMessage("home_demo_clicked", {
										level: "info",
									});
								}}
							>
								Ver demo do fluxo
							</a>
						</div>
					</div>
				</SignedOut>
			</div>
		</section>
	);
}
