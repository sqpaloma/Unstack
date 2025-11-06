import {
	Code2,
	Layers,
	Shield,
	Database,
	Cloud,
	Activity,
	Wrench,
} from "lucide-react";

export function WhatWeDetect() {
	const categories = [
		{
			icon: <Code2 className="w-8 h-8 text-cyan-400" />,
			title: "Linguagens",
			examples: "TypeScript, Python, Go, Rust, Java",
		},
		{
			icon: <Layers className="w-8 h-8 text-cyan-400" />,
			title: "Frameworks",
			examples: "React, Next.js, TanStack, Django, FastAPI",
		},
		{
			icon: <Shield className="w-8 h-8 text-cyan-400" />,
			title: "Autenticação",
			examples: "Clerk, Auth0, NextAuth, Supabase Auth",
		},
		{
			icon: <Database className="w-8 h-8 text-cyan-400" />,
			title: "Databases",
			examples: "PostgreSQL, MongoDB, Redis, Convex",
		},
		{
			icon: <Cloud className="w-8 h-8 text-cyan-400" />,
			title: "Infraestrutura",
			examples: "Docker, Kubernetes, Vercel, Cloudflare",
		},
		{
			icon: <Activity className="w-8 h-8 text-cyan-400" />,
			title: "Observabilidade",
			examples: "Sentry, DataDog, LogRocket, Prometheus",
		},
		{
			icon: <Wrench className="w-8 h-8 text-cyan-400" />,
			title: "Ferramentas",
			examples: "Vite, ESBuild, Webpack, Turborepo",
		},
	];

	return (
		<section className="py-16 px-6 bg-slate-900/50">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
						O que detectamos
					</h2>
					<p className="text-gray-400 text-lg max-w-2xl mx-auto">
						Analisamos 7 categorias principais de tecnologias no seu repositório
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{categories.map((category) => (
						<div
							key={category.title}
							className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
						>
							<div className="mb-4">{category.icon}</div>
							<h3 className="text-lg font-semibold text-white mb-2">
								{category.title}
							</h3>
							<p className="text-sm text-gray-400">{category.examples}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
