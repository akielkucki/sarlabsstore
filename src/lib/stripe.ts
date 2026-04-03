import Stripe from "stripe";

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

async function fetchAllProducts(): Promise<StorePackage[]> {
	const products: StorePackage[] = [];

	const productList = await stripe.products.list({
		active: true,
		limit: 100,
		expand: ["data.default_price"],
	});

	for (const product of productList.data) {
		const price = product.default_price as Stripe.Price | null;
		if (!price || !price.unit_amount) continue;
		products.push(mapProduct(product, price));
	}

	return products;
}

export async function getCategories(): Promise<StoreCategory[]> {
	const products = await fetchAllProducts();

	const categoryMap = new Map<string, StoreCategory>();

	for (const pkg of products) {
		const catId = pkg.category.id;
		const product = await stripe.products.retrieve(pkg.id);
		const metadataCategory = product.metadata["category"] || "Unknown";
		console.log(product.metadata);
		if (!categoryMap.has(catId)) {
			categoryMap.set(catId, {
				id: catId,
				name: pkg.category.name,
				description: "",
				packages: [],
				order: 0,
			});
		}
		categoryMap.get(catId)!.packages.push(pkg);
	}

	// Set order from first product's metadata in each category
	for (const pkg of products) {
		const cat = categoryMap.get(pkg.category.id);
		if (cat && cat.order === 0) {
			// Look up the raw product to get category_order
			const rawProduct = (
				await stripe.products.list({
					ids: [pkg.id],
					limit: 1,
				})
			).data[0];
			if (rawProduct?.metadata.category_order) {
				cat.order = Number(rawProduct.metadata.category_order);
			}
		}
	}

	return Array.from(categoryMap.values()).sort((a, b) => a.order - b.order);
}

export async function getCategory(
	slug: string,
): Promise<StoreCategory | null> {
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
