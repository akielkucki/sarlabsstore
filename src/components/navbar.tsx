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
		let ticking = false;
		const handler = () => {
			if (!ticking) {
				ticking = true;
				requestAnimationFrame(() => {
					setScrolled(window.scrollY > 10);
					ticking = false;
				});
			}
		};
		window.addEventListener("scroll", handler, { passive: true });
		return () => window.removeEventListener("scroll", handler);
	}, []);

	// Lock body scroll when mobile menu is open
	useEffect(() => {
		if (menuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [menuOpen]);

	return (
		<>
			<nav
				className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
					scrolled
						? "glass-strong shadow-lg shadow-black/20"
						: "bg-transparent"
				}`}
			>
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						{/* Logo */}
						<Link href="/" className="flex items-center gap-2.5 group">
							<div className="h-8 w-8 rounded-lg bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:shadow-rose-500/40 transition-shadow duration-300">
								<span className="text-white font-black text-xs">S</span>
							</div>
							<span className="text-base font-bold tracking-tight">
								<span className="text-rose-400">Sar</span>
								<span className="text-foreground">Labs</span>
							</span>
						</Link>

						{/* Desktop Links */}
						<div className="hidden md:flex items-center gap-1">
							<Link
								href="/"
								className="px-3.5 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/[0.04]"
							>
								Home
							</Link>
							{categories.map((cat) => (
								<Link
									key={cat.id}
									href={`/category/${cat.id}`}
									className="px-3.5 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/[0.04]"
								>
									{cat.name}
								</Link>
							))}
						</div>

						{/* Right side */}
						<div className="flex items-center gap-2">
							<div className="hidden md:block">
								<UserMenu />
							</div>

							<Link
								href="/cart"
								className="relative flex items-center gap-2 rounded-lg bg-rose-500 px-4 py-2 text-[13px] font-semibold text-white hover:bg-rose-400 transition-all duration-200 shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30"
							>
								<svg
									className="w-3.5 h-3.5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2.5}
										d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
									/>
								</svg>
								<span className="hidden sm:inline">Cart</span>
								<AnimatePresence>
									{itemCount > 0 && (
										<motion.span
											key={itemCount}
											initial={{ scale: 0 }}
											animate={{ scale: [1.3, 1] }}
											exit={{ scale: 0 }}
											transition={{
												type: "spring",
												stiffness: 500,
												damping: 20,
											}}
											className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-rose-600 ring-2 ring-background"
										>
											{itemCount}
										</motion.span>
									)}
								</AnimatePresence>
							</Link>

							{/* Mobile hamburger */}
							<button
								type="button"
								className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
								onClick={() => setMenuOpen(!menuOpen)}
							>
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6h16M4 12h16M4 18h16"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</nav>

			{/* Full-page mobile menu */}
			<AnimatePresence>
				{menuOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.25 }}
						className="fixed inset-0 z-[60] md:hidden"
					>
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="absolute inset-0 bg-background/95 backdrop-blur-2xl"
							onClick={() => setMenuOpen(false)}
						/>

						{/* Content */}
						<div className="relative flex h-full flex-col px-6 pt-6">
							{/* Header */}
							<div className="flex items-center justify-between mb-12">
								<Link
									href="/"
									className="flex items-center gap-2.5"
									onClick={() => setMenuOpen(false)}
								>
									<div className="h-8 w-8 rounded-lg bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center">
										<span className="text-white font-black text-xs">S</span>
									</div>
									<span className="text-base font-bold tracking-tight">
										<span className="text-rose-400">Sar</span>
										<span className="text-foreground">Labs</span>
									</span>
								</Link>
								<button
									type="button"
									onClick={() => setMenuOpen(false)}
									className="p-2 text-muted-foreground hover:text-foreground"
								>
									<svg
										className="w-6 h-6"
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
								</button>
							</div>

							{/* Links */}
							<nav className="flex flex-col gap-2">
								{[
									{ href: "/", label: "Home" },
									...categories.map((cat) => ({
										href: `/category/${cat.id}`,
										label: cat.name,
									})),
								].map((link, i) => (
									<motion.div
										key={link.href}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: i * 0.06, duration: 0.3 }}
									>
										<Link
											href={link.href}
											onClick={() => setMenuOpen(false)}
											className="block py-4 text-3xl font-bold text-foreground/80 hover:text-foreground transition-colors border-b border-border/50"
										>
											{link.label}
										</Link>
									</motion.div>
								))}
							</nav>

							{/* Bottom section */}
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.3 }}
								className="mt-auto pb-12"
							>
								<div className="mb-6">
									<UserMenu />
								</div>
								<p className="text-xs text-muted-foreground">
									&copy; {new Date().getFullYear()} SarLabs. All rights
									reserved.
								</p>
							</motion.div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
