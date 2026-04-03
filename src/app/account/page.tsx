"use client";

import { useSession, signOut } from "next-auth/react";
import { usePoints } from "@/components/points-provider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { NumberTicker } from "@/components/ui/number-ticker";
import { BorderBeam } from "@/components/ui/border-beam";

export default function AccountPage() {
	const { data: session, status } = useSession();
	const { points } = usePoints();
	const router = useRouter();

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/signin");
		}
	}, [status, router]);

	if (status === "loading" || !session) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<div className="h-8 w-8 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:px-8">
			<h1 className="text-3xl font-black text-foreground mb-8">My Account</h1>

			{/* Points Card */}
			<div className="relative rounded-2xl border border-rose-500/15 bg-gradient-to-br from-rose-500/5 via-card/50 to-violet-500/5 p-8 mb-6 overflow-hidden">
				<BorderBeam
					size={200}
					duration={12}
					colorFrom="#fb7185"
					colorTo="#a78bfa"
				/>
				<div className="relative z-10 flex items-center gap-5">
					<div className="h-16 w-16 rounded-2xl bg-rose-500/15 flex items-center justify-center">
						<svg
							className="w-8 h-8 text-rose-400"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L10 6.022 6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
						</svg>
					</div>
					<div>
						<p className="text-sm text-muted-foreground font-medium">
							Points Balance
						</p>
						<p className="text-5xl font-black text-foreground">
							<NumberTicker value={points} />
						</p>
					</div>
				</div>
				<p className="relative z-10 mt-5 text-sm text-muted-foreground">
					Earn <span className="text-rose-400 font-semibold">10 points</span>{" "}
					for every $1 spent. Points are awarded automatically after each
					purchase.
				</p>
			</div>

			{/* Account Info */}
			<div className="rounded-2xl border border-border bg-card/30 backdrop-blur-sm p-6 mb-6">
				<h2 className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground mb-5">
					Account Details
				</h2>
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-sm text-muted-foreground">Email</span>
						<span className="text-sm text-foreground font-mono">
							{session.user.email}
						</span>
					</div>
				</div>
			</div>

			{/* Actions */}
			<div className="flex flex-col sm:flex-row gap-3">
				<Link
					href="/"
					className="rounded-xl bg-rose-500 px-6 py-3 text-sm font-semibold text-white text-center hover:bg-rose-400 transition-colors shadow-lg shadow-rose-500/20"
				>
					Browse Store
				</Link>
				<button
					type="button"
					onClick={() => signOut({ callbackUrl: "/" })}
					className="rounded-xl border border-border px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-rose-500/20 transition-all"
				>
					Sign Out
				</button>
			</div>
		</div>
	);
}
