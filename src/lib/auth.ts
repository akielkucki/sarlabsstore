import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Resend from "next-auth/providers/resend";
import { prisma } from "./db";

export const { handlers, auth, signIn, signOut } = NextAuth({
	adapter: PrismaAdapter(prisma),
	providers: [
		Resend({
			from: process.env.EMAIL_FROM ?? "SarLabs <noreply@resend.dev>",
		}),
	],
	pages: {
		signIn: "/signin",
		verifyRequest: "/verify",
	},
	session: {
		strategy: "database",
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	callbacks: {
		session({ session, user }) {
			session.user.id = user.id;
			session.user.points = (user as { points?: number }).points ?? 0;
			return session;
		},
	},
});
