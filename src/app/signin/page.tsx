"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Particles } from "@/components/ui/particles";

export default function SignInPage() {
	const [email, setEmail] = useState("");
	const [sent, setSent] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email.trim()) {
			setError("Please enter your email.");
			return;
		}
		setError("");
		setLoading(true);
		try {
			const result = await signIn("resend", {
				email: email.trim(),
				redirect: false,
			});
			if (result?.error) {
				setError("Failed to send sign-in link. Please try again.");
			} else {
				setSent(true);
			}
		} catch {
			setError("Something went wrong. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	if (sent) {
		return (
			<div className="relative flex min-h-[85vh] items-center justify-center px-4">
				<Particles
					className="absolute inset-0"
					quantity={30}
					color="#fb7185"
					ease={80}
				/>
				<div className="relative z-10 text-center max-w-md">
					<div className="mx-auto h-20 w-20 rounded-2xl bg-rose-500/10 border border-rose-500/15 flex items-center justify-center mb-6">
						<svg
							className="w-10 h-10 text-rose-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
					</div>
					<h1 className="text-3xl font-black text-foreground mb-3">
						Check Your Email
					</h1>
					<p className="text-muted-foreground mb-2">
						We sent a sign-in link to
					</p>
					<p className="text-rose-400 font-semibold font-mono text-sm mb-6">
						{email}
					</p>
					<p className="text-sm text-muted-foreground">
						Click the link in the email to sign in. Expires in 24 hours.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="relative flex min-h-[85vh] items-center justify-center px-4">
			<Particles
				className="absolute inset-0"
				quantity={30}
				color="#fb7185"
				ease={80}
			/>
			<div className="relative z-10 w-full max-w-sm">
				<div className="text-center mb-10">
					<Link href="/" className="inline-flex items-center gap-2 mb-8">
						<div className="h-8 w-8 rounded-lg bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center">
							<span className="text-white font-black text-xs">S</span>
						</div>
						<span className="text-base font-bold tracking-tight">
							<span className="text-rose-400">Sar</span>
							<span className="text-foreground">Labs</span>
						</span>
					</Link>
					<h1 className="text-3xl font-black text-foreground mb-2">
						Welcome back
					</h1>
					<p className="text-muted-foreground text-sm">
						Enter your email to receive a magic sign-in link.
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-foreground mb-2"
						>
							Email
						</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
								setError("");
							}}
							placeholder="you@example.com"
							className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-foreground placeholder-muted-foreground focus:border-rose-500/50 focus:outline-none focus:ring-1 focus:ring-rose-500/50 transition-colors"
							autoFocus
						/>
						{error && (
							<p className="mt-2 text-sm text-rose-400">{error}</p>
						)}
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full rounded-xl bg-rose-500 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-400 transition-all shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30 disabled:opacity-60"
					>
						{loading ? "Sending..." : "Send Sign-In Link"}
					</button>
				</form>

				<p className="mt-8 text-center text-xs text-muted-foreground">
					No account? One will be created automatically.
				</p>
			</div>
		</div>
	);
}
