import { useMemo } from "react";
import { Ticket } from "../../../types";
import { TicketMoment } from "../types/TicketMoment";
import {
	parseTimezoneOffsetHours,
	parseLocalToUTC,
	formatInTimezone,
} from "../utils/timezoneUtils";
import { getSlotFromHour } from "../utils/slotUtils";

export function useTicketMoments(tickets: Ticket[], selectedTimezone: string) {
	const ticketMoments = useMemo(() => {
		const targetOffsetHours = parseTimezoneOffsetHours(selectedTimezone);
		if (targetOffsetHours === null) return [] as TicketMoment[];

		const moments: TicketMoment[] = [];
		for (const ticket of tickets) {
			const departureLabel = ticket.departureAirport || "Origem";
			const arrivalLabel = ticket.arrivalAirport || "Destino";

			const departureUTC = parseLocalToUTC(
				ticket.departureDate,
				ticket.departureTime,
				ticket.departureTimezone,
			);
			if (departureUTC !== null) {
				const when = formatInTimezone(departureUTC, targetOffsetHours);
				moments.push({
					id: `${ticket.id}-dep`,
					iso: when.iso,
					time: when.time,
					slot: getSlotFromHour(when.hour),
					label: ` | ${departureLabel}`,
					kind: "departure",
				});
			}

			const arrivalUTC = parseLocalToUTC(
				ticket.arrivalDate,
				ticket.arrivalTime,
				ticket.arrivalTimezone,
			);
			if (arrivalUTC !== null) {
				const when = formatInTimezone(arrivalUTC, targetOffsetHours);
				moments.push({
					id: `${ticket.id}-arr`,
					iso: when.iso,
					time: when.time,
					slot: getSlotFromHour(when.hour),
					label: ` | ${arrivalLabel}`,
					kind: "arrival",
				});
			}
		}

		return moments.sort((a, b) => {
			if (a.iso !== b.iso) return a.iso.localeCompare(b.iso);
			return a.time.localeCompare(b.time);
		});
	}, [tickets, selectedTimezone]);

	const ticketMomentsBySlot = useMemo(() => {
		const map = new Map<string, TicketMoment[]>();
		for (const moment of ticketMoments) {
			const key = `${moment.iso}|${moment.slot}`;
			const list = map.get(key) ?? [];
			list.push(moment);
			map.set(key, list);
		}
		return map;
	}, [ticketMoments]);

	return { ticketMoments, ticketMomentsBySlot };
}
