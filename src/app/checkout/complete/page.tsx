"use client";

import { useCart } from "@/components/cart-provider";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function CheckoutCompleteContent() {
	const { clearCart } = useCart();
	const { data: session } = useSession();
	const searchParams = useSearchParams();
	const [pointsAwarded, setPointsAwarded] = useState<number | null>(null);

	useEffect(() => {
		clearCart();
	}, [clearCart]);

	useEffect(() => {
		const sessionId = searchParams.get("session_id");
		if (!sessionId || !session?.user) return;

		fetch("/api/points/award", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ sessionId }),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.awarded) {
					setPointsAwarded(data.awarded);
				}
			})
			.catch(() => {});
	}, [searchParams, session]);

	return (
		<div className="flex min-h-[70vh] items-center justify-center px-4">
			<div className="text-center max-w-md">
				<div className="mx-auto h-20 w-20 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6">
					<svg
						className="w-10 h-10 text-green-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M5 13l4 4L19 7"
						/>
					</svg>
				</div>
				<h1 className="text-3xl font-bold text-white mb-3">
					Purchase Complete!
				</h1>
				<p className="text-muted mb-4">
					Thank you for your purchase! Your items will be delivered to your
					account shortly. Check in-game for your new items.
				</p>

				{pointsAwarded !== null && pointsAwarded > 0 && (
					<div className="rounded-xl border border-accent/20 bg-accent/5 p-4 mb-6">
						<p className="text-sm text-muted">You earned</p>
						<p className="text-2xl font-black text-accent">
							+{pointsAwarded} points
						</p>
					</div>
				)}

				<Link
					href="/"
					className="inline-block rounded-lg bg-gradient-to-r from-accent to-rose px-6 py-3 text-sm font-semibold text-white hover:from-rose hover:to-accent transition-all shadow-lg shadow-accent/25"
				>
					Continue Shopping
				</Link>
			</div>
		</div>
	);
}

export default function CheckoutCompletePage() {
	return (
		<Suspense
			fallback={
				<div className="flex min-h-[70vh] items-center justify-center">
					<div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
				</div>
			}
		>
			<CheckoutCompleteContent />
		</Suspense>
	);
}
