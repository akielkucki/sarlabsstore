"use client";

import Link from "next/link";
import { useCart } from "./cart-provider";
import { UserMenu } from "./user-menu";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

interface Category {
	id: string;
	name: string;
}

export function Navbar({ categories }: { categories: Category[] }) {
	const { itemCount } = useCart();
	const [scrolled, setScrolled] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);

	useEffect(() => {
		const handler = () => setScrolled(window.scrollY > 10);
		window.addEventListener("scroll", handler);
		return () => window.removeEventListener("scroll", handler);
	}, []);

	return (
		<nav
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				scrolled
					? "bg-background/95 backdrop-blur-md shadow-lg shadow-accent/5"
					: "bg-transparent"
			}`}
		>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					{/* Logo */}
					<Link href="/" className="flex items-center gap-2 group">
						<span className="text-lg font-bold tracking-tight">
							<span className="text-accent">Sar</span>
							<span className="text-white">Labs</span>
						</span>
					</Link>

					{/* Desktop Categories */}
					<div className="hidden md:flex items-center gap-1">
						<Link
							href="/"
							className="px-3 py-2 text-sm font-medium text-zinc-300 hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
						>
							Home
						</Link>
						{categories.map((cat) => (
							<Link
								key={cat.id}
								href={`/category/${cat.id}`}
								className="px-3 py-2 text-sm font-medium text-zinc-300 hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
							>
								{cat.name}
							</Link>
						))}
					</div>

					{/* User + Cart + Mobile Menu */}
					<div className="flex items-center gap-3">
						<UserMenu />
						<Link
							href="/cart"
							className="relative flex items-center gap-2 rounded-lg bg-gradient-to-r from-accent to-rose px-4 py-2 text-sm font-semibold text-white hover:from-rose hover:to-accent transition-all shadow-lg shadow-accent/20 hover:shadow-accent/30"
						>
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
							</svg>
							Cart
							<AnimatePresence>
								{itemCount > 0 && (
									<motion.span
										key={itemCount}
										initial={{ scale: 0, opacity: 0 }}
										animate={{ scale: [1.4, 1], opacity: 1 }}
										exit={{ scale: 0, opacity: 0 }}
										transition={{ type: "spring", stiffness: 500, damping: 20 }}
										className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-background text-[10px] font-bold text-accent ring-2 ring-accent"
									>
										{itemCount}
									</motion.span>
								)}
							</AnimatePresence>
						</Link>

						{/* Mobile hamburger */}
						<button
							type="button"
							className="md:hidden p-2 text-zinc-300 hover:text-foreground"
							onClick={() => setMenuOpen(!menuOpen)}
						>
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								{menuOpen ? (
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								) : (
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
								)}
							</svg>
						</button>
					</div>
				</div>
			</div>

			{/* Mobile menu */}
			{menuOpen && (
				<div className="md:hidden bg-background/95 backdrop-blur-md border-t border-card-border">
					<div className="px-4 py-3 space-y-1">
						<Link
							href="/"
							className="block px-3 py-2 text-sm font-medium text-zinc-300 hover:text-foreground rounded-lg hover:bg-white/5"
							onClick={() => setMenuOpen(false)}
						>
							Home
						</Link>
						{categories.map((cat) => (
							<Link
								key={cat.id}
								href={`/category/${cat.id}`}
								className="block px-3 py-2 text-sm font-medium text-zinc-300 hover:text-foreground rounded-lg hover:bg-white/5"
								onClick={() => setMenuOpen(false)}
							>
								{cat.name}
							</Link>
						))}
					</div>
				</div>
			)}
		</nav>
	);
}
