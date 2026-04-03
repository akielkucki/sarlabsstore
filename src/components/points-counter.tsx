"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform, animate } from "motion/react";
import { usePoints } from "./points-provider";

export function PointsCounter() {
	const { points, awarded } = usePoints();
	const [display, setDisplay] = useState(points);
	const [showBlip, setShowBlip] = useState(false);
	const prevPoints = useRef(points);
	const motionVal = useMotionValue(points);
	const rounded = useTransform(motionVal, (v) => Math.round(v));

	// Sync display with the rounded motion value
	useEffect(() => {
		const unsubscribe = rounded.on("change", (v) => setDisplay(v));
		return unsubscribe;
	}, [rounded]);

	// When points change, animate from previous to new
	useEffect(() => {
		const prev = prevPoints.current;
		if (points !== prev) {
			// Animate the count-up
			animate(motionVal, points, {
				duration: 1.2,
				ease: [0.22, 1, 0.36, 1],
			});

			// Show the blip if points increased
			if (points > prev && awarded > 0) {
				setShowBlip(true);
				const timer = setTimeout(() => setShowBlip(false), 2500);
				return () => clearTimeout(timer);
			}

			prevPoints.current = points;
		}
	}, [points, awarded, motionVal]);

	return (
		<span className="relative inline-flex items-center gap-1.5">
			<svg
				className="w-3 h-3 text-rose-400"
				fill="currentColor"
				viewBox="0 0 20 20"
			>
				<path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L10 6.022 6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
			</svg>
			<span className="font-bold text-rose-400 tabular-nums">{display}</span>

			{/* +N blip */}
			<AnimatePresence>
				{showBlip && awarded > 0 && (
					<motion.span
						key={`blip-${points}`}
						initial={{ opacity: 0, y: 4, scale: 0.8 }}
						animate={{ opacity: 1, y: -14, scale: 1 }}
						exit={{ opacity: 0, y: -22, scale: 0.8 }}
						transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
						className="absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none text-[11px] font-bold text-emerald-400 whitespace-nowrap"
					>
						+{awarded}
					</motion.span>
				)}
			</AnimatePresence>
		</span>
	);
}
