"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

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
			<div className="flex min-h-[70vh] items-center justify-center px-4">
				<div className="text-center max-w-md">
					<div className="mx-auto h-20 w-20 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6">
						<svg
							className="w-10 h-10 text-accent"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
					</div>
					<h1 className="text-3xl font-bold text-white mb-3">
						Check Your Email
					</h1>
					<p className="text-muted mb-2">
						We sent a sign-in link to
					</p>
					<p className="text-accent font-medium mb-6">{email}</p>
					<p className="text-sm text-muted">
						Click the link in the email to sign in. The link expires in 24 hours.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-[70vh] items-center justify-center px-4">
			<div className="w-full max-w-sm">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-white mb-2">Sign In</h1>
					<p className="text-muted">
						Enter your email to receive a magic sign-in link.
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-white mb-2"
						>
							Email Address
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
							className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
							autoFocus
						/>
						{error && (
							<p className="mt-2 text-sm text-red-400">{error}</p>
						)}
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full rounded-lg bg-gradient-to-r from-accent to-rose px-6 py-3 text-sm font-semibold text-white hover:from-rose hover:to-accent transition-all shadow-lg shadow-accent/25 hover:shadow-accent/40 disabled:opacity-60"
					>
						{loading ? "Sending..." : "Send Sign-In Link"}
					</button>
				</form>
			</div>
		</div>
	);
}
