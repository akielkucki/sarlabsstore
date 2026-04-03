"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./cart-provider";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

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
}

export function PackageCard({ pkg }: PackageCardProps) {
	const { addToCart } = useCart();
	const [added, setAdded] = useState(false);

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

	const hasDiscount = pkg.base_price !== pkg.total_price && pkg.base_price > pkg.total_price;
	const currencySymbol = pkg.currency === "USD" ? "$" : pkg.currency === "EUR" ? "\u20ac" : pkg.currency === "GBP" ? "\u00a3" : `${pkg.currency} `;

	return (
		<Link
			href={`/package/${pkg.id}`}
			className="group relative flex flex-col overflow-hidden rounded-xl border border-card-border bg-gradient-to-b from-zinc-900 to-background hover:border-accent/30 transition-all duration-300 hover:shadow-xl hover:shadow-accent/5"
		>
			{/* Image */}
			<div className="relative aspect-square overflow-hidden bg-zinc-900">
				{pkg.image ? (
					<Image
						src={pkg.image}
						alt={pkg.name}
						fill
						className="object-cover transition-transform duration-500 group-hover:scale-110"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
						<div className="h-16 w-16 rounded-xl bg-gradient-to-br from-accent/20 to-rose/20 flex items-center justify-center">
							<svg className="w-8 h-8 text-accent/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
							</svg>
						</div>
					</div>
				)}
				{hasDiscount && (
					<div className="absolute top-3 right-3 rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-bold text-white shadow-lg">
						SALE
					</div>
				)}
			</div>

			{/* Content */}
			<div className="flex flex-1 flex-col p-4">
				<h3 className="text-sm font-semibold text-white group-hover:text-accent transition-colors line-clamp-2">
					{pkg.name}
				</h3>

				<div className="mt-auto pt-3 flex items-end justify-between">
					<div>
						{hasDiscount && (
							<span className="text-xs text-muted line-through">
								{currencySymbol}{pkg.base_price.toFixed(2)}
							</span>
						)}
						<div className="text-lg font-bold text-accent">
							{currencySymbol}{pkg.total_price.toFixed(2)}
						</div>
					</div>

					<motion.button
						type="button"
						onClick={handleAdd}
						whileTap={{ scale: 0.9 }}
						animate={added ? { scale: [1, 1.15, 1] } : {}}
						transition={{ duration: 0.3, ease: "easeOut" }}
						className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
							added
								? "bg-green-500/20 text-green-400 border border-green-500/30"
								: "bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 hover:border-accent/40"
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
								{added ? "Added!" : "Add to Cart"}
							</motion.span>
						</AnimatePresence>
					</motion.button>
				</div>
			</div>
		</Link>
	);
}
