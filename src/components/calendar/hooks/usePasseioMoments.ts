import { useMemo } from "react";
import { Passeio } from "../../../types";
import {
	PasseioBlockPosition,
	PasseioMoment,
} from "../types/PasseioMoment";
import {
	formatInTimezone,
	parseLocalToUTC,
	parseTimezoneOffsetHours,
} from "../utils/timezoneUtils";
import { addDays, parseDateOnly } from "../utils/dateUtils";
import { getSlotFromHour, SLOTS } from "../utils/slotUtils";

const PASSEIO_CITY_COLORS = [
	"#ddd6fe",
	"#c7d2fe",
	"#fbcfe8",
	"#fed7aa",
	"#a7f3d0",
	"#fde68a",
	"#bfdbfe",
	"#fecdd3",
	"#bbf7d0",
	"#fef08a",
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
	return PASSEIO_CITY_COLORS[hash % PASSEIO_CITY_COLORS.length];
}

function blockPosition(
	isFirst: boolean,
	isLast: boolean,
): PasseioBlockPosition {
	if (isFirst && isLast) return "single";
	if (isFirst) return "start";
	if (isLast) return "end";
	return "middle";
}

export function usePasseioMoments(
	passeios: Passeio[],
	selectedTimezone: string,
) {
	const passeioMoments = useMemo(() => {
		const targetOffsetHours = parseTimezoneOffsetHours(selectedTimezone);
		if (targetOffsetHours === null) return [] as PasseioMoment[];

		const moments: PasseioMoment[] = [];

		for (const passeio of passeios) {
			const label =
				passeio.title || passeio.address || passeio.city || "Passeio";

			const departureUTC = parseLocalToUTC(
				passeio.departureDate,
				passeio.departureTime,
				passeio.timezone,
			);
			const returnUTC = parseLocalToUTC(
				passeio.returnDate,
				passeio.returnTime,
				passeio.timezone,
			);
			if (departureUTC === null || returnUTC === null) continue;

			const departureWhen = formatInTimezone(
				departureUTC,
				targetOffsetHours,
			);
			const returnWhen = formatInTimezone(returnUTC, targetOffsetHours);

			const departureDate = parseDateOnly(departureWhen.iso);
			const returnDate = parseDateOnly(returnWhen.iso);
			if (!departureDate || !returnDate || returnDate < departureDate)
				continue;

			const departureSlotIndex = SLOTS.indexOf(
				getSlotFromHour(departureWhen.hour),
			);
			const returnSlotIndex = SLOTS.indexOf(
				getSlotFromHour(returnWhen.hour),
			);

			// Um item de bloco por slot coberto: e isso que faz o passeio ocupar
			// a faixa inteira no calendario em vez de so marcar ida e volta.
			let cursor = new Date(departureDate);
			while (cursor <= returnDate) {
				const iso = cursor.toISOString().slice(0, 10);
				const startIndex =
					iso === departureWhen.iso ? departureSlotIndex : 0;
				const endIndex =
					iso === returnWhen.iso ? returnSlotIndex : SLOTS.length - 1;

				for (let idx = startIndex; idx <= endIndex; idx += 1) {
					const slot = SLOTS[idx];
					if (!slot) continue;

					const isFirst =
						iso === departureWhen.iso && idx === departureSlotIndex;
					const isLast =
						iso === returnWhen.iso && idx === returnSlotIndex;
					const position = blockPosition(isFirst, isLast);

					let time = "";
					if (position === "single") {
						time = `${departureWhen.time}–${returnWhen.time}`;
					} else if (position === "start") {
						time = departureWhen.time;
					} else if (position === "end") {
						time = returnWhen.time;
					}

					moments.push({
						id: `${passeio.id}-bloco-${iso}-${slot}`,
						iso,
						time,
						slot,
						label,
						kind: "bloco",
						position,
						city: passeio.city,
					});
				}
				cursor = addDays(cursor, 1);
			}

			// Checkpoints nao guardam data propria — assume-se o dia da saida,
			// mesma premissa usada no itinerario.
			for (const checkpoint of passeio.checkpoints ?? []) {
				if (!checkpoint.entryTime) continue;

				const checkpointUTC = parseLocalToUTC(
					passeio.departureDate,
					checkpoint.entryTime,
					passeio.timezone,
				);
				if (checkpointUTC === null) continue;

				const when = formatInTimezone(checkpointUTC, targetOffsetHours);
				moments.push({
					id: `${passeio.id}-cp-${checkpoint.id}`,
					iso: when.iso,
					time: when.time,
					slot: getSlotFromHour(when.hour),
					label: checkpoint.title || "Checkpoint",
					kind: "checkpoint",
					city: passeio.city,
				});
			}
		}

		return moments.sort((a, b) => {
			if (a.iso !== b.iso) return a.iso.localeCompare(b.iso);
			// Bloco antes dos checkpoints do mesmo slot, para o bloco emoldurar.
			if (a.kind !== b.kind) return a.kind === "bloco" ? -1 : 1;
			return a.time.localeCompare(b.time);
		});
	}, [passeios, selectedTimezone]);

	const passeioMomentsBySlot = useMemo(() => {
		const map = new Map<string, PasseioMoment[]>();
		for (const moment of passeioMoments) {
			const key = `${moment.iso}|${moment.slot}`;
			const list = map.get(key) ?? [];
			list.push(moment);
			map.set(key, list);
		}
		return map;
	}, [passeioMoments]);

	const passeioColorByDateSlot = useMemo(() => {
		const colorByDateSlot = new Map<string, string>();
		const colorByCity = new Map<string, string>();
		const targetOffsetHours = parseTimezoneOffsetHours(selectedTimezone);
		if (targetOffsetHours === null) return colorByDateSlot;

		for (const passeio of passeios) {
			const normalizedCity = normalizeCityName(passeio.city);
			const passeioColor: string =
				passeio.color ?? colorFromCityName(passeio.city);
			if (normalizedCity && !colorByCity.has(normalizedCity)) {
				colorByCity.set(normalizedCity, passeioColor);
			}

			const departureUTC = parseLocalToUTC(
				passeio.departureDate,
				passeio.departureTime,
				passeio.timezone,
			);
			const returnUTC = parseLocalToUTC(
				passeio.returnDate,
				passeio.returnTime,
				passeio.timezone,
			);

			if (departureUTC === null || returnUTC === null) continue;

			const departureWhen = formatInTimezone(
				departureUTC,
				targetOffsetHours,
			);
			const returnWhen = formatInTimezone(returnUTC, targetOffsetHours);

			const departureDate = parseDateOnly(departureWhen.iso);
			const returnDate = parseDateOnly(returnWhen.iso);
			if (!departureDate || !returnDate || returnDate < departureDate)
				continue;

			const departureSlotIndex = SLOTS.indexOf(
				getSlotFromHour(departureWhen.hour),
			);
			const returnSlotIndex = SLOTS.indexOf(
				getSlotFromHour(returnWhen.hour),
			);

			let cursor = new Date(departureDate);
			while (cursor <= returnDate) {
				const iso = cursor.toISOString().slice(0, 10);
				const cityColor: string =
					colorByCity.get(normalizedCity) ?? passeioColor;

				const startIndex =
					iso === departureWhen.iso ? departureSlotIndex : 0;
				const endIndex =
					iso === returnWhen.iso ? returnSlotIndex : SLOTS.length - 1;

				for (let idx = startIndex; idx <= endIndex; idx += 1) {
					const slot = SLOTS[idx];
					if (!slot) continue;
					colorByDateSlot.set(`${iso}|${slot}`, cityColor);
				}
				cursor = addDays(cursor, 1);
			}
		}

		return colorByDateSlot;
	}, [passeios, selectedTimezone]);

	return { passeioMoments, passeioMomentsBySlot, passeioColorByDateSlot };
}
