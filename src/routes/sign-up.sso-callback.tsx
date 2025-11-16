import { createFileRoute } from "@tanstack/react-router";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";

export const Route = createFileRoute("/sign-up/sso-callback")({
	component: SSOCallbackPage,
});

function SSOCallbackPage() {
	return (
		<div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-6">
			<div className="w-full max-w-md text-center">
				<div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
					<div className="flex justify-center mb-4">
						<div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
					</div>
					<h2 className="text-xl font-semibold text-white mb-2">
						Criando sua conta...
					</h2>
					<p className="text-gray-400">Aguarde enquanto configuramos tudo para você</p>
				</div>
			</div>
			<AuthenticateWithRedirectCallback />
		</div>
	);
}

