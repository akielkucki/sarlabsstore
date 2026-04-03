import Stripe from "stripe";
import { unstable_cache } from "next/cache";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export interface StorePackage {
	id: string;
	name: string;
	description: string;
	image: string | null;
	category: { id: string; name: string };
	base_price: number;
	total_price: number;
	currency: string;
	priceId: string;
}

export interface StoreCategory {
	id: string;
	name: string;
	description: string;
	packages: StorePackage[];
	order: number;
}

function slugify(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}

function mapProduct(
	product: Stripe.Product,
	price: Stripe.Price,
): StorePackage {
	const categoryName = product.metadata.category || "Uncategorized";
	const unitAmount = price.unit_amount ?? 0;
	const totalPrice = unitAmount / 100;
	const basePrice = product.metadata.base_price
		? Number(product.metadata.base_price) / 100
		: totalPrice;

	return {
		id: product.id,
		name: product.name,
		description: product.description || "",
		image: product.images?.[0] ?? null,
		category: {
			id: slugify(categoryName),
			name: categoryName,
		},
		base_price: basePrice,
		total_price: totalPrice,
		currency: price.currency.toUpperCase(),
		priceId: price.id,
	};
}

async function getCategoriesUncached(): Promise<StoreCategory[]> {
	const categoryMap = new Map<string, StoreCategory>();

	// Single API call - products already include metadata and default_price
	const productList = await stripe.products.list({
		active: true,
		limit: 100,
		expand: ["data.default_price"],
	});

	for (const product of productList.data) {
		const price = product.default_price as Stripe.Price | null;
		if (!price || !price.unit_amount) continue;

		const pkg = mapProduct(product, price);
		const catId = pkg.category.id;

		if (!categoryMap.has(catId)) {
			categoryMap.set(catId, {
				id: catId,
				name: pkg.category.name,
				description: "",
				packages: [],
				order: product.metadata.category_order
					? Number(product.metadata.category_order)
					: 0,
			});
		}
		categoryMap.get(catId)!.packages.push(pkg);
	}

	return Array.from(categoryMap.values()).sort((a, b) => a.order - b.order);
}

export const getCategories = unstable_cache(
	getCategoriesUncached,
	["store-categories"],
	{ revalidate: 60 },
);

export async function getCategory(
	slug: string,
): Promise<StoreCategory | null> {
	// This uses the cached getCategories, so no extra API calls
	const categories = await getCategories();
	return categories.find((c) => c.id === slug) ?? null;
}

export async function getPackage(id: string): Promise<StorePackage | null> {
	try {
		const product = await stripe.products.retrieve(id, {
			expand: ["default_price"],
		});
		if (!product.active) return null;

		const price = product.default_price as Stripe.Price | null;
		if (!price || !price.unit_amount) return null;

		return mapProduct(product, price);
	} catch {
		return null;
	}
}
