import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { useNavigate } from "@tanstack/react-router";
import { useAction } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import * as Sentry from "@sentry/tanstackstart-react";
import { Github } from "lucide-react";

export function Hero() {
	const [githubUrl, setGithubUrl] = useState("");
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [showLoginModal, setShowLoginModal] = useState(false);
	const navigate = useNavigate();
	const createAndAnalyze = useAction(api.analysis.createAndAnalyzeFromUrl);

	const isValidGitHubUrl = (url: string) => {
		const pattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/;
		return pattern.test(url);
	};

	const handleAnalyze = async () => {
		if (!isValidGitHubUrl(githubUrl)) {
			alert("Por favor, insira uma URL válida do GitHub (ex: https://github.com/owner/repo)");
			return;
		}

		setIsAnalyzing(true);

		Sentry.captureMessage("home_analyze_clicked", {
			level: "info",
			extra: { githubUrl },
		});

		try {
			const analysisId = await createAndAnalyze({ githubUrl });

			navigate({
				to: "/options",
				search: { analysisId },
			});
		} catch (error) {
			console.error("Error analyzing repository:", error);
			Sentry.captureException(error, {
				extra: { githubUrl },
			});
			alert("Erro ao analisar repositório: " + (error as Error).message);
		} finally {
			setIsAnalyzing(false);
		}
	};

	const handleAnalyzeClick = () => {
		// SignedIn users can proceed directly
		// SignedOut users will see a login prompt via showLoginModal
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
					<div className="flex flex-col items-center gap-4 max-w-2xl mx-auto">
						<div className="flex w-full gap-3">
							<div className="relative flex-1">
								<Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
								<input
									type="url"
									value={githubUrl}
									onChange={(e) => setGithubUrl(e.target.value)}
									placeholder="https://github.com/owner/repo"
									className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
									disabled={isAnalyzing}
								/>
							</div>
							<button
								onClick={handleAnalyze}
								disabled={isAnalyzing || !githubUrl}
								className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/50 whitespace-nowrap"
							>
								{isAnalyzing ? "Analisando..." : "Analisar repositório"}
							</button>
						</div>
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
