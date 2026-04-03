"use client";

import { Marquee } from "@/components/ui/marquee";

const reviews = [
	{
		name: "xNova",
		body: "Best gens server I've ever played. The custom tiers keep me grinding every day.",
		rating: 5,
	},
	{
		name: "DarkPhoenix",
		body: "Bought the Diamond rank — totally worth it. The perks are insane.",
		rating: 5,
	},
	{
		name: "StormBlade",
		body: "The PvP is so smooth. Low ping, fair fights, and the staff actually cares.",
		rating: 5,
	},
	{
		name: "LunaFrost",
		body: "I love that you earn points for purchases. Already saved up for a crate key.",
		rating: 5,
	},
	{
		name: "BlazeRunner",
		body: "Insane value on the battle pass. Getting it every season from now on.",
		rating: 5,
	},
	{
		name: "CrystalGaming",
		body: "Genuinely the most polished Minecraft store I've seen. Clean and easy.",
		rating: 4,
	},
	{
		name: "ShadowMC",
		body: "The community is amazing. Made friends through clan wars that I still play with.",
		rating: 5,
	},
	{
		name: "AquaVortex",
		body: "Quick delivery after purchase. Kit showed up in my inventory within seconds.",
		rating: 5,
	},
];

function ReviewCard({ name, body }: { name: string; body: string }) {
	return (
		<div className="relative w-72 flex-shrink-0 rounded-2xl border border-border bg-card/50 p-5 backdrop-blur-sm">
			<div className="flex items-center gap-3 mb-3">
				<div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold">
					{name[0]}
				</div>
				<div>
					<p className="text-sm font-semibold text-foreground">{name}</p>
					<div className="flex gap-0.5">
						{Array.from({ length: 5 }).map((_, i) => (
							<svg
								key={`${name}-star-${i}`}
								className="w-3 h-3 text-rose-400"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
							</svg>
						))}
					</div>
				</div>
			</div>
			<p className="text-sm text-muted-foreground leading-relaxed">
				&ldquo;{body}&rdquo;
			</p>
		</div>
	);
}

export function Testimonials() {
	const firstRow = reviews.slice(0, reviews.length / 2);
	const secondRow = reviews.slice(reviews.length / 2);

	return (
		<section className="relative py-24 overflow-hidden">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
				<div className="text-center">
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-400 mb-3">
						Community
					</p>
					<h2 className="text-3xl sm:text-4xl font-black text-foreground">
						Loved by players
					</h2>
				</div>
			</div>

			<div className="relative space-y-4">
				<Marquee pauseOnHover className="[--duration:40s] [--gap:1rem]">
					{firstRow.map((review) => (
						<ReviewCard key={review.name} {...review} />
					))}
				</Marquee>
				<Marquee
					reverse
					pauseOnHover
					className="[--duration:35s] [--gap:1rem]"
				>
					{secondRow.map((review) => (
						<ReviewCard key={review.name} {...review} />
					))}
				</Marquee>

				{/* Fade edges */}
				<div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent" />
				<div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent" />
			</div>
		</section>
	);
}
