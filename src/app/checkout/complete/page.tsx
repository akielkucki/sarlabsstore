"use client";

import { useCart } from "@/components/cart-provider";
import { usePoints } from "@/components/points-provider";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Particles } from "@/components/ui/particles";

type AwardState = "idle" | "loading" | "awarded" | "pending" | "error";

function CheckoutCompleteContent() {
	const { clearCart } = useCart();
	const { updatePoints } = usePoints();
	const searchParams = useSearchParams();
	const [state, setState] = useState<AwardState>("idle");
	const [pointsAwarded, setPointsAwarded] = useState(0);
	const [estimatedPoints, setEstimatedPoints] = useState(0);
	const calledRef = useRef(false);

	useEffect(() => {
		clearCart();
	}, [clearCart]);

	useEffect(() => {
		if (calledRef.current) return;
		const sessionId = searchParams.get("session_id");
		if (!sessionId) return;

		calledRef.current = true;
		setState("loading");

		fetch("/api/points/award", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ sessionId }),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.awarded && data.awarded > 0) {
					setPointsAwarded(data.awarded);
					updatePoints(data.awarded);
					setState("awarded");
				} else if (data.alreadyAwarded) {
					// Already got points on a previous call
					setPointsAwarded(data.points);
					setState("awarded");
				} else if (data.pending) {
					setEstimatedPoints(data.estimatedPoints ?? 0);
					setState("pending");
				} else if (data.estimatedPoints) {
					// Not logged in but we know how much they'd get
					setEstimatedPoints(data.estimatedPoints);
					setState("awarded");
					setPointsAwarded(0);
				} else {
					setState("awarded");
				}
			})
			.catch(() => {
				setState("error");
				calledRef.current = false;
			});
	}, [searchParams, updatePoints]);

	return (
		<div className="relative flex min-h-[85vh] items-center justify-center px-4">
			<Particles
				className="absolute inset-0"
				quantity={40}
				color="#4ade80"
				ease={80}
			/>
			<div className="relative z-10 text-center max-w-md w-full">
				{/* Success icon */}
				<motion.div
					initial={{ scale: 0, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{
						type: "spring",
						stiffness: 300,
						damping: 20,
						delay: 0.1,
					}}
					className="mx-auto h-20 w-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center mb-6"
				>
					<svg
						className="w-10 h-10 text-emerald-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<motion.path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M5 13l4 4L19 7"
							initial={{ pathLength: 0 }}
							animate={{ pathLength: 1 }}
							transition={{ duration: 0.5, delay: 0.3 }}
						/>
					</svg>
				</motion.div>

				<motion.h1
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="text-3xl font-black text-foreground mb-3"
				>
					Purchase Complete!
				</motion.h1>

				<motion.p
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="text-muted-foreground mb-6"
				>
					Thank you! Your items will be delivered to your account shortly.
				</motion.p>

				{/* Points card — always visible once we have data */}
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.45, duration: 0.5 }}
					className="rounded-2xl border border-rose-500/15 bg-rose-500/5 backdrop-blur-sm p-6 mb-8"
				>
					{state === "loading" && (
						<div className="flex flex-col items-center gap-3">
							<div className="h-5 w-5 rounded-full border-2 border-rose-400 border-t-transparent animate-spin" />
							<p className="text-sm text-muted-foreground">
								Confirming your points...
							</p>
						</div>
					)}

					{state === "awarded" && pointsAwarded > 0 && (
						<>
							<p className="text-sm text-muted-foreground mb-1">
								You earned
							</p>
							<motion.p
								initial={{ scale: 0.5, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								transition={{
									type: "spring",
									stiffness: 300,
									damping: 15,
									delay: 0.1,
								}}
								className="text-4xl font-black text-rose-400"
							>
								+{pointsAwarded}
							</motion.p>
							<p className="text-sm text-rose-400/70 font-medium mt-1">
								points
							</p>
						</>
					)}

					{state === "awarded" && pointsAwarded === 0 && estimatedPoints > 0 && (
						<>
							<p className="text-sm text-muted-foreground mb-1">
								Sign in to earn
							</p>
							<p className="text-3xl font-black text-rose-400">
								+{estimatedPoints}
							</p>
							<p className="text-sm text-rose-400/70 font-medium mt-1">
								points on this purchase
							</p>
							<Link
								href="/signin"
								className="inline-block mt-3 text-sm font-semibold text-rose-400 hover:text-rose-300 transition-colors"
							>
								Sign in to claim &rarr;
							</Link>
						</>
					)}

					{state === "pending" && (
						<>
							<div className="flex items-center justify-center gap-2 mb-2">
								<div className="h-4 w-4 rounded-full border-2 border-rose-400 border-t-transparent animate-spin" />
								<p className="text-sm font-medium text-rose-400">
									Payment confirming...
								</p>
							</div>
							{estimatedPoints > 0 && (
								<p className="text-2xl font-black text-rose-400/70">
									+{estimatedPoints} points
								</p>
							)}
							<p className="text-xs text-muted-foreground mt-2">
								Points will appear in your account once payment
								confirms. This usually takes a few seconds.
							</p>
						</>
					)}

					{state === "error" && (
						<p className="text-sm text-muted-foreground">
							We couldn&apos;t confirm your points right now. Don&apos;t
							worry — they&apos;ll be credited to your account
							automatically.
						</p>
					)}
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.6 }}
				>
					<Link
						href="/"
						className="inline-flex rounded-xl bg-rose-500 px-8 py-3 text-sm font-semibold text-white hover:bg-rose-400 transition-colors shadow-lg shadow-rose-500/20"
					>
						Continue Shopping
					</Link>
				</motion.div>
			</div>
		</div>
	);
}

export default function CheckoutCompletePage() {
	return (
		<Suspense
			fallback={
				<div className="flex min-h-[85vh] items-center justify-center">
					<div className="h-8 w-8 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
				</div>
			}
		>
			<CheckoutCompleteContent />
		</Suspense>
	);
}
