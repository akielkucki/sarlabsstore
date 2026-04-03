import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { SessionProvider } from "@/components/session-provider";
import { NavWrapper } from "@/components/nav-wrapper";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
	variable: "--font-jetbrains-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "SarLabs Store | Premium Minecraft Server",
	description:
		"Browse and purchase premium packages for the SarLabs Minecraft server.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={cn("h-full", "antialiased", inter.variable, jetbrainsMono.variable, "font-sans", geist.variable)}
		>
			<body className="min-h-full flex flex-col bg-background text-foreground">
				<SessionProvider>
				<CartProvider>
					<NavWrapper />
					<main className="flex-1 pt-16">{children}</main>
					<footer className="border-t border-card-border bg-background/80">
						<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
							<div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
								<div className="flex items-center gap-2">
									<span className="text-sm font-semibold">
										<span className="text-accent">Sar</span>
										<span className="text-white">Labs</span>
									</span>
								</div>
								<p className="text-xs text-muted">
									Powered by Stripe. All purchases are final.
								</p>
							</div>
						</div>
					</footer>
				</CartProvider>
				</SessionProvider>
			</body>
		</html>
	);
}
