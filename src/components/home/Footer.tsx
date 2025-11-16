import { Github, Linkedin, Twitter } from "lucide-react";

export function Footer() {
	return (
		<footer className="py-12 px-6 border-t border-slate-700/50">
			<div className="max-w-7xl mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
					<div>
						<h3 className="text-white font-bold text-lg mb-4">Unstack</h3>
						<p className="text-gray-400 text-sm leading-relaxed">
							Learn your stack intelligently and focused.
						</p>
					</div>

					<div>
						<h4 className="text-white font-semibold mb-4">Product</h4>
						<ul className="space-y-2">
							<li>
								<a
									href="#how-it-works"
									className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
								>
									How it works
								</a>
							</li>
							<li>
								<a
									href="/dashboard"
									className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
								>
									Dashboard
								</a>
							</li>
							<li>
								<a
									href="/sign-in"
									className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
								>
									Login
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h4 className="text-white font-semibold mb-4">Resources</h4>
						<ul className="space-y-2">
							<li>
								<a
									href="https://tanstack.com/start"
									target="_blank"
									rel="noopener noreferrer"
									className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
								>
									Unstack Docs
								</a>
							</li>
							<li>
								<a
									href="https://convex.dev"
									target="_blank"
									rel="noopener noreferrer"
									className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
								>
									Convex Docs
								</a>
							</li>
							<li>
								<a
									href="https://clerk.com"
									target="_blank"
									rel="noopener noreferrer"
									className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
								>
									Clerk Auth
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h4 className="text-white font-semibold mb-4">Community</h4>
						<div className="flex gap-4">
							<a
								href="https://github.com"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-400 hover:text-cyan-400 transition-colors"
								aria-label="GitHub"
							>
								<Github className="w-5 h-5" />
							</a>
							<a
								href="https://twitter.com"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-400 hover:text-cyan-400 transition-colors"
								aria-label="Twitter"
							>
								<Twitter className="w-5 h-5" />
							</a>
							<a
								href="https://linkedin.com"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-400 hover:text-cyan-400 transition-colors"
								aria-label="LinkedIn"
							>
								<Linkedin className="w-5 h-5" />
							</a>
						</div>
					</div>
				</div>

				<div className="border-t border-slate-700/50 pt-8">
					<div className="flex flex-col md:flex-row justify-between items-center gap-4">
						<p className="text-gray-400 text-sm">
							© {new Date().getFullYear()} Unstack. All rights reserved.
						</p>
						<div className="flex gap-6 text-sm">
							<a
								href="/privacy"
								className="text-gray-400 hover:text-cyan-400 transition-colors"
							>
								Privacy
							</a>
							<a
								href="/terms"
								className="text-gray-400 hover:text-cyan-400 transition-colors"
							>
								Terms of Use
							</a>
						</div>
					</div>
					<p className="text-gray-500 text-xs mt-4 text-center md:text-left">
						This project is a technology demonstration and does not represent
						official endorsement of the mentioned brands.
					</p>
				</div>
			</div>
		</footer>
	);
}
