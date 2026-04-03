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
			whileTap={{ scale: 0.95 }}
			animate={added ? { scale: [1, 1.05, 1] } : {}}
			transition={{ duration: 0.3, ease: "easeOut" }}
			className={`w-full rounded-xl px-6 py-4 text-base font-bold transition-colors ${
				added
					? "bg-green-500/20 text-green-400 border border-green-500/30"
					: "bg-gradient-to-r from-accent to-rose text-white hover:from-rose hover:to-accent shadow-lg shadow-accent/25 hover:shadow-accent/40"
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
