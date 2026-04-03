"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./cart-provider";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BorderBeam } from "@/components/ui/border-beam";

interface PackageCardProps {
	pkg: {
		id: string;
		name: string;
		image: string | null;
		base_price: number;
		total_price: number;
		currency: string;
		description: string;
		priceId: string;
	};
	index?: number;
}

export function PackageCard({ pkg, index = 0 }: PackageCardProps) {
	const { addToCart } = useCart();
	const [added, setAdded] = useState(false);
	const [hovered, setHovered] = useState(false);

	const handleAdd = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		addToCart({
			id: pkg.id,
			priceId: pkg.priceId,
			name: pkg.name,
			image: pkg.image,
			price: pkg.total_price,
			currency: pkg.currency,
		});
		setAdded(true);
		setTimeout(() => setAdded(false), 2000);
	};

	const hasDiscount =
		pkg.base_price !== pkg.total_price && pkg.base_price > pkg.total_price;
	const currencySymbol =
		pkg.currency === "USD"
			? "$"
			: pkg.currency === "EUR"
				? "\u20ac"
				: pkg.currency === "GBP"
					? "\u00a3"
					: `${pkg.currency} `;

	return (
		<motion.div
			initial={{ opacity: 0, y: 24 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				duration: 0.5,
				delay: index * 0.08,
				ease: [0.22, 1, 0.36, 1],
			}}
		>
			<Link
				href={`/package/${pkg.id}`}
				className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:border-rose-500/20 transition-all duration-500"
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
			>
				{/* Border beam on hover */}
				{hovered && (
					<BorderBeam
						size={120}
						duration={8}
						colorFrom="#fb7185"
						colorTo="#a78bfa"
					/>
				)}

				{/* Image */}
				<div className="relative aspect-square overflow-hidden bg-secondary">
					{pkg.image ? (
						<Image
							src={pkg.image}
							alt={pkg.name}
							fill
							className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-card">
							<div className="h-14 w-14 rounded-2xl bg-rose-500/10 flex items-center justify-center">
								<svg
									className="w-7 h-7 text-rose-500/40"
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
						</div>
					)}
					{/* Hover overlay */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

					{hasDiscount && (
						<div className="absolute top-2.5 right-2.5 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-lg shadow-rose-500/30">
							SALE
						</div>
					)}
				</div>

				{/* Content */}
				<div className="flex flex-1 flex-col p-4">
					<h3 className="text-sm font-semibold text-foreground/90 group-hover:text-foreground transition-colors line-clamp-2 leading-snug">
						{pkg.name}
					</h3>

					<div className="mt-auto pt-3 flex items-end justify-between">
						<div>
							{hasDiscount && (
								<span className="text-[11px] text-muted-foreground line-through block">
									{currencySymbol}
									{pkg.base_price.toFixed(2)}
								</span>
							)}
							<div className="text-lg font-black text-foreground">
								{currencySymbol}
								{pkg.total_price.toFixed(2)}
							</div>
						</div>

						<motion.button
							type="button"
							onClick={handleAdd}
							whileTap={{ scale: 0.9 }}
							animate={added ? { scale: [1, 1.15, 1] } : {}}
							transition={{ duration: 0.3, ease: "easeOut" }}
							className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all duration-200 ${
								added
									? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
									: "bg-rose-500/10 text-rose-400 border border-rose-500/15 hover:bg-rose-500/20 hover:border-rose-500/30"
							}`}
						>
							<AnimatePresence mode="wait" initial={false}>
								<motion.span
									key={added ? "added" : "add"}
									initial={{ opacity: 0, y: 6 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -6 }}
									transition={{ duration: 0.15 }}
									className="block"
								>
									{added ? "Added!" : "Add"}
								</motion.span>
							</AnimatePresence>
						</motion.button>
					</div>
				</div>
			</Link>
		</motion.div>
	);
}
