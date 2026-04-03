import Link from "next/link";

export default function CheckoutCancelPage() {
	return (
		<div className="flex min-h-[70vh] items-center justify-center px-4">
			<div className="text-center max-w-md">
				<div className="mx-auto h-20 w-20 rounded-2xl bg-zinc-800 flex items-center justify-center mb-6">
					<svg
						className="w-10 h-10 text-zinc-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</div>
				<h1 className="text-3xl font-bold text-white mb-3">
					Checkout Cancelled
				</h1>
				<p className="text-muted mb-8">
					Your purchase was cancelled. No charges were made. Your cart items are
					still saved if you&apos;d like to try again.
				</p>
				<div className="flex flex-col sm:flex-row items-center justify-center gap-3">
					<Link
						href="/cart"
						className="rounded-lg bg-gradient-to-r from-accent to-rose px-6 py-3 text-sm font-semibold text-white hover:from-rose hover:to-accent transition-all shadow-lg shadow-accent/25"
					>
						Return to Cart
					</Link>
					<Link
						href="/"
						className="rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-all"
					>
						Continue Shopping
					</Link>
				</div>
			</div>
		</div>
	);
}
