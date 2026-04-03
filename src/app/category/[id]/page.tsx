import { getCategory } from "@/lib/stripe";
import { PackageCard } from "@/components/package-card";
import Link from "next/link";

export default async function CategoryPage(props: PageProps<"/category/[id]">) {
	const { id } = await props.params;
	const category = await getCategory(id);

	if (!category) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-foreground">
						Category Not Found
					</h1>
					<p className="mt-2 text-muted-foreground">
						This category doesn&apos;t exist or couldn&apos;t be loaded.
					</p>
					<Link
						href="/"
						className="mt-4 inline-block text-sm font-medium text-rose-400 hover:text-rose-300"
					>
						&larr; Back to Store
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
			<div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
				<Link
					href="/"
					className="hover:text-foreground transition-colors"
				>
					Store
				</Link>
				<span className="text-muted-foreground/40">/</span>
				<span className="text-foreground">{category.name}</span>
			</div>

			<div className="mb-10">
				<div className="flex items-center gap-3 mb-2">
					<div className="h-8 w-1 rounded-full bg-gradient-to-b from-rose-500 to-violet-500" />
					<h1 className="text-3xl font-black text-foreground">
						{category.name}
					</h1>
				</div>
				{category.description && (
					<p className="mt-3 text-muted-foreground max-w-2xl ml-4">
						{category.description}
					</p>
				)}
			</div>

			{category.packages && category.packages.length > 0 ? (
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
					{category.packages.map((pkg, i) => (
						<PackageCard key={pkg.id} pkg={pkg} index={i} />
					))}
				</div>
			) : (
				<div className="rounded-2xl border border-border bg-card/30 p-12 text-center">
					<p className="text-muted-foreground">
						No packages available in this category yet.
					</p>
				</div>
			)}
		</div>
	);
}
