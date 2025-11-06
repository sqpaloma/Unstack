import { Target, Clock, TrendingUp } from "lucide-react";

export function WhyUse() {
	const benefits = [
		{
			icon: <Target className="w-12 h-12 text-cyan-400" />,
			title: "Foco no que importa",
			description:
				"Não perca tempo estudando o que você já domina. Concentre-se nas lacunas reais do seu conhecimento.",
		},
		{
			icon: <Clock className="w-12 h-12 text-cyan-400" />,
			title: "Economia de tempo",
			description:
				"Planos de estudo gerados automaticamente com módulos, recursos e estimativas de horas baseadas no seu nível.",
		},
		{
			icon: <TrendingUp className="w-12 h-12 text-cyan-400" />,
			title: "Evolução visível",
			description:
				"Dashboard com métricas de progresso, filtros por tecnologia e a funcionalidade 'continuar de onde parei'.",
		},
	];

	return (
		<section className="py-16 px-6">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
						Por que usar o Unstack?
					</h2>
					<p className="text-gray-400 text-lg max-w-2xl mx-auto">
						Aprenda de forma inteligente, não mais difícil
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{benefits.map((benefit) => (
						<div
							key={benefit.title}
							className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 text-center hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
						>
							<div className="flex justify-center mb-6">{benefit.icon}</div>
							<h3 className="text-2xl font-semibold text-white mb-4">
								{benefit.title}
							</h3>
							<p className="text-gray-400 leading-relaxed">
								{benefit.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
