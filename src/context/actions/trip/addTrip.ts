import type { User } from "firebase/auth";
import { createTrip } from "../../../services/tripServices";
import type { Trip } from "../../../types";
import { setDefaultTripId } from "../../../utils/tripCookie";

interface AddTripActionParams {
	user: User | null | undefined;
	name: string;
	country: string;
	defaultTimezone: string | undefined;
	refreshTrips: () => Promise<void>;
	setActiveTrip: (trip: Trip) => void;
}

export async function addTripAction({
	user,
	name,
	country,
	defaultTimezone,
	refreshTrips,
	setActiveTrip,
}: AddTripActionParams): Promise<Trip> {
	if (!user?.uid || !user.email) throw new Error("Não autenticado");

	const trip = await createTrip({
		name,
		country,
		...(defaultTimezone ? { defaultTimezone } : {}),
		ownerId: user.uid,
		ownerEmail: user.email,
		whitelistedEmails: [user.email],
	});

	await refreshTrips();
	setActiveTrip(trip);
	setDefaultTripId(trip.id);
	return trip;
}
