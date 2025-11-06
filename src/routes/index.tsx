import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import * as Sentry from "@sentry/tanstackstart-react";
import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { ContinueFromWhereYouLeft } from "@/components/home/ContinueFromWhereYouLeft";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhatWeDetect } from "@/components/home/WhatWeDetect";
import { WhyUse } from "@/components/home/WhyUse";
import { Footer } from "@/components/home/Footer";

export const Route = createFileRoute("/")({
	component: HomePage,
	head: () => ({
		meta: [
			{
				title: "Unstack - Entenda sua stack. Evolua com foco.",
			},
			{
				name: "description",
				content:
					"Analisamos seu repositório GitHub, detectamos tecnologias e geramos um plano de estudos personalizado.",
			},
			{
				property: "og:title",
				content: "Unstack - Entenda sua stack. Evolua com foco.",
			},
			{
				property: "og:description",
				content:
					"Planos de estudo personalizados baseados na análise do seu código.",
			},
			{
				property: "og:type",
				content: "website",
			},
		],
	}),
});

function HomePage() {
	useEffect(() => {
		Sentry.captureMessage("home_view", {
			level: "info",
		});
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
			<Hero />
			<TrustStrip />
			<ContinueFromWhereYouLeft />
			<HowItWorks />
			<WhatWeDetect />
			<WhyUse />
			<Footer />
		</div>
	);
}
