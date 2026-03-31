import { useEffect, useState } from "react";
import { Reservation } from "../types";
import { getReservations } from "../services/reservationService";

interface UseReservationsParams {
	tripId: string | null | undefined;
	enabled?: boolean;
}

export function useReservations({
	tripId,
	enabled = true,
}: UseReservationsParams) {
	const [reservations, setReservations] = useState<Reservation[]>([]);
	const [reservationsLoading, setReservationsLoading] = useState(true);

	useEffect(() => {
		let mounted = true;

		const loadReservations = async () => {
			if (!enabled) return;

			setReservationsLoading(true);
			if (!tripId) {
				setReservations([]);
				setReservationsLoading(false);
				return;
			}

			try {
				const data = await getReservations(tripId);
				if (mounted) setReservations(data);
			} finally {
				if (mounted) setReservationsLoading(false);
			}
		};

		loadReservations();
		return () => {
			mounted = false;
		};
	}, [tripId, enabled]);

	return { reservations, reservationsLoading };
}
