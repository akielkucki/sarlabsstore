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
			setUsernameError("Invalid Minecraft username (3-16 characters, letters/numbers/underscores).");
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
		<div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
			<h1 className="text-3xl font-bold text-white mb-8">Your Cart</h1>

			{isEmpty ? (
				<div className="flex flex-col items-center justify-center rounded-2xl border border-card-border bg-zinc-900/50 p-16">
					<div className="h-20 w-20 rounded-2xl bg-zinc-800 flex items-center justify-center mb-6">
						<svg
							className="w-10 h-10 text-zinc-600"
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
					<h2 className="text-xl font-semibold text-white mb-2">
						Your cart is empty
					</h2>
					<p className="text-muted mb-6">
						Browse our store to find something you like!
					</p>
					<Link
						href="/"
						className="rounded-lg bg-gradient-to-r from-accent to-rose px-6 py-3 text-sm font-semibold text-white hover:from-rose hover:to-accent transition-all shadow-lg shadow-accent/25"
					>
						Browse Store
					</Link>
				</div>
			) : (
				<div className="space-y-4">
					{/* Items */}
					{items.map((item) => (
						<div
							key={item.id}
							className="flex items-center gap-4 rounded-xl border border-card-border bg-zinc-900/50 p-4"
						>
							<div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-800">
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
											className="w-8 h-8 text-zinc-600"
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
								<h3 className="font-semibold text-white truncate">
									{item.name}
								</h3>
								<div className="flex items-center gap-2 mt-1">
									<button
										type="button"
										onClick={() =>
											updateQuantity(item.id, item.quantity - 1)
										}
										className="h-6 w-6 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 flex items-center justify-center text-sm"
									>
										-
									</button>
									<span className="text-sm text-muted w-6 text-center">
										{item.quantity}
									</span>
									<button
										type="button"
										onClick={() =>
											updateQuantity(item.id, item.quantity + 1)
										}
										className="h-6 w-6 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 flex items-center justify-center text-sm"
									>
										+
									</button>
								</div>
							</div>

							<div className="text-right flex-shrink-0">
								<div className="text-lg font-bold text-accent">
									{currencySymbol}
									{(item.price * item.quantity).toFixed(2)}
								</div>
								<button
									type="button"
									onClick={() => removeFromCart(item.id)}
									className="mt-1 text-xs text-red-400 hover:text-red-300 transition-colors"
								>
									Remove
								</button>
							</div>
						</div>
					))}

					{/* Minecraft Username */}
					<div className="rounded-xl border border-card-border bg-zinc-900/50 p-6 mt-6">
						<label htmlFor="minecraft-username" className="block text-sm font-semibold text-white mb-2">
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
							className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
						/>
						{usernameError && (
							<p className="mt-2 text-sm text-red-400">{usernameError}</p>
						)}
					</div>

					{/* Summary */}
					<div className="rounded-xl border border-card-border bg-zinc-900/50 p-6 mt-6">
						<div className="space-y-3">
							<div className="flex justify-between">
								<span className="text-lg font-semibold text-white">Total</span>
								<span className="text-2xl font-black text-accent">
									{currencySymbol}
									{total.toFixed(2)}
								</span>
							</div>
						</div>

						<button
							type="button"
							onClick={handleCheckout}
							disabled={checkingOut}
							className="mt-6 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-accent to-rose px-6 py-4 text-base font-bold text-white hover:from-rose hover:to-accent transition-all shadow-lg shadow-accent/25 hover:shadow-accent/40 disabled:opacity-60"
						>
							{checkingOut ? "Redirecting to Stripe..." : "Proceed to Checkout"}
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
