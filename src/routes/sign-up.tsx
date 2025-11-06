import { createFileRoute } from "@tanstack/react-router";
import { SignUp } from "@clerk/clerk-react";

export const Route = createFileRoute("/sign-up")({
	component: SignUpPage,
});

function SignUpPage() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-6">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<div className="flex items-center justify-center gap-4 mb-4">
						<img
							src="/tanstack-circle-logo.png"
							alt="Unstack Logo"
							className="w-16 h-16"
						/>
						<h1 className="text-4xl font-black text-white">
							<span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
								UNSTACK
							</span>
						</h1>
					</div>
					<p className="text-gray-400">
						Crie sua conta e comece a evoluir sua stack
					</p>
				</div>

				<div className="flex justify-center">
					<SignUp
						appearance={{
							elements: {
								rootBox: "w-full",
								card: "bg-slate-800 border border-slate-700 shadow-xl",
								headerTitle: "text-white",
								headerSubtitle: "text-gray-400",
								socialButtonsBlockButton:
									"bg-slate-700 border-slate-600 text-white hover:bg-slate-600",
								formButtonPrimary:
									"bg-cyan-500 hover:bg-cyan-600 text-white",
								footerActionLink: "text-cyan-400 hover:text-cyan-300",
								formFieldInput:
									"bg-slate-700 border-slate-600 text-white placeholder-gray-400",
								formFieldLabel: "text-gray-300",
								identityPreviewText: "text-white",
								identityPreviewEditButton: "text-cyan-400",
							},
						}}
						routing="path"
						path="/sign-up"
						signInUrl="/sign-in"
						fallbackRedirectUrl="/analyze"
					/>
				</div>
			</div>
		</div>
	);
}
