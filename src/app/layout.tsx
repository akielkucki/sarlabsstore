import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { SessionProvider } from "@/components/session-provider";
import { PointsProvider } from "@/components/points-provider";
import { NavWrapper } from "@/components/nav-wrapper";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

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
			className={cn(
				"h-full antialiased",
				geist.variable,
				jetbrainsMono.variable,
				"font-sans",
			)}
		>
			<body className="min-h-full flex flex-col bg-background text-foreground">
				<SessionProvider>
					<PointsProvider>
					<CartProvider>
						<NavWrapper />
						<main className="flex-1">{children}</main>
						<footer className="relative border-t border-border">
							<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
								<div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
									<div className="flex items-center gap-3">
										<div className="h-8 w-8 rounded-lg bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center">
											<span className="text-white font-black text-xs">S</span>
										</div>
										<span className="text-sm font-semibold tracking-tight">
											<span className="text-rose-400">Sar</span>
											<span className="text-foreground">Labs</span>
										</span>
									</div>
									<div className="flex items-center gap-6 text-xs text-muted-foreground">
										<span>Powered by Stripe</span>
										<span className="h-3 w-px bg-border" />
										<span>&copy; {new Date().getFullYear()} SarLabs</span>
									</div>
								</div>
							</div>
						</footer>
					</CartProvider>
					</PointsProvider>
				</SessionProvider>
			</body>
		</html>
	);
}
