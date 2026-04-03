"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

export interface CartItem {
	id: string;
	priceId: string;
	name: string;
	image: string | null;
	price: number;
	currency: string;
	quantity: number;
}

interface CartContextType {
	items: CartItem[];
	itemCount: number;
	total: number;
	currency: string;
	loading: boolean;
	addToCart: (item: Omit<CartItem, "quantity">) => void;
	removeFromCart: (packageId: string) => void;
	updateQuantity: (packageId: string, quantity: number) => void;
	clearCart: () => void;
}

const CartContext = createContext<CartContextType>({
	items: [],
	itemCount: 0,
	total: 0,
	currency: "USD",
	loading: false,
	addToCart: () => {},
	removeFromCart: () => {},
	updateQuantity: () => {},
	clearCart: () => {},
});

export function useCart() {
	return useContext(CartContext);
}

const STORAGE_KEY = "sarlabs_cart";

function loadCart(): CartItem[] {
	if (typeof window === "undefined") return [];
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		return stored ? JSON.parse(stored) : [];
	} catch {
		return [];
	}
}

function saveCart(items: CartItem[]) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
	} catch {
		// Storage full or unavailable
	}
}

export function CartProvider({ children }: { children: React.ReactNode }) {
	const [items, setItems] = useState<CartItem[]>([]);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setItems(loadCart());
		setMounted(true);
	}, []);

	useEffect(() => {
		if (mounted) {
			saveCart(items);
		}
	}, [items, mounted]);

	const addToCart = useCallback((item: Omit<CartItem, "quantity">) => {
		setItems((prev) => {
			const existing = prev.find((i) => i.id === item.id);
			if (existing) {
				return prev.map((i) =>
					i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
				);
			}
			return [...prev, { ...item, quantity: 1 }];
		});
	}, []);

	const removeFromCart = useCallback((packageId: string) => {
		setItems((prev) => prev.filter((i) => i.id !== packageId));
	}, []);

	const updateQuantity = useCallback(
		(packageId: string, quantity: number) => {
			if (quantity <= 0) {
				removeFromCart(packageId);
				return;
			}
			setItems((prev) =>
				prev.map((i) => (i.id === packageId ? { ...i, quantity } : i)),
			);
		},
		[removeFromCart],
	);

	const clearCart = useCallback(() => {
		setItems([]);
		localStorage.removeItem(STORAGE_KEY);
	}, []);

	const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
	const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
	const currency = items[0]?.currency ?? "USD";

	return (
		<CartContext
			value={{
				items,
				itemCount,
				total,
				currency,
				loading: false,
				addToCart,
				removeFromCart,
				updateQuantity,
				clearCart,
			}}
		>
			{children}
		</CartContext>
	);
}
