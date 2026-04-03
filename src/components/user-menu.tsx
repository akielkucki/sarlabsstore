"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export function UserMenu() {
	const { data: session, status } = useSession();
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
			<div className="h-8 w-8 rounded-full bg-zinc-800 animate-pulse" />
		);
	}

	if (!session) {
		return (
			<Link
				href="/signin"
				className="px-3 py-2 text-sm font-medium text-zinc-300 hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
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
				className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-300 hover:text-foreground hover:bg-white/5 transition-colors"
			>
				<div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20 text-accent text-xs font-bold">
					{session.user.email?.[0]?.toUpperCase() ?? "?"}
				</div>
				<span className="hidden sm:inline text-accent font-semibold">
					{session.user.points} pts
				</span>
			</button>

			{open && (
				<div className="absolute right-0 mt-2 w-64 rounded-xl border border-card-border bg-zinc-900 shadow-xl shadow-black/50 overflow-hidden z-50">
					<div className="px-4 py-3 border-b border-card-border">
						<p className="text-sm font-medium text-white truncate">
							{session.user.email}
						</p>
						<div className="mt-1 flex items-center gap-1.5">
							<svg
								className="w-3.5 h-3.5 text-accent"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L10 6.022 6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
							</svg>
							<span className="text-sm font-bold text-accent">
								{session.user.points} points
							</span>
						</div>
					</div>
					<div className="py-1">
						<Link
							href="/account"
							onClick={() => setOpen(false)}
							className="block px-4 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-foreground transition-colors"
						>
							My Account
						</Link>
						<button
							type="button"
							onClick={() => signOut()}
							className="block w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-foreground transition-colors"
						>
							Sign Out
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
