import { getCategories } from "@/lib/stripe";
import { Navbar } from "./navbar";

export async function NavWrapper() {
	let categories: { id: string; name: string }[] = [];
	try {
		const cats = await getCategories();
		categories = cats.map((c) => ({ id: c.id, name: c.name }));
	} catch {
		// If API fails, show nav without categories
	}

	return <Navbar categories={categories} />;
}
