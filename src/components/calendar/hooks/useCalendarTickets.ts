import { useEffect, useState } from "react";
import { Ticket, Trip } from "../../../types";
import { getTickets } from "../../../services/ticketService";

interface UseCalendarTicketsParams {
	activeTrip: Trip | null;
	activeTripLoading: boolean;
}

export function useCalendarTickets({
	activeTrip,
	activeTripLoading,
}: UseCalendarTicketsParams) {
	const [tickets, setTickets] = useState<Ticket[]>([]);
	const [ticketsLoading, setTicketsLoading] = useState(true);

	useEffect(() => {
		let mounted = true;
		const loadTickets = async () => {
			if (activeTripLoading) return;

			setTicketsLoading(true);
			if (!activeTrip) {
				setTickets([]);
				setTicketsLoading(false);
				return;
			}

			try {
				const data = await getTickets(activeTrip.id);
				if (mounted) setTickets(data);
			} finally {
				if (mounted) setTicketsLoading(false);
			}
		};

		loadTickets();
		return () => {
			mounted = false;
		};
	}, [activeTrip, activeTripLoading]);

	return { tickets, ticketsLoading };
}
