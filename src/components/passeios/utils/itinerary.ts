import type { Passeio, PasseioCheckpoint, Reservation } from "../../../types";

export type ItineraryStopKind =
	| "origin"
	| "place"
	| "checkpoint"
	| "destination";

export interface ItineraryStop {
	id: string;
	kind: ItineraryStopKind;
	title: string;
	address?: string;
	city?: string;
	entryTime?: string;
	exitTime?: string;
}

/**
 * A reserva "do dia" e aquela cujo intervalo de check-in/check-out cobre a data
 * do passeio — e dela que saem a cidade e o endereco da estadia.
 */
export function findStayForDate(
	reservations: Reservation[],
	dateIso: string,
): Reservation | null {
	if (!dateIso) return null;

	return (
		reservations.find(
			(reservation) =>
				!!reservation.checkInDate &&
				!!reservation.checkOutDate &&
				reservation.checkInDate <= dateIso &&
				dateIso <= reservation.checkOutDate,
		) ?? null
	);
}

function normalizeForCompare(value: string | undefined) {
	return (value ?? "").trim().toLowerCase();
}

function sortCheckpoints(checkpoints: PasseioCheckpoint[]) {
	return [...checkpoints].sort((a, b) => {
		if (!a.entryTime && !b.entryTime) return 0;
		if (!a.entryTime) return 1;
		if (!b.entryTime) return -1;
		return a.entryTime.localeCompare(b.entryTime);
	});
}

/**
 * Monta a sequencia sai-da-estadia -> local/checkpoints -> volta-pra-estadia.
 * Quando nao ha reserva cobrindo o dia, os pontos de saida/retorno caem para a
 * cidade do proprio passeio (e o mapa avisa que a origem e aproximada).
 */
export function buildItinerary(
	passeio: Passeio,
	stay: Reservation | null,
): ItineraryStop[] {
	const stops: ItineraryStop[] = [];

	const stayCity = stay?.city || passeio.city;
	const stayAddress = stay?.hotelAddress;
	const stayLabel = stay?.hotelName || stayCity || "Estadia";

	stops.push({
		id: "origin",
		kind: "origin",
		title: stayLabel,
		...(stayAddress ? { address: stayAddress } : {}),
		...(stayCity ? { city: stayCity } : {}),
		...(passeio.departureTime ? { exitTime: passeio.departureTime } : {}),
	});

	const checkpoints = sortCheckpoints(passeio.checkpoints ?? []);
	const checkpointAddresses = new Set(
		checkpoints.map((checkpoint) => normalizeForCompare(checkpoint.address)),
	);

	// O endereco do passeio so entra como parada propria se nenhum checkpoint
	// ja apontar para o mesmo lugar.
	const passeioAddress = normalizeForCompare(passeio.address);
	if (passeioAddress && !checkpointAddresses.has(passeioAddress)) {
		stops.push({
			id: "place",
			kind: "place",
			title: passeio.title || "Local do passeio",
			...(passeio.address ? { address: passeio.address } : {}),
			...(passeio.city ? { city: passeio.city } : {}),
		});
	}

	for (const checkpoint of checkpoints) {
		stops.push({
			id: checkpoint.id,
			kind: "checkpoint",
			title: checkpoint.title || "Checkpoint sem titulo",
			...(checkpoint.address ? { address: checkpoint.address } : {}),
			...(passeio.city ? { city: passeio.city } : {}),
			...(checkpoint.entryTime ? { entryTime: checkpoint.entryTime } : {}),
			...(checkpoint.exitTime ? { exitTime: checkpoint.exitTime } : {}),
		});
	}

	stops.push({
		id: "destination",
		kind: "destination",
		title: stayLabel,
		...(stayAddress ? { address: stayAddress } : {}),
		...(stayCity ? { city: stayCity } : {}),
		...(passeio.returnTime ? { entryTime: passeio.returnTime } : {}),
	});

	return stops;
}

function joinQuery(parts: (string | undefined)[]): string | null {
	const filled = parts.filter(
		(part): part is string => !!part && part.trim().length > 0,
	);
	if (filled.length === 0) return null;
	return filled.join(", ");
}

/**
 * Consultas candidatas em ordem de preferencia. Endereco livre digitado a mao
 * falha bastante no Nominatim, enquanto o nome da atracao costuma acertar
 * ("68 Fukakusa Yabunouchicho" nao resolve, "Fushimi Inari" resolve), por isso
 * o titulo entra como segunda tentativa. Para a estadia, cair na cidade e
 * aceitavel; para uma atracao especifica nao e — marcaria um ponto errado no
 * mapa — entao ali a parada fica como nao localizada.
 */
export function stopQueries(stop: ItineraryStop): string[] {
	const hasAddress = !!stop.address && stop.address.trim().length > 0;
	const candidates: (string | null)[] = [
		// Sem endereco esta consulta viraria so a cidade, fixando a atracao no
		// centro dela — melhor pular direto para a tentativa pelo titulo.
		hasAddress ? joinQuery([stop.address, stop.city]) : null,
		joinQuery([stop.title, stop.city]),
	];

	if (stop.kind === "origin" || stop.kind === "destination") {
		candidates.push(joinQuery([stop.city]));
	}

	const seen = new Set<string>();
	const queries: string[] = [];
	for (const candidate of candidates) {
		if (!candidate) continue;
		const key = candidate.toLowerCase();
		if (seen.has(key)) continue;
		seen.add(key);
		queries.push(candidate);
	}
	return queries;
}
