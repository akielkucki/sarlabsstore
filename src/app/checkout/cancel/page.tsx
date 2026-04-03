import Link from "next/link";

export default function CheckoutCancelPage() {
	return (
		<div className="flex min-h-[85vh] items-center justify-center px-4">
			<div className="text-center max-w-md">
				<div className="mx-auto h-20 w-20 rounded-2xl bg-secondary flex items-center justify-center mb-6">
					<svg
						className="w-10 h-10 text-muted-foreground"
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
				<h1 className="text-3xl font-black text-foreground mb-3">
					Checkout Cancelled
				</h1>
				<p className="text-muted-foreground mb-8">
					Your purchase was cancelled. No charges were made. Your cart items are
					still saved.
				</p>
				<div className="flex flex-col sm:flex-row items-center justify-center gap-3">
					<Link
						href="/cart"
						className="rounded-xl bg-rose-500 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-400 transition-colors shadow-lg shadow-rose-500/20"
					>
						Return to Cart
					</Link>
					<Link
						href="/"
						className="rounded-xl border border-border px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-all"
					>
						Continue Shopping
					</Link>
				</div>
			</div>
		</div>
	);
}
