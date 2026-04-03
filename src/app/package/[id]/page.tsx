import { getPackage } from "@/lib/stripe";
import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "./add-to-cart-button";

export default async function PackagePage(
	props: PageProps<"/package/[id]">,
) {
	const { id } = await props.params;

	const pkg = await getPackage(id);

	if (!pkg) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-white">Package Not Found</h1>
					<p className="mt-2 text-muted">
						This package doesn&apos;t exist or couldn&apos;t be loaded.
					</p>
					<Link
						href="/"
						className="mt-4 inline-block text-sm font-medium text-accent hover:text-rose"
					>
						&larr; Back to Store
					</Link>
				</div>
			</div>
		);
	}

	const hasDiscount =
		pkg.base_price !== pkg.total_price && pkg.base_price > pkg.total_price;
	const currencySymbol =
		pkg.currency === "USD"
			? "$"
			: pkg.currency === "EUR"
				? "\u20ac"
				: pkg.currency === "GBP"
					? "\u00a3"
					: `${pkg.currency} `;

	return (
		<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
			{/* Breadcrumb */}
			<div className="flex items-center gap-2 text-sm text-muted mb-8">
				<Link href="/" className="hover:text-foreground transition-colors">
					Store
				</Link>
				<span>/</span>
				{pkg.category && (
					<>
						<Link
							href={`/category/${pkg.category.id}`}
							className="hover:text-foreground transition-colors"
						>
							{pkg.category.name}
						</Link>
						<span>/</span>
					</>
				)}
				<span className="text-zinc-300 truncate max-w-[200px]">{pkg.name}</span>
			</div>

			<div className="grid gap-10 lg:grid-cols-2">
				{/* Image */}
				<div className="relative aspect-square overflow-hidden rounded-2xl border border-card-border bg-zinc-900">
					{pkg.image ? (
						<Image
							src={pkg.image}
							alt={pkg.name}
							fill
							className="object-cover"
							priority
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
							<div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-accent/20 to-rose/20 flex items-center justify-center">
								<svg
									className="w-12 h-12 text-accent/50"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
									/>
								</svg>
							</div>
						</div>
					)}
					{hasDiscount && (
						<div className="absolute top-4 right-4 rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white shadow-lg">
							SALE
						</div>
					)}
				</div>

				{/* Details */}
				<div className="flex flex-col">
					<h1 className="text-3xl font-bold text-white">{pkg.name}</h1>

					<div className="mt-4 flex items-baseline gap-3">
						<span className="text-4xl font-black text-accent">
							{currencySymbol}
							{pkg.total_price.toFixed(2)}
						</span>
						{hasDiscount && (
							<span className="text-lg text-muted line-through">
								{currencySymbol}
								{pkg.base_price.toFixed(2)}
							</span>
						)}
					</div>

					<div className="mt-6">
						<AddToCartButton
							packageId={pkg.id}
							priceId={pkg.priceId}
							name={pkg.name}
							image={pkg.image}
							price={pkg.total_price}
							currency={pkg.currency}
						/>
					</div>

					<div className="mt-8 h-px bg-gradient-to-r from-accent/20 to-transparent" />

					{/* Description */}
					{pkg.description && (
						<div className="mt-8">
							<h2 className="text-sm font-semibold uppercase tracking-wider text-accent/70 mb-4">
								Description
							</h2>
							<div className="prose prose-invert prose-sm prose-zinc max-w-none [&_img]:rounded-lg [&_a]:text-accent [&_a:hover]:text-rose [&_li]:text-zinc-300 [&_p]:text-zinc-300">
								{pkg.description}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
