"use client";

import { useCart } from "@/components/cart-provider";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
	const { items, total, currency, removeFromCart, updateQuantity } = useCart();
	const [checkingOut, setCheckingOut] = useState(false);
	const [minecraftUsername, setMinecraftUsername] = useState("");
	const [usernameError, setUsernameError] = useState("");
	const isEmpty = items.length === 0;

	const currencySymbol =
		currency === "USD"
			? "$"
			: currency === "EUR"
				? "\u20ac"
				: currency === "GBP"
					? "\u00a3"
					: `${currency} `;

	const handleCheckout = async () => {
		const trimmed = minecraftUsername.trim();
		if (!trimmed) {
			setUsernameError("Please enter your Minecraft username.");
			return;
		}
		if (!/^[a-zA-Z0-9_]{3,16}$/.test(trimmed)) {
			setUsernameError(
				"Invalid Minecraft username (3-16 characters, letters/numbers/underscores).",
			);
			return;
		}
		setUsernameError("");
		setCheckingOut(true);
		try {
			const res = await fetch("/api/checkout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ items, minecraftUsername: trimmed }),
			});
			const data = await res.json();
			if (data.url) {
				window.location.href = data.url;
			} else {
				console.error("Checkout error:", data.error);
				setCheckingOut(false);
			}
		} catch (error) {
			console.error("Checkout error:", error);
			setCheckingOut(false);
		}
	};

	return (
		<div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
			<h1 className="text-3xl font-black text-foreground mb-8">Your Cart</h1>

			{isEmpty ? (
				<div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card/30 p-16">
					<div className="h-20 w-20 rounded-2xl bg-secondary flex items-center justify-center mb-6">
						<svg
							className="w-10 h-10 text-muted-foreground"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
							/>
						</svg>
					</div>
					<h2 className="text-xl font-bold text-foreground mb-2">
						Your cart is empty
					</h2>
					<p className="text-muted-foreground mb-6">
						Browse our store to find something you like!
					</p>
					<Link
						href="/"
						className="rounded-xl bg-rose-500 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-400 transition-colors shadow-lg shadow-rose-500/20"
					>
						Browse Store
					</Link>
				</div>
			) : (
				<div className="space-y-4">
					{items.map((item) => (
						<div
							key={item.id}
							className="flex items-center gap-4 rounded-2xl border border-border bg-card/30 backdrop-blur-sm p-4"
						>
							<div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-secondary">
								{item.image ? (
									<Image
										src={item.image}
										alt={item.name}
										fill
										className="object-cover"
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center">
										<svg
											className="w-8 h-8 text-muted-foreground"
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
								)}
							</div>
							<div className="flex-1 min-w-0">
								<h3 className="font-semibold text-foreground truncate">
									{item.name}
								</h3>
								<div className="flex items-center gap-2 mt-2">
									<button
										type="button"
										onClick={() =>
											updateQuantity(item.id, item.quantity - 1)
										}
										className="h-7 w-7 rounded-lg bg-secondary text-muted-foreground hover:text-foreground flex items-center justify-center text-sm transition-colors"
									>
										-
									</button>
									<span className="text-sm text-muted-foreground w-6 text-center font-mono">
										{item.quantity}
									</span>
									<button
										type="button"
										onClick={() =>
											updateQuantity(item.id, item.quantity + 1)
										}
										className="h-7 w-7 rounded-lg bg-secondary text-muted-foreground hover:text-foreground flex items-center justify-center text-sm transition-colors"
									>
										+
									</button>
								</div>
							</div>
							<div className="text-right flex-shrink-0">
								<div className="text-lg font-black text-foreground">
									{currencySymbol}
									{(item.price * item.quantity).toFixed(2)}
								</div>
								<button
									type="button"
									onClick={() => removeFromCart(item.id)}
									className="mt-1 text-xs text-rose-400 hover:text-rose-300 transition-colors"
								>
									Remove
								</button>
							</div>
						</div>
					))}

					{/* Minecraft Username */}
					<div className="rounded-2xl border border-border bg-card/30 backdrop-blur-sm p-6 mt-6">
						<label
							htmlFor="minecraft-username"
							className="block text-sm font-semibold text-foreground mb-2"
						>
							Minecraft Username
						</label>
						<input
							id="minecraft-username"
							type="text"
							value={minecraftUsername}
							onChange={(e) => {
								setMinecraftUsername(e.target.value);
								setUsernameError("");
							}}
							placeholder="e.g. Steve"
							className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-foreground placeholder-muted-foreground focus:border-rose-500/50 focus:outline-none focus:ring-1 focus:ring-rose-500/50 transition-colors"
						/>
						{usernameError && (
							<p className="mt-2 text-sm text-rose-400">{usernameError}</p>
						)}
					</div>

					{/* Summary */}
					<div className="rounded-2xl border border-border bg-card/30 backdrop-blur-sm p-6 mt-6">
						<div className="flex justify-between items-center">
							<span className="text-lg font-semibold text-foreground">
								Total
							</span>
							<span className="text-3xl font-black text-foreground">
								{currencySymbol}
								{total.toFixed(2)}
							</span>
						</div>
						<p className="text-xs text-muted-foreground mt-1 text-right">
							Earn {Math.floor(total * 10)} points with this purchase
						</p>
						<button
							type="button"
							onClick={handleCheckout}
							disabled={checkingOut}
							className="mt-6 flex w-full items-center justify-center rounded-xl bg-rose-500 px-6 py-4 text-base font-bold text-white hover:bg-rose-400 transition-all shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30 disabled:opacity-60"
						>
							{checkingOut
								? "Redirecting to Stripe..."
								: "Proceed to Checkout"}
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
