export function TrustStrip() {
	const partners = [
		{ name: "TanStack Start", logo: "/logos/tanstack.svg" },
		{ name: "Convex", logo: "/logos/convex.svg" },
		{ name: "Cloudflare", logo: "/logos/cloudflare.svg" },
		{ name: "Netlify", logo: "/logos/netlify.svg" },
		{ name: "CodeRabbit", logo: "/logos/coderabbit.svg" },
		{ name: "Firecrawl", logo: "/logos/firecrawl.svg" },
		{ name: "Autumn", logo: "/logos/autumn.svg" },
		{ name: "Sentry", logo: "/logos/sentry.svg" },
	];
	return (
		<section className="py-12 px-6 border-y border-slate-700/50">
			<div className="max-w-7xl mx-auto">
				<p className="text-center text-gray-400 text-sm mb-8 uppercase tracking-wider">
					Construído com as melhores ferramentas
				</p>
				<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center justify-items-center opacity-60 hover:opacity-100 transition-opacity duration-300">
					{partners.map((partner) => (
						<div
							key={partner.name}
							className="flex items-center justify-center h-12"
							title={partner.name}
						>
							<span className="text-gray-400 text-sm font-medium">
								{partner.name}
							</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
