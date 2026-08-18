import { useEffect, useMemo, useState } from "react";
import { Passeio, Reservation, Ticket } from "../../../types";
import { TIMEZONE_OPTIONS } from "../../tickets/timezoneOptions";

export function useCalendarTimezone(
	tickets: Ticket[],
	reservations: Reservation[],
	passeios: Passeio[],
	defaultTimezone?: string,
) {
	const availableTimezones = useMemo(() => {
		const set = new Set<string>();
		for (const ticket of tickets) {
			if (ticket.departureTimezone) set.add(ticket.departureTimezone);
			if (ticket.arrivalTimezone) set.add(ticket.arrivalTimezone);
		}
		for (const reservation of reservations) {
			if (reservation.timezone) set.add(reservation.timezone);
		}
		for (const passeio of passeios) {
			if (passeio.timezone) set.add(passeio.timezone);
		}
		return TIMEZONE_OPTIONS.filter((tz) => set.has(tz.value));
	}, [tickets, reservations, passeios]);

	const [selectedTimezone, setSelectedTimezone] = useState<string>("");

	useEffect(() => {
		if (availableTimezones.length === 0) {
			setSelectedTimezone("");
			return;
		}

		setSelectedTimezone((prev) => {
			if (prev && availableTimezones.some((tz) => tz.value === prev)) {
				return prev;
			}
			if (
				defaultTimezone &&
				availableTimezones.some((tz) => tz.value === defaultTimezone)
			) {
				return defaultTimezone;
			}
			return availableTimezones?.[0]?.value || "";
		});
	}, [availableTimezones, defaultTimezone]);

	return { availableTimezones, selectedTimezone, setSelectedTimezone };
}
