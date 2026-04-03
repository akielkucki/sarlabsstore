import { NextRequest } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Poll Stripe up to 5 times for async payment methods (Cash App, etc.)
async function waitForPaid(sessionId: string, maxAttempts = 5): Promise<Stripe.Checkout.Session> {
	for (let i = 0; i < maxAttempts; i++) {
		const cs = await stripe.checkout.sessions.retrieve(sessionId, {
			expand: ["line_items"],
		});
		if (cs.payment_status === "paid") return cs;
		if (i < maxAttempts - 1) {
			await new Promise((r) => setTimeout(r, 1500));
		}
	}
	// Return the last state even if not paid yet
	return stripe.checkout.sessions.retrieve(sessionId, {
		expand: ["line_items"],
	});
}

export async function POST(request: NextRequest) {
	try {
		const { sessionId } = await request.json();

		if (!sessionId || typeof sessionId !== "string") {
			return Response.json({ error: "Missing session ID" }, { status: 400 });
		}

		const checkoutSession = await waitForPaid(sessionId);

		// Build product info for Discord regardless of payment status
		const products = checkoutSession.line_items?.data.map((item) => ({
			name: item.description,
			amount_total: item.amount_total / 100,
			quantity: item.quantity,
			productId: item.price?.product as string,
		}));

		const username = checkoutSession.metadata?.minecraft_username;
		const amountInCents = checkoutSession.amount_total ?? 0;
		const estimatedPoints = Math.floor((amountInCents / 100) * 10);

		// If payment still isn't confirmed, return estimated points so the UI can show them
		if (checkoutSession.payment_status !== "paid") {
			return Response.json({
				points: 0,
				awarded: 0,
				estimatedPoints,
				pending: true,
			});
		}

		const userId = checkoutSession.metadata?.user_id;
		const paymentIntent = checkoutSession.payment_intent as string;

		if (!userId || !paymentIntent) {
			return Response.json({ points: 0, awarded: 0, estimatedPoints });
		}

		// Atomic award + idempotency
		try {
			const points = estimatedPoints;
			if (points <= 0) return Response.json({ points: 0, awarded: 0 });

			const [updated] = await prisma.$transaction([
				prisma.user.update({
					where: { id: userId },
					data: { points: { increment: points } },
				}),
				prisma.pointsAward.create({
					data: { userId, paymentIntent, points },
				}),
				prisma.transactions.create({
					data: {
						id: checkoutSession.id,
						date: new Date().toISOString(),
						delivered: 1,
					},
				}),
			]);

			// Discord webhook
			const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
			if (discordWebhookUrl) {
				try {
					const productSummary =
						products?.map((p) => `${p.quantity}x ${p.name}`).join(", ") ??
						"an item";
					let imageUrl: string | null = null;
					if (products?.[0]?.productId) {
						try {
							const product = await stripe.products.retrieve(
								products[0].productId,
							);
							imageUrl = product.images?.[0] ?? null;
						} catch {}
					}

					await fetch(discordWebhookUrl, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							embeds: [
								{
									title: "Store Purchase Secured",
									description: `${username ?? "A player"} just purchased ${productSummary} and was awarded **${points} points**!`,
									color: 5763719,
									footer: { text: "SarLabs official store" },
									...(imageUrl ? { image: { url: imageUrl } } : {}),
									timestamp: new Date().toISOString(),
								},
							],
						}),
					});
				} catch (discordError) {
					console.error(
						"Failed to post to Discord webhook:",
						discordError,
					);
				}
			}

			return Response.json({ points: updated.points, awarded: points });
		} catch (dbError: unknown) {
			// P2002 = unique constraint violation (already awarded)
			if (
				dbError &&
				typeof dbError === "object" &&
				"code" in dbError &&
				dbError.code === "P2002"
			) {
				const user = await prisma.user.findUnique({
					where: { id: userId },
				});
				return Response.json({
					points: user?.points ?? 0,
					alreadyAwarded: true,
				});
			}
			throw dbError;
		}
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unknown error";
		console.error("Points award error:", error);
		return Response.json({ error: message }, { status: 500 });
	}
}
