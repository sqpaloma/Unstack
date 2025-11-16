import { createFileRoute } from "@tanstack/react-router";
import { SignIn } from "@clerk/clerk-react";

export const Route = createFileRoute("/sign-in")({
	component: SignInPage,
});

function SignInPage() {
	return (
		<div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-6 py-12">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<h2 className="text-3xl font-bold text-white mb-2">
						Welcome back!
					</h2>
					<p className="text-gray-400">
						Sign in to continue your learning journey
					</p>
				</div>

				<div className="flex justify-center">
					<SignIn
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
						path="/sign-in"
						signUpUrl="/sign-up"
						fallbackRedirectUrl="/dashboard"
					/>
				</div>
			</div>
		</div>
	);
}
