"use client";

import { useCart } from "@/components/cart-provider";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Particles } from "@/components/ui/particles";

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
				if (data.awarded) setPointsAwarded(data.awarded);
			})
			.catch(() => {});
	}, [searchParams, session]);

	return (
		<div className="relative flex min-h-[85vh] items-center justify-center px-4">
			<Particles
				className="absolute inset-0"
				quantity={40}
				color="#4ade80"
				ease={80}
			/>
			<div className="relative z-10 text-center max-w-md">
				<div className="mx-auto h-20 w-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center mb-6">
					<svg
						className="w-10 h-10 text-emerald-400"
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
				<h1 className="text-3xl font-black text-foreground mb-3">
					Purchase Complete!
				</h1>
				<p className="text-muted-foreground mb-4">
					Thank you! Your items will be delivered to your account shortly.
				</p>

				{pointsAwarded !== null && pointsAwarded > 0 && (
					<div className="rounded-2xl border border-rose-500/15 bg-rose-500/5 p-5 mb-6">
						<p className="text-sm text-muted-foreground">You earned</p>
						<p className="text-3xl font-black text-rose-400">
							+{pointsAwarded} points
						</p>
					</div>
				)}

				<Link
					href="/"
					className="inline-flex rounded-xl bg-rose-500 px-8 py-3 text-sm font-semibold text-white hover:bg-rose-400 transition-colors shadow-lg shadow-rose-500/20"
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
				<div className="flex min-h-[85vh] items-center justify-center">
					<div className="h-8 w-8 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
				</div>
			}
		>
			<CheckoutCompleteContent />
		</Suspense>
	);
}
