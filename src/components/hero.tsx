"use client";

import { motion } from "motion/react";
import { Particles } from "@/components/ui/particles";
import { NumberTicker } from "@/components/ui/number-ticker";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import Link from "next/link";

export function Hero({ firstCategoryId }: { firstCategoryId?: string }) {
	return (
		<section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
			{/* Background layers */}
			<div className="absolute inset-0 bg-background" />
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(225,29,72,0.12),transparent_60%)]" />
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_70%_80%,rgba(167,139,250,0.06),transparent_50%)]" />

			{/* Grid lines */}
			<div
				className="absolute inset-0 opacity-[0.03]"
				style={{
					backgroundImage:
						"linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
					backgroundSize: "80px 80px",
				}}
			/>

			{/* Particles */}
			<Particles
				className="absolute inset-0"
				quantity={60}
				color="#fb7185"
				ease={50}
				refresh
			/>

			{/* Content */}
			<div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
				>
					<div className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/5 px-4 py-1.5 text-xs font-medium text-rose-400 mb-8 backdrop-blur-sm">
						<span className="relative flex h-1.5 w-1.5">
							<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
							<span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-500" />
						</span>
						Official Server Store
					</div>
				</motion.div>

				<motion.h1
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						duration: 0.7,
						delay: 0.1,
						ease: [0.22, 1, 0.36, 1],
					}}
					className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9]"
				>
					<span className="text-foreground">Level up</span>
					<br />
					<span className="text-foreground">with </span>
					<span className="bg-gradient-to-r from-rose-400 via-rose-500 to-violet-400 bg-clip-text text-transparent animate-gradient text-glow-rose">
						SarLabs
					</span>
				</motion.h1>

				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						duration: 0.6,
						delay: 0.25,
						ease: [0.22, 1, 0.36, 1],
					}}
					className="mx-auto mt-6 max-w-lg text-base sm:text-lg text-muted-foreground leading-relaxed"
				>
					Premium ranks, exclusive kits, and powerful perks.
					<br className="hidden sm:block" /> Elevate your Minecraft experience.
				</motion.p>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						duration: 0.6,
						delay: 0.4,
						ease: [0.22, 1, 0.36, 1],
					}}
					className="mt-10 flex items-center justify-center gap-4"
				>
					<Link href={firstCategoryId ? `/category/${firstCategoryId}` : "#store"}>
						<ShimmerButton
							shimmerColor="#fb7185"
							shimmerSize="0.08em"
							shimmerDuration="2.5s"
							background="rgba(225, 29, 72, 0.9)"
							className="px-8 py-3 text-sm font-semibold"
						>
							Browse Store
						</ShimmerButton>
					</Link>
					<Link
						href="/signin"
						className="rounded-xl border border-border px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-rose-500/30 hover:bg-rose-500/5 transition-all duration-300"
					>
						Create Account
					</Link>
				</motion.div>

				{/* Stats */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						duration: 0.6,
						delay: 0.55,
						ease: [0.22, 1, 0.36, 1],
					}}
					className="mt-20 grid grid-cols-3 gap-8 max-w-md mx-auto"
				>
					{[
						{ value: 500, suffix: "+", label: "Players" },
						{ value: 99.9, suffix: "%", label: "Uptime", decimals: 1 },
						{ value: 24, suffix: "/7", label: "Support" },
					].map((stat) => (
						<div key={stat.label} className="text-center">
							<div className="text-2xl sm:text-3xl font-black">
								<NumberTicker value={stat.value} decimalPlaces={stat.decimals ?? 0} className={"text-rose-400"} />
								<span className="text-rose-400">{stat.suffix}</span>
							</div>
							<div className="mt-1 text-xs text-muted-foreground font-medium uppercase tracking-wider">
								{stat.label}
							</div>
						</div>
					))}
				</motion.div>
			</div>

			{/* Bottom gradient fade */}
			<div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
		</section>
	);
}
