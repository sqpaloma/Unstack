import { Link } from "@tanstack/react-router";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { BookOpen, LayoutDashboard, Target, Home, LogIn } from "lucide-react";

export function Header() {
	return (
		<header className="sticky top-0 z-50 w-full px-6 py-4">
			<div className="container mx-auto max-w-6xl px-6 py-4 border border-slate-700 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/75 rounded-2xl">
				<div className="flex items-center justify-between">
					{/* Logo */}
					<Link to="/" className="flex items-center gap-3 group">
						<img
							src="/tanstack-circle-logo.png"
							alt="Unstack Logo"
							className="w-10 h-10 transition-transform group-hover:scale-110 rounded-full"
						/>
						<h1 className="text-2xl font-black text-white">
							<span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
								UNSTACK
							</span>
						</h1>
					</Link>

					{/* Navigation */}
					<nav className="hidden md:flex items-center gap-6">
						<Link
							to="/"
							className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors font-medium"
							activeProps={{
								className:
									"flex items-center gap-2 text-cyan-400 font-medium",
							}}
						>
							<Home className="w-4 h-4" />
							Home
						</Link>

						<SignedIn>
							<Link
								to="/dashboard"
								className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors font-medium"
								activeProps={{
									className:
										"flex items-center gap-2 text-cyan-400 font-medium",
								}}
							>
								<LayoutDashboard className="w-4 h-4" />
								Dashboard
							</Link>

							<Link
								to="/options"
								className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors font-medium"
								activeProps={{
									className:
										"flex items-center gap-2 text-cyan-400 font-medium",
								}}
							>
								<Target className="w-4 h-4" />
								Avaliações
							</Link>

							<Link
								to="/plan"
								className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors font-medium"
								activeProps={{
									className:
										"flex items-center gap-2 text-cyan-400 font-medium",
								}}
							>
								<BookOpen className="w-4 h-4" />
								Planos
							</Link>
						</SignedIn>
					</nav>

					{/* Auth Section */}
					<div className="flex items-center gap-4">
						<SignedOut>
							<Link
								to="/sign-in"
								className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-colors font-medium"
							>
								<LogIn className="w-4 h-4" />
								Entrar
							</Link>
							<Link
								to="/sign-up"
								className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
							>
								Cadastrar
							</Link>
						</SignedOut>

						<SignedIn>
							<UserButton
								appearance={{
									elements: {
										avatarBox: "w-10 h-10",
										userButtonPopoverCard:
											"bg-slate-800 border border-slate-700",
										userButtonPopoverActionButton:
											"text-gray-300 hover:text-white hover:bg-slate-700",
										userButtonPopoverActionButtonText: "text-gray-300",
										userButtonPopoverActionButtonIcon: "text-gray-400",
										userButtonPopoverFooter: "hidden",
									},
								}}
								afterSignOutUrl="/"
							/>
						</SignedIn>
					</div>
				</div>

				{/* Mobile Navigation */}
				<SignedIn>
					<nav className="md:hidden flex items-center gap-4 mt-4 pt-4 border-t border-slate-700">
						<Link
							to="/dashboard"
							className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors text-sm font-medium"
							activeProps={{
								className:
									"flex items-center gap-2 text-cyan-400 text-sm font-medium",
							}}
						>
							<LayoutDashboard className="w-4 h-4" />
							Dashboard
						</Link>

						<Link
							to="/options"
							className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors text-sm font-medium"
							activeProps={{
								className:
									"flex items-center gap-2 text-cyan-400 text-sm font-medium",
							}}
						>
							<Target className="w-4 h-4" />
							Avaliações
						</Link>

						<Link
							to="/plan"
							className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors text-sm font-medium"
							activeProps={{
								className:
									"flex items-center gap-2 text-cyan-400 text-sm font-medium",
							}}
						>
							<BookOpen className="w-4 h-4" />
							Planos
						</Link>
					</nav>
				</SignedIn>
			</div>
		</header>
	);
}


