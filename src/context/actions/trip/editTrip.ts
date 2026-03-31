import { updateTrip } from "../../../services/tripServices";
import type { Trip } from "../../../types";

interface EditTripActionParams {
	tripId: string;
	data: Partial<Omit<Trip, "id">>;
	refreshTrips: () => Promise<void>;
}

export async function editTripAction({
	tripId,
	data,
	refreshTrips,
}: EditTripActionParams): Promise<void> {
	await updateTrip(tripId, data);
	await refreshTrips();
}
