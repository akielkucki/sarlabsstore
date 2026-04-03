import { NextRequest } from "next/server";
import Stripe from "stripe";
import { auth } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
	try {
		const { items, minecraftUsername } = await request.json();

		if (!items || !Array.isArray(items) || items.length === 0) {
			return Response.json({ error: "No items provided" }, { status: 400 });
		}

		if (
			!minecraftUsername ||
			typeof minecraftUsername !== "string" ||
			!/^[a-zA-Z0-9_]{3,16}$/.test(minecraftUsername)
		) {
			return Response.json(
				{ error: "Invalid Minecraft username" },
				{ status: 400 },
			);
		}

		const session = await auth();
		const origin = request.nextUrl.origin;

		// Build a comma-separated list of package (product) IDs for the webhook
		const packageIds = items.map((item: { id: string }) => item.id).join(",");

		const checkoutSession = await stripe.checkout.sessions.create({
			mode: "payment",
			metadata: {
				minecraft_username: minecraftUsername,
				package_id: packageIds,
				...(session?.user?.id ? { user_id: session.user.id } : {}),
			},
			...(session?.user?.email
				? { customer_email: session.user.email }
				: {}),
			line_items: items.map(
				(item: { priceId: string; quantity: number }) => ({
					price: item.priceId,
					quantity: item.quantity,
				}),
			),
			success_url: `${origin}/checkout/complete?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${origin}/checkout/cancel`,
		});

		return Response.json({ url: checkoutSession.url });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unknown error";
		console.error("Checkout API error:", message);
		return Response.json({ error: message }, { status: 500 });
	}
}
