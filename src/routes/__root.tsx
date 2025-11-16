import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Link,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Header } from "../components/Header";
import ClerkProvider from "../integrations/clerk/provider";
import ConvexProvider from "../integrations/convex/provider";

import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Unstack",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "icon",
				href: "/favicon.ico",
			},
		],
	}),

	notFoundComponent: () => {
		return (
			<>
				<Header />
				<div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
					<div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 max-w-md text-center">
						<h1 className="text-6xl font-bold text-white mb-4">404</h1>
						<h2 className="text-2xl font-bold text-white mb-4">
							Página não encontrada
						</h2>
						<p className="text-gray-400 mb-6">
							A página que você está procurando não existe.
						</p>
						<Link
							to="/"
							className="inline-block px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
						>
							Voltar para Home
						</Link>
					</div>
				</div>
			</>
		);
	},

	component: RootComponent,
	shellComponent: RootDocument,
});

function RootComponent() {
	return (
		<div className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
			<Header />
			<Outlet />
		</div>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<ConvexProvider>
					<ClerkProvider>
						{children}
						<TanStackDevtools
							config={{
								position: "bottom-right",
							}}
							plugins={[
								{
									name: "Tanstack Router",
									render: <TanStackRouterDevtoolsPanel />,
								},
							]}
						/>
					</ClerkProvider>
				</ConvexProvider>
				<Scripts />
			</body>
		</html>
	);
}
