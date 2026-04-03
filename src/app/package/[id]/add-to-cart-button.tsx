"use client";

import { useCart } from "@/components/cart-provider";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface AddToCartButtonProps {
	packageId: string;
	priceId: string;
	name: string;
	image: string | null;
	price: number;
	currency: string;
}

export function AddToCartButton({
	packageId,
	priceId,
	name,
	image,
	price,
	currency,
}: AddToCartButtonProps) {
	const { addToCart } = useCart();
	const [added, setAdded] = useState(false);

	const handleClick = () => {
		addToCart({ id: packageId, priceId, name, image, price, currency });
		setAdded(true);
		setTimeout(() => setAdded(false), 2500);
	};

	return (
		<motion.button
			type="button"
			onClick={handleClick}
			disabled={added}
			whileTap={{ scale: 0.97 }}
			animate={added ? { scale: [1, 1.03, 1] } : {}}
			transition={{ duration: 0.3, ease: "easeOut" }}
			className={`w-full rounded-xl px-6 py-4 text-base font-bold transition-all duration-200 ${
				added
					? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
					: "bg-rose-500 text-white hover:bg-rose-400 shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30"
			} disabled:opacity-60`}
		>
			<AnimatePresence mode="wait" initial={false}>
				<motion.span
					key={added ? "added" : "add"}
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -8 }}
					transition={{ duration: 0.15 }}
					className="block"
				>
					{added ? "Added to Cart!" : "Add to Cart"}
				</motion.span>
			</AnimatePresence>
		</motion.button>
	);
}
