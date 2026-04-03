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

	const sym = (currency: string) =>
		currency === "USD"
			? "$"
			: currency === "EUR"
				? "\u20ac"
				: currency === "GBP"
					? "\u00a3"
					: `${currency} `;

	if (count === 0) return null;

	return (
		<div className="relative overflow-hidden rounded-2xl border border-border bg-card/30 backdrop-blur-sm">
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(225,29,72,0.05),transparent_50%)]" />

			<div className="relative">
				<div
					className="flex transition-transform duration-500 ease-out"
					style={{ transform: `translateX(-${current * 100}%)` }}
				>
					{packages.map((pkg) => {
						const s = sym(pkg.currency);
						const discount = Math.round(
							((pkg.base_price - pkg.total_price) / pkg.base_price) * 100,
						);
						return (
							<div
								key={pkg.id}
								className="w-full flex-shrink-0 flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8"
							>
								<Link
									href={`/package/${pkg.id}`}
									className="relative h-40 w-40 sm:h-48 sm:w-48 flex-shrink-0 overflow-hidden rounded-xl border border-border"
								>
									{pkg.image ? (
										<Image
											src={pkg.image}
											alt={pkg.name}
											fill
											className="object-cover hover:scale-105 transition-transform duration-300"
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center bg-secondary">
											<svg
												className="w-12 h-12 text-rose-500/20"
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
										<div className="absolute top-2 left-2 rounded-md bg-rose-500 px-2 py-0.5 text-xs font-bold text-white">
											-{discount}%
										</div>
									)}
								</Link>

								<div className="flex-1 text-center sm:text-left min-w-0">
									<Link
										href={`/package/${pkg.id}`}
										className="text-xl sm:text-2xl font-bold text-foreground hover:text-rose-400 transition-colors line-clamp-2"
									>
										{pkg.name}
									</Link>
									<div className="mt-3 flex items-baseline gap-3 justify-center sm:justify-start">
										<span className="text-3xl font-black text-foreground">
											{s}
											{pkg.total_price.toFixed(2)}
										</span>
										{pkg.base_price > pkg.total_price && (
											<span className="text-lg text-muted-foreground line-through">
												{s}
												{pkg.base_price.toFixed(2)}
											</span>
										)}
									</div>
									<div className="mt-4 flex gap-3 justify-center sm:justify-start">
										<motion.button
											type="button"
											onClick={() => handleAdd(pkg)}
											disabled={adding === pkg.id || added === pkg.id}
											whileTap={{ scale: 0.95 }}
											className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
												added === pkg.id
													? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
													: "bg-rose-500 text-white hover:bg-rose-400 shadow-lg shadow-rose-500/20"
											} disabled:opacity-60`}
										>
											<AnimatePresence mode="wait" initial={false}>
												<motion.span
													key={
														added === pkg.id
															? "added"
															: adding === pkg.id
																? "adding"
																: "add"
													}
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
											className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-rose-500/20 transition-all"
										>
											View Details
										</Link>
									</div>
								</div>
							</div>
						);
					})}
				</div>

				{count > 1 && (
					<>
						<button
							type="button"
							onClick={() => {
								prev();
								resetTimer();
							}}
							className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
						>
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
							</svg>
						</button>
						<button
							type="button"
							onClick={() => {
								next();
								resetTimer();
							}}
							className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
						>
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
							</svg>
						</button>
					</>
				)}
			</div>

			{count > 1 && (
				<div className="flex items-center justify-center gap-2 pb-5">
					{packages.map((pkg, i) => (
						<button
							key={pkg.id}
							type="button"
							onClick={() => {
								setCurrent(i);
								resetTimer();
							}}
							className={`h-1 rounded-full transition-all duration-300 ${
								i === current
									? "w-6 bg-rose-400"
									: "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
							}`}
						/>
					))}
				</div>
			)}
		</div>
	);
}
