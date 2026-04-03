import { getCategories } from "@/lib/stripe";
import { PackageCard } from "@/components/package-card";
import { DealsCarousel } from "@/components/deals-carousel";
import Link from "next/link";

export default async function Home() {
	let categories;
	try {
		categories = await getCategories();
	} catch {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-white">Store Unavailable</h1>
					<p className="mt-2 text-muted">
						Unable to load store data. Please try again later.
					</p>
				</div>
			</div>
		);
	}

	// Collect all packages that have a discount for the deals carousel
	const salePackages = categories
		.flatMap((c) => c.packages ?? [])
		.filter((p) => p.base_price > p.total_price);

	return (
		<div className="flex flex-col">
			{/* Hero */}
			<section className="relative overflow-hidden bg-background">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(225,29,72,0.08),transparent_70%)]" />
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(167,139,250,0.05),transparent_50%)]" />
				<div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
					<div className="text-center">
						<div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-medium text-rose mb-6">
							<span className="h-1.5 w-1.5 rounded-full bg-rose animate-pulse" />
							Official Server Store
						</div>
						<h1 className="text-5xl font-black tracking-tight sm:text-7xl">
							<span className="text-white">Welcome to </span>
							<span className="bg-gradient-to-r from-rose-400 via-accent to-purple-400 bg-clip-text text-transparent animate-gradient text-glow-rose">
								SarLabs
							</span>
						</h1>
						<p className="mx-auto mt-6 max-w-xl text-lg text-foreground/60">
							Enhance your gameplay with premium ranks, kits, and exclusive
							items. Support the server and unlock powerful perks.
						</p>
						<div className="mt-8 flex items-center justify-center gap-4">
							{categories.length > 0 && (
								<Link
									href={`/category/${categories[0].id}`}
									className="rounded-lg bg-gradient-to-r from-accent to-rose px-6 py-3 text-sm font-semibold text-white hover:from-rose hover:to-accent transition-all shadow-lg shadow-accent/25 hover:shadow-accent/40"
								>
									Browse Store
								</Link>
							)}
						</div>
					</div>
				</div>
				<div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
			</section>

			<section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
				{/* Deals of the Week Carousel */}
				{salePackages.length > 0 && (
					<div className="mb-16">
						<div className="flex items-center gap-3 mb-6">
							<div className="h-8 w-1 rounded-full bg-gradient-to-b from-red-400 to-red-600" />
							<h2 className="text-2xl font-bold text-white">
								Deals of the Week
							</h2>
							<span className="ml-2 rounded-full bg-red-500/10 border border-red-500/20 px-3 py-0.5 text-xs font-semibold text-red-400">
								SAVE NOW
							</span>
						</div>
						<DealsCarousel packages={salePackages} />
					</div>
				)}

				{/* Categories with packages */}
				{categories.map((category) => (
					<div key={category.id} className="mb-16 last:mb-0">
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center gap-3">
								<div className="h-8 w-1 rounded-full bg-gradient-to-b from-accent to-rose" />
								<h2 className="text-2xl font-bold text-white">
									{category.name}
								</h2>
							</div>
							<Link
								href={`/category/${category.id}`}
								className="text-sm font-medium text-rose/70 hover:text-rose transition-colors"
							>
								View All &rarr;
							</Link>
						</div>
						{category.description && (
							<p className="mb-6 text-sm text-muted max-w-2xl">
								{category.description}
							</p>
						)}
						{category.packages && category.packages.length > 0 ? (
							<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
								{category.packages.slice(0, 5).map((pkg) => (
									<PackageCard key={pkg.id} pkg={pkg} />
								))}
							</div>
						) : (
							<div className="rounded-xl border border-card-border bg-zinc-900/50 p-8 text-center">
								<p className="text-sm text-muted">
									No packages available in this category yet.
								</p>
							</div>
						)}
					</div>
				))}

				{categories.length === 0 && (
					<div className="flex min-h-[40vh] items-center justify-center">
						<div className="text-center">
							<div className="mx-auto h-16 w-16 rounded-xl bg-zinc-900 flex items-center justify-center mb-4">
								<svg
									className="w-8 h-8 text-zinc-600"
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
							<h2 className="text-lg font-semibold text-white">
								Store Coming Soon
							</h2>
							<p className="mt-2 text-sm text-muted">
								Packages are being set up. Check back soon!
							</p>
						</div>
					</div>
				)}
			</section>
		</div>
	);
}
