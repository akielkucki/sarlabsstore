"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface PointsContextType {
	points: number;
	updatePoints: (awarded: number) => void;
	awarded: number;
}

const PointsContext = createContext<PointsContextType>({
	points: 0,
	updatePoints: () => {},
	awarded: 0
});

export function usePoints() {
	return useContext(PointsContext);
}

export function PointsProvider({ children }: { children: React.ReactNode }) {
	const { data: session, status } = useSession();
	const [points, setPoints] = useState(0);
	const [awarded, setAwarded] = useState(0);

	useEffect(() => {
		if (status === "authenticated" && session?.user?.points != null) {
			setPoints(session.user.points);
		}
		if (status === "unauthenticated") {
			setPoints(0);
		}
	}, [session, status]);

	const updatePoints = useCallback((awarded: number) => {
		setPoints((prev) => prev + awarded);
		setAwarded(awarded);
	}, []);

	return (
		<PointsContext value={{ points, updatePoints, awarded }}>
			{children}
		</PointsContext>
	);
}
