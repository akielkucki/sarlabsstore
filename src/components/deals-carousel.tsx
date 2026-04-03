"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCart } from "./cart-provider";
import { motion, AnimatePresence } from "motion/react";

interface DealPackage {
	id: string;
	name: string;
	image: string | null;
	base_price: number;
	total_price: number;
	currency: string;
	priceId: string;
}

export function DealsCarousel({ packages }: { packages: DealPackage[] }) {
	const [current, setCurrent] = useState(0);
	const [adding, setAdding] = useState<string | null>(null);
	const [added, setAdded] = useState<string | null>(null);
	const { addToCart } = useCart();
	const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

	const count = packages.length;

	const next = useCallback(() => {
		setCurrent((c) => (c + 1) % count);
	}, [count]);

	const prev = useCallback(() => {
		setCurrent((c) => (c - 1 + count) % count);
	}, [count]);

	// Auto-advance every 5s
	useEffect(() => {
		timerRef.current = setInterval(next, 5000);
		return () => clearInterval(timerRef.current);
	}, [next]);

	const resetTimer = () => {
		clearInterval(timerRef.current);
		timerRef.current = setInterval(next, 5000);
	};

	const handleAdd = (pkg: DealPackage) => {
		setAdding(pkg.id);
		addToCart({
			id: pkg.id,
			priceId: pkg.priceId,
			name: pkg.name,
			image: pkg.image,
			price: pkg.total_price,
			currency: pkg.currency,
		});
		setAdded(pkg.id);
		setTimeout(() => setAdded(null), 2000);
		setAdding(null);
	};

	const getCurrencySymbol = (currency: string) =>
		currency === "USD"
			? "$"
			: currency === "EUR"
				? "\u20ac"
				: currency === "GBP"
					? "\u00a3"
					: `${currency} `;

	if (count === 0) return null;

	return (
		<div className="relative overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-r from-zinc-900 via-background to-zinc-900">
			{/* Glow background */}
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(225,29,72,0.06),transparent_60%)]" />

			<div className="relative">
				{/* Slides */}
				<div
					className="flex transition-transform duration-500 ease-out"
					style={{ transform: `translateX(-${current * 100}%)` }}
				>
					{packages.map((pkg) => {
						const sym = getCurrencySymbol(pkg.currency);
						const discount = Math.round(
							((pkg.base_price - pkg.total_price) / pkg.base_price) * 100,
						);

						return (
							<div
								key={pkg.id}
								className="w-full flex-shrink-0 flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8"
							>
								{/* Image */}
								<Link
									href={`/package/${pkg.id}`}
									className="relative h-40 w-40 sm:h-48 sm:w-48 flex-shrink-0 overflow-hidden rounded-xl border border-card-border"
								>
									{pkg.image ? (
										<Image
											src={pkg.image}
											alt={pkg.name}
											fill
											className="object-cover hover:scale-105 transition-transform duration-300"
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
											<svg
												className="w-12 h-12 text-accent/30"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={1.5}
													d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
												/>
											</svg>
										</div>
									)}
									{discount > 0 && (
										<div className="absolute top-2 left-2 rounded-md bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
											-{discount}%
										</div>
									)}
								</Link>

								{/* Info */}
								<div className="flex-1 text-center sm:text-left min-w-0">
									<Link
										href={`/package/${pkg.id}`}
										className="text-xl sm:text-2xl font-bold text-white hover:text-accent transition-colors line-clamp-2"
									>
										{pkg.name}
									</Link>
									<div className="mt-3 flex items-baseline gap-3 justify-center sm:justify-start">
										<span className="text-3xl font-black text-accent">
											{sym}
											{pkg.total_price.toFixed(2)}
										</span>
										{pkg.base_price > pkg.total_price && (
											<span className="text-lg text-muted line-through">
												{sym}
												{pkg.base_price.toFixed(2)}
											</span>
										)}
									</div>
									<div className="mt-4 flex gap-3 justify-center sm:justify-start">
										<motion.button
											type="button"
											onClick={() => handleAdd(pkg)}
											disabled={
												adding === pkg.id || added === pkg.id
											}
											whileTap={{ scale: 0.9 }}
											animate={added === pkg.id ? { scale: [1, 1.12, 1] } : {}}
											transition={{ duration: 0.3, ease: "easeOut" }}
											className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
												added === pkg.id
													? "bg-green-500/20 text-green-400 border border-green-500/30"
													: "bg-gradient-to-r from-accent to-rose text-white hover:from-rose hover:to-accent shadow-lg shadow-accent/20"
											} disabled:opacity-60`}
										>
											<AnimatePresence mode="wait" initial={false}>
												<motion.span
													key={added === pkg.id ? "added" : adding === pkg.id ? "adding" : "add"}
													initial={{ opacity: 0, y: 6 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{ opacity: 0, y: -6 }}
													transition={{ duration: 0.15 }}
													className="block"
												>
													{added === pkg.id
														? "Added!"
														: adding === pkg.id
															? "Adding..."
															: "Add to Cart"}
												</motion.span>
											</AnimatePresence>
										</motion.button>
										<Link
											href={`/package/${pkg.id}`}
											className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600 transition-all"
										>
											View Details
										</Link>
									</div>
								</div>
							</div>
						);
					})}
				</div>

				{/* Nav arrows */}
				{count > 1 && (
					<>
						<button
							type="button"
							onClick={() => {
								prev();
								resetTimer();
							}}
							className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/60 border border-zinc-700 flex items-center justify-center text-zinc-300 hover:text-accent hover:border-accent/30 transition-all backdrop-blur-sm"
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 19l-7-7 7-7"
								/>
							</svg>
						</button>
						<button
							type="button"
							onClick={() => {
								next();
								resetTimer();
							}}
							className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/60 border border-zinc-700 flex items-center justify-center text-zinc-300 hover:text-accent hover:border-accent/30 transition-all backdrop-blur-sm"
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</button>
					</>
				)}
			</div>

			{/* Dots */}
			{count > 1 && (
				<div className="flex items-center justify-center gap-2 pb-4">
					{packages.map((pkg, i) => (
						<button
							key={pkg.id}
							type="button"
							onClick={() => {
								setCurrent(i);
								resetTimer();
							}}
							className={`h-1.5 rounded-full transition-all ${
								i === current
									? "w-6 bg-accent"
									: "w-1.5 bg-zinc-600 hover:bg-zinc-400"
							}`}
						/>
					))}
				</div>
			)}
		</div>
	);
}
