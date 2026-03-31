import { deleteTrip } from "../../../services/tripServices";

interface RemoveTripActionParams {
	tripId: string;
	refreshTrips: () => Promise<void>;
}

export async function removeTripAction({
	tripId,
	refreshTrips,
}: RemoveTripActionParams): Promise<void> {
	await deleteTrip(tripId);
	await refreshTrips();
}
