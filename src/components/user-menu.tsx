"use client";

import { useSession, signOut } from "next-auth/react";
import { usePoints } from "./points-provider";
import { PointsCounter } from "./points-counter";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export function UserMenu() {
	const { data: session, status } = useSession();
	const { points } = usePoints();
	const [open, setOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	if (status === "loading") {
		return (
			<div className="h-8 w-8 rounded-full bg-secondary animate-pulse" />
		);
	}

	if (!session) {
		return (
			<Link
				href="/signin"
				className="px-3.5 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/[0.04]"
			>
				Sign In
			</Link>
		);
	}

	return (
		<div className="relative" ref={menuRef}>
			<button
				type="button"
				onClick={() => setOpen(!open)}
				className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors"
			>
				<div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-500/15 text-rose-400 text-xs font-bold ring-1 ring-rose-500/20">
					{session.user.email?.[0]?.toUpperCase() ?? "?"}
				</div>
				<span className="hidden sm:inline-flex text-[13px]">
					<PointsCounter />
				</span>
			</button>

			{open && (
				<div className="absolute right-0 mt-2 w-64 rounded-xl border border-border glass-strong shadow-2xl shadow-black/50 overflow-hidden z-50">
					<div className="px-4 py-3.5 border-b border-border">
						<p className="text-sm font-medium text-foreground truncate">
							{session.user.email}
						</p>
						<div className="mt-1.5 flex items-center gap-1.5">
							<svg
								className="w-3.5 h-3.5 text-rose-400"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L10 6.022 6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
							</svg>
							<span className="text-sm font-bold text-rose-400">
								{points} points
							</span>
						</div>
					</div>
					<div className="py-1">
						<Link
							href="/account"
							onClick={() => setOpen(false)}
							className="block px-4 py-2.5 text-[13px] text-muted-foreground hover:bg-white/[0.04] hover:text-foreground transition-colors"
						>
							My Account
						</Link>
						<button
							type="button"
							onClick={() => signOut()}
							className="block w-full text-left px-4 py-2.5 text-[13px] text-muted-foreground hover:bg-white/[0.04] hover:text-foreground transition-colors"
						>
							Sign Out
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
