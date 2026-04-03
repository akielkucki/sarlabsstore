"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AccountPage() {
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/signin");
		}
	}, [status, router]);

	if (status === "loading" || !session) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
			<h1 className="text-3xl font-bold text-white mb-8">My Account</h1>

			{/* Points Card */}
			<div className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/5 to-transparent p-6 mb-6">
				<div className="flex items-center gap-4">
					<div className="h-14 w-14 rounded-xl bg-accent/20 flex items-center justify-center">
						<svg
							className="w-7 h-7 text-accent"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L10 6.022 6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
						</svg>
					</div>
					<div>
						<p className="text-sm text-muted">Your Points Balance</p>
						<p className="text-4xl font-black text-accent">
							{session.user.points}
						</p>
					</div>
				</div>
				<p className="mt-4 text-sm text-muted">
					Earn 10 points for every $1 spent. Points are awarded automatically
					after each purchase.
				</p>
			</div>

			{/* Account Info */}
			<div className="rounded-xl border border-card-border bg-zinc-900/50 p-6 mb-6">
				<h2 className="text-lg font-semibold text-white mb-4">
					Account Details
				</h2>
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<span className="text-sm text-muted">Email</span>
						<span className="text-sm text-white">{session.user.email}</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm text-muted">Member Since</span>
						<span className="text-sm text-white">
							{new Date().toLocaleDateString()}
						</span>
					</div>
				</div>
			</div>

			{/* Actions */}
			<div className="flex flex-col sm:flex-row gap-3">
				<Link
					href="/"
					className="rounded-lg bg-gradient-to-r from-accent to-rose px-6 py-3 text-sm font-semibold text-white text-center hover:from-rose hover:to-accent transition-all shadow-lg shadow-accent/25"
				>
					Browse Store
				</Link>
				<button
					type="button"
					onClick={() => signOut({ callbackUrl: "/" })}
					className="rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-all"
				>
					Sign Out
				</button>
			</div>
		</div>
	);
}
