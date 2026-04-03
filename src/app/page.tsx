import { getCategories } from "@/lib/stripe";
import { PackageCard } from "@/components/package-card";
import dynamic from "next/dynamic";
import Link from "next/link";

const Hero = dynamic(() =>
	import("@/components/hero").then((m) => m.Hero),
);
const DealsCarousel = dynamic(() =>
	import("@/components/deals-carousel").then((m) => m.DealsCarousel),
);
const Testimonials = dynamic(() =>
	import("@/components/testimonials").then((m) => m.Testimonials),
);

export default async function Home() {
	let categories;
	try {
		categories = await getCategories();
	} catch {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-foreground">
						Store Unavailable
					</h1>
					<p className="mt-2 text-muted-foreground">
						Unable to load store data. Please try again later.
					</p>
				</div>
			</div>
		);
	}

	const salePackages = categories
		.flatMap((c) => c.packages ?? [])
		.filter((p) => p.base_price > p.total_price);

	return (
		<div className="flex flex-col">
			{/* Hero */}
			<Hero firstCategoryId={categories[0]?.id} />

			{/* Store section */}
			<section
				id="store"
				className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
			>
				{/* Deals Carousel */}
				{salePackages.length > 0 && (
					<div className="mb-20">
						<div className="flex items-center gap-3 mb-8">
							<div className="h-8 w-1 rounded-full bg-gradient-to-b from-rose-400 to-rose-600" />
							<h2 className="text-2xl font-black text-foreground">
								Deals of the Week
							</h2>
							<span className="ml-2 rounded-full bg-rose-500/10 border border-rose-500/15 px-3 py-0.5 text-[11px] font-bold text-rose-400 uppercase tracking-wider">
								Save
							</span>
						</div>
						<DealsCarousel packages={salePackages} />
					</div>
				)}

				{/* Categories */}
				{categories.map((category) => (
					<div key={category.id} className="mb-20 last:mb-0">
						<div className="flex items-center justify-between mb-8">
							<div className="flex items-center gap-3">
								<div className="h-8 w-1 rounded-full bg-gradient-to-b from-rose-500 to-violet-500" />
								<h2 className="text-2xl font-black text-foreground">
									{category.name}
								</h2>
							</div>
							<Link
								href={`/category/${category.id}`}
								className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors group flex items-center gap-1.5"
							>
								View All
								<svg
									className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</Link>
						</div>
						{category.description && (
							<p className="mb-6 text-sm text-muted-foreground max-w-2xl">
								{category.description}
							</p>
						)}
						{category.packages && category.packages.length > 0 ? (
							<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
								{category.packages.slice(0, 5).map((pkg, i) => (
									<PackageCard key={pkg.id} pkg={pkg} index={i} />
								))}
							</div>
						) : (
							<div className="rounded-2xl border border-border bg-card/30 p-8 text-center">
								<p className="text-sm text-muted-foreground">
									No packages available yet.
								</p>
							</div>
						)}
					</div>
				))}

				{categories.length === 0 && (
					<div className="flex min-h-[40vh] items-center justify-center">
						<div className="text-center">
							<div className="mx-auto h-16 w-16 rounded-2xl bg-card flex items-center justify-center mb-4 border border-border">
								<svg
									className="w-8 h-8 text-muted-foreground"
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
							<h2 className="text-lg font-bold text-foreground">
								Store Coming Soon
							</h2>
							<p className="mt-2 text-sm text-muted-foreground">
								Packages are being set up. Check back soon!
							</p>
						</div>
					</div>
				)}
			</section>

			{/* Testimonials */}
			<Testimonials />

			{/* CTA */}
			<section className="relative py-24 overflow-hidden">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(225,29,72,0.08),transparent_70%)]" />
				<div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
					<h2 className="text-3xl sm:text-4xl font-black text-foreground mb-4">
						Ready to dominate?
					</h2>
					<p className="text-muted-foreground mb-8 max-w-md mx-auto">
						Create an account to earn points on every purchase and unlock
						exclusive rewards.
					</p>
					<Link
						href="/signin"
						className="inline-flex rounded-xl bg-rose-500 px-8 py-3.5 text-sm font-semibold text-white hover:bg-rose-400 transition-colors shadow-lg shadow-rose-500/20"
					>
						Get Started Free
					</Link>
				</div>
			</section>
		</div>
	);
}
