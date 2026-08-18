import { useMemo } from "react";
import { SlotType } from "../../../types";
import { PasseioMoment } from "../../calendar/types/PasseioMoment";
import { ReservationMoment } from "../../calendar/types/ReservationMoment";
import { TicketMoment } from "../../calendar/types/TicketMoment";
import { addDays, dstr } from "../../calendar/utils/dateUtils";
import { SLOTS } from "../../calendar/utils/slotUtils";

export type AgendaTone = "voo" | "hotel" | "passeio" | "checkpoint";

export interface AgendaEntry {
	id: string;
	/** "09:00", ou "09:00 – 21:00" quando o passeio comeca e acaba no mesmo slot. */
	time: string;
	slot: SlotType;
	icon: string;
	title: string;
	detail?: string;
	tone: AgendaTone;
}

export interface AgendaSlot {
	slot: SlotType;
	entries: AgendaEntry[];
	/** Sem nada marcado — inclui estar "dentro" de um passeio em andamento. */
	free: boolean;
}

export interface AgendaDay {
	iso: string;
	slots: AgendaSlot[];
	free: boolean;
}

/** Os moments trazem o rotulo no formato " | Texto"; aqui fica so o texto. */
function cleanLabel(label: string) {
	return label.replace(/^\s*\|\s*/, "").trim();
}

/** Ordena por horario; "09:00 – 21:00" ordena pelo inicio. */
function timeKey(time: string) {
	return time.slice(0, 5);
}

export function useTripAgenda(
	ticketMoments: TicketMoment[],
	reservationMoments: ReservationMoment[],
	passeioMoments: PasseioMoment[],
	startDate: Date | null,
	endDate: Date | null,
): AgendaDay[] {
	return useMemo(() => {
		if (!startDate || !endDate) return [];

		const entriesByKey = new Map<string, AgendaEntry[]>();
		// Ocupacao considera tambem o miolo do passeio, que nao vira linha na
		// timeline mas significa que aquele periodo nao esta livre.
		const busy = new Set<string>();

		const push = (iso: string, slot: SlotType, entry: AgendaEntry) => {
			const key = `${iso}|${slot}`;
			const list = entriesByKey.get(key) ?? [];
			list.push(entry);
			entriesByKey.set(key, list);
			busy.add(key);
		};

		for (const moment of ticketMoments) {
			push(moment.iso, moment.slot, {
				id: moment.id,
				time: moment.time,
				slot: moment.slot,
				icon: moment.kind === "departure" ? "✈️" : "🛬",
				title:
					moment.kind === "departure"
						? `Voo — partida de ${cleanLabel(moment.label)}`
						: `Voo — chegada em ${cleanLabel(moment.label)}`,
				tone: "voo",
			});
		}

		for (const moment of reservationMoments) {
			push(moment.iso, moment.slot, {
				id: moment.id,
				time: moment.time,
				slot: moment.slot,
				icon: moment.kind === "checkin" ? "🏨" : "🧳",
				title:
					moment.kind === "checkin"
						? `Check-in — ${cleanLabel(moment.label)}`
						: `Check-out — ${cleanLabel(moment.label)}`,
				detail: moment.city,
				tone: "hotel",
			});
		}

		for (const moment of passeioMoments) {
			const key = `${moment.iso}|${moment.slot}`;

			if (moment.kind === "bloco") {
				// O miolo so marca ocupacao: repetir o passeio em toda faixa
				// polui a leitura cronologica.
				if (moment.position === "middle") {
					busy.add(key);
					continue;
				}

				const suffix =
					moment.position === "start"
						? " — início"
						: moment.position === "end"
							? " — fim"
							: "";

				push(moment.iso, moment.slot, {
					id: moment.id,
					time: moment.time,
					slot: moment.slot,
					icon: "🗺️",
					title: `${cleanLabel(moment.label)}${suffix}`,
					detail: moment.city,
					tone: "passeio",
				});
				continue;
			}

			push(moment.iso, moment.slot, {
				id: moment.id,
				time: moment.time,
				slot: moment.slot,
				icon: "📍",
				title: cleanLabel(moment.label),
				tone: "checkpoint",
			});
		}

		const days: AgendaDay[] = [];
		let cursor = new Date(startDate);
		while (cursor <= endDate) {
			const iso = dstr(cursor);

			const slots: AgendaSlot[] = SLOTS.map((slot) => {
				const key = `${iso}|${slot}`;
				const entries = (entriesByKey.get(key) ?? []).sort((a, b) =>
					timeKey(a.time).localeCompare(timeKey(b.time)),
				);
				return { slot, entries, free: !busy.has(key) };
			});

			days.push({
				iso,
				slots,
				free: slots.every((slot) => slot.free),
			});

			cursor = addDays(cursor, 1);
		}

		return days;
	}, [
		ticketMoments,
		reservationMoments,
		passeioMoments,
		startDate,
		endDate,
	]);
}
