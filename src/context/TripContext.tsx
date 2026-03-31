import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { getUserTrips } from "../services/tripServices";
import { Trip } from "../types";
import { getDefaultTripId, setDefaultTripId } from "../utils/tripCookie";
import { addTripAction } from "./actions/trip/addTrip";
import { editTripAction } from "./actions/trip/editTrip";
import { removeTripAction } from "./actions/trip/removeTrip";

interface TripContextValue {
	trips: Trip[];
	activeTrip: Trip | null;
	loading: boolean;
	selectTrip: (trip: Trip) => void;
	refreshTrips: () => Promise<void>;
	addTrip: (
		name: string,
		country: string,
		defaultTimezone?: string,
	) => Promise<Trip>;
	editTrip: (
		tripId: string,
		data: Partial<Omit<Trip, "id">>,
	) => Promise<void>;
	removeTrip: (tripId: string) => Promise<void>;
}

const TripContext = createContext<TripContextValue | null>(null);

export function TripProvider({ children }: { children: React.ReactNode }) {
	const [user] = useAuthState(auth);
	const [trips, setTrips] = useState<Trip[]>([]);
	const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
	const [loading, setLoading] = useState(true);

	const refreshTrips = useCallback(async () => {
		if (!user?.email || !user.uid) {
			setTrips([]);
			setActiveTrip(null);
			setLoading(false);
			return;
		}

		setLoading(true);
		try {
			const allTrips = await getUserTrips(user.email, user.uid);

			setTrips(allTrips);
			setActiveTrip((prev) => {
				if (prev && allTrips.find((trip) => trip.id === prev.id)) {
					return prev;
				}

				const cookieId = getDefaultTripId();
				if (cookieId) {
					const cookieTrip = allTrips.find(
						(trip) => trip.id === cookieId,
					);
					if (cookieTrip) {
						return cookieTrip;
					}
				}

				return allTrips[0] ?? null;
			});
		} finally {
			setLoading(false);
		}
	}, [user]);

	useEffect(() => {
		refreshTrips();
	}, [refreshTrips]);

	const addTrip = async (
		name: string,
		country: string,
		defaultTimezone?: string,
	): Promise<Trip> => {
		return addTripAction({
			user,
			name,
			country,
			defaultTimezone,
			refreshTrips,
			setActiveTrip,
		});
	};

	const editTrip = async (
		tripId: string,
		data: Partial<Omit<Trip, "id">>,
	) => {
		await editTripAction({ tripId, data, refreshTrips });
	};

	const removeTrip = async (tripId: string) => {
		await removeTripAction({ tripId, refreshTrips });
	};

	return (
		<TripContext.Provider
			value={{
				trips,
				activeTrip,
				loading,
				selectTrip: (trip: Trip) => {
					setActiveTrip(trip);
					setDefaultTripId(trip.id);
				},
				refreshTrips,
				addTrip,
				editTrip,
				removeTrip,
			}}>
			{children}
		</TripContext.Provider>
	);
}

export function useTripContext() {
	const ctx = useContext(TripContext);
	if (!ctx) {
		throw new Error("useTripContext must be used within TripProvider");
	}
	return ctx;
}
