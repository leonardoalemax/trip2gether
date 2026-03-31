import { useMemo } from "react";
import { ReservationMoment } from "../types/ReservationMoment";
import { TicketMoment } from "../types/TicketMoment";
import { addDays, parseDateOnly } from "../utils/dateUtils";

export function useCalendarWeeks(
	ticketMoments: TicketMoment[],
	reservationMoments: ReservationMoment[],
) {
	const defaultWeek = { startDate: null, endDate: null };

	const { startDate, endDate } = useMemo(() => {
		const allDates = [
			...ticketMoments.map((moment) => moment.iso),
			...reservationMoments.map((moment) => moment.iso),
		];
		if (allDates.length > 0) {
			const sorted = [...allDates].sort();
			const length = sorted.length || 0;

			if (typeof sorted === "undefined" || length === 0)
				return defaultWeek;

			const first = sorted[0];

			if (typeof first === "undefined") return defaultWeek;

			const last = sorted[length - 1];

			if (typeof last === "undefined") return defaultWeek;

			const oldest = parseDateOnly(first);
			const newest = parseDateOnly(last);

			if (oldest && newest) {
				return { startDate: oldest, endDate: newest };
			} else {
				return defaultWeek;
			}
		}

		return defaultWeek;
	}, [ticketMoments, reservationMoments]);

	const weeks = useMemo(() => {
		const days: Date[] = [];
		if (!startDate || !endDate) return [];

		let d = new Date(startDate);
		while (d <= endDate) {
			days.push(new Date(d));
			d = addDays(d, 1);
		}

		const missingDays = (7 - (days.length % 7)) % 7;
		const daysBefore = Math.ceil(missingDays / 2);
		const daysAfter = Math.floor(missingDays / 2);

		for (let i = daysBefore; i >= 1; i -= 1) {
			days.unshift(addDays(startDate, -i));
		}

		for (let i = 1; i <= daysAfter; i += 1) {
			days.push(addDays(endDate, i));
		}

		const groupedWeeks: Date[][] = [];
		for (let i = 0; i < days.length; i += 7) {
			groupedWeeks.push(days.slice(i, i + 7));
		}
		return groupedWeeks;
	}, [startDate, endDate]);

	return { weeks };
}
