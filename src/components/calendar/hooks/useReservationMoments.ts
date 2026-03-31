import { useMemo } from "react";
import { Reservation } from "../../../types";
import { ReservationMoment } from "../types/ReservationMoment";
import {
	formatInTimezone,
	parseLocalToUTC,
	parseTimezoneOffsetHours,
} from "../utils/timezoneUtils";
import { addDays, parseDateOnly } from "../utils/dateUtils";
import { getSlotFromHour, SLOTS } from "../utils/slotUtils";

const RESERVATION_CITY_COLORS = [
	"#bfdbfe",
	"#bbf7d0",
	"#fed7aa",
	"#ddd6fe",
	"#fecdd3",
	"#fef08a",
	"#a7f3d0",
	"#c7d2fe",
	"#fde68a",
	"#fbcfe8",
];

function normalizeCityName(city: string) {
	return city.trim().toLowerCase();
}

function colorFromCityName(city: string) {
	const normalized = normalizeCityName(city);
	let hash = 0;
	for (let i = 0; i < normalized.length; i += 1) {
		hash = (hash * 31 + normalized.charCodeAt(i)) >>> 0;
	}
	return RESERVATION_CITY_COLORS[hash % RESERVATION_CITY_COLORS.length];
}

export function useReservationMoments(
	reservations: Reservation[],
	selectedTimezone: string,
) {
	const reservationMoments = useMemo(() => {
		const targetOffsetHours = parseTimezoneOffsetHours(selectedTimezone);
		if (targetOffsetHours === null) return [] as ReservationMoment[];

		const moments: ReservationMoment[] = [];
		for (const reservation of reservations) {
			const hotelLabel = reservation.hotelName || "Hotel";

			const checkinUTC = parseLocalToUTC(
				reservation.checkInDate,
				reservation.checkInTime,
				reservation.timezone,
			);
			if (checkinUTC !== null) {
				const when = formatInTimezone(checkinUTC, targetOffsetHours);
				moments.push({
					id: `${reservation.id}-checkin`,
					iso: when.iso,
					time: when.time,
					slot: getSlotFromHour(when.hour),
					label: ` | ${hotelLabel}`,
					kind: "checkin",
					city: reservation.city,
				});
			}

			const checkoutUTC = parseLocalToUTC(
				reservation.checkOutDate,
				reservation.checkOutTime,
				reservation.timezone,
			);
			if (checkoutUTC !== null) {
				const when = formatInTimezone(checkoutUTC, targetOffsetHours);
				moments.push({
					id: `${reservation.id}-checkout`,
					iso: when.iso,
					time: when.time,
					slot: getSlotFromHour(when.hour),
					label: ` | ${hotelLabel}`,
					kind: "checkout",
					city: reservation.city,
				});
			}
		}

		return moments.sort((a, b) => {
			if (a.iso !== b.iso) return a.iso.localeCompare(b.iso);
			return a.time.localeCompare(b.time);
		});
	}, [reservations, selectedTimezone]);

	const reservationMomentsBySlot = useMemo(() => {
		const map = new Map<string, ReservationMoment[]>();
		for (const moment of reservationMoments) {
			const key = `${moment.iso}|${moment.slot}`;
			const list = map.get(key) ?? [];
			list.push(moment);
			map.set(key, list);
		}
		return map;
	}, [reservationMoments]);

	const reservationCityByDate = useMemo(() => {
		const cityByDate = new Map<string, string>();
		const colorByDateSlot = new Map<string, string>();
		const colorByCity = new Map<string, string>();
		const targetOffsetHours = parseTimezoneOffsetHours(selectedTimezone);
		if (targetOffsetHours === null) {
			return {
				reservationCityByDate: cityByDate,
				reservationColorByDateSlot: colorByDateSlot,
				reservationColorByCity: colorByCity,
			};
		}

		for (const reservation of reservations) {
			const normalizedCity = normalizeCityName(reservation.city);
			const reservationColor: string =
				reservation.color ?? colorFromCityName(reservation.city);
			if (normalizedCity && !colorByCity.has(normalizedCity)) {
				colorByCity.set(normalizedCity, reservationColor);
			}

			const checkinUTC = parseLocalToUTC(
				reservation.checkInDate,
				reservation.checkInTime,
				reservation.timezone,
			);
			const checkoutUTC = parseLocalToUTC(
				reservation.checkOutDate,
				reservation.checkOutTime,
				reservation.timezone,
			);

			if (checkinUTC === null || checkoutUTC === null) continue;

			const checkinDate = parseDateOnly(
				formatInTimezone(checkinUTC, targetOffsetHours).iso,
			);
			const checkoutDate = parseDateOnly(
				formatInTimezone(checkoutUTC, targetOffsetHours).iso,
			);
			if (!checkinDate || !checkoutDate) continue;

			const checkinWhen = formatInTimezone(checkinUTC, targetOffsetHours);
			const checkoutWhen = formatInTimezone(
				checkoutUTC,
				targetOffsetHours,
			);
			if (checkoutDate < checkinDate) continue;

			const checkinSlotIndex = SLOTS.indexOf(
				getSlotFromHour(checkinWhen.hour),
			);
			const checkoutSlotIndex = SLOTS.indexOf(
				getSlotFromHour(checkoutWhen.hour),
			);

			let cursor = new Date(checkinDate);
			while (cursor <= checkoutDate) {
				const iso = cursor.toISOString().slice(0, 10);
				cityByDate.set(iso, reservation.city);
				const cityColor: string =
					colorByCity.get(normalizedCity) ?? reservationColor;

				let startIndex = 0;
				let endIndex = SLOTS.length - 1;

				if (iso === checkinWhen.iso) {
					startIndex = checkinSlotIndex;
				}
				if (iso === checkoutWhen.iso) {
					endIndex = checkoutSlotIndex;
				}

				for (let idx = startIndex; idx <= endIndex; idx += 1) {
					const slot = SLOTS[idx];
					if (!slot) continue;
					colorByDateSlot.set(`${iso}|${slot}`, cityColor);
				}
				cursor = addDays(cursor, 1);
			}
		}

		return {
			reservationCityByDate: cityByDate,
			reservationColorByDateSlot: colorByDateSlot,
			reservationColorByCity: colorByCity,
		};
	}, [reservations, selectedTimezone]);

	return {
		reservationMoments,
		reservationMomentsBySlot,
		reservationCityByDate: reservationCityByDate.reservationCityByDate,
		reservationColorByDateSlot:
			reservationCityByDate.reservationColorByDateSlot,
		reservationColorByCity: reservationCityByDate.reservationColorByCity,
	};
}
