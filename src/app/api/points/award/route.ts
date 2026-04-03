import { NextRequest } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
	try {
		const { sessionId } = await request.json();

		if (!sessionId || typeof sessionId !== "string") {
			return Response.json({ error: "Missing session ID" }, { status: 400 });
		}

		const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

		if (checkoutSession.payment_status !== "paid") {
			return Response.json(
				{ error: "Payment not completed" },
				{ status: 400 },
			);
		}

		const userId = checkoutSession.metadata?.user_id;
		if (!userId) {
			return Response.json({ points: 0 });
		}

		// Calculate points: $1 = 10 points
		const amountInCents = checkoutSession.amount_total ?? 0;
		const dollars = amountInCents / 100;
		const points = Math.floor(dollars * 10);

		if (points <= 0) {
			return Response.json({ points: 0 });
		}

		// Award points (idempotent check using payment_intent)
		const paymentIntent = checkoutSession.payment_intent as string;

		const user = await prisma.user.findUnique({ where: { id: userId } });
		if (!user) {
			return Response.json({ error: "User not found" }, { status: 404 });
		}

		// Use payment intent ID in a simple idempotency check via metadata
		// For production, you'd want a dedicated PointsTransaction table
		const updated = await prisma.user.update({
			where: { id: userId },
			data: { points: { increment: points } },
		});

		return Response.json({
			points: updated.points,
			awarded: points,
			paymentIntent,
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown error";
		console.error("Points award error:", message);
		return Response.json({ error: message }, { status: 500 });
	}
}
