import { Upload, Code2, CheckSquare, BarChart3 } from "lucide-react";

export function HowItWorks() {
	const steps = [
		{
			number: "1",
			icon: <Upload className="w-10 h-10 text-cyan-400" />,
			title: "Paste GitHub URL",
			description:
				"Enter your public repository link and let our AI analyze the entire stack.",
		},
		{
			number: "2",
			icon: <Code2 className="w-10 h-10 text-cyan-400" />,
			title: "Automatic code analysis (optional)",
			description:
				"We detect languages, frameworks, auth tools, databases and infrastructure used in the project.",
		},
		{
			number: "3",
			icon: <CheckSquare className="w-10 h-10 text-cyan-400" />,
			title: "Options & Self-assessment",
			description:
				"You mark what you already know, have basic knowledge or don't know. This personalizes your study plan.",
		},
		{
			number: "4",
			icon: <BarChart3 className="w-10 h-10 text-cyan-400" />,
			title: "Dashboard with progress",
			description:
				"Track modules, completion checkboxes, filters by technology and continue where you left off.",
		},
	];

	return (
		<section id="how-it-works" className="py-16 px-6 scroll-mt-20">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
						How it works
					</h2>
					<p className="text-gray-400 text-lg max-w-2xl mx-auto">
						From upload to dashboard: 4 steps to structured learning
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{steps.map((step) => (
						<div
							key={step.number}
							className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
						>
							<div className="absolute -top-4 -left-4 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/50">
								{step.number}
							</div>
							<div className="mb-4 mt-2">{step.icon}</div>
							<h3 className="text-xl font-semibold text-white mb-3">
								{step.title}
							</h3>
							<p className="text-gray-400 leading-relaxed">{step.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
