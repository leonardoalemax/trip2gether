import { useEffect, useState } from "react";
import { geocode, type LatLng } from "../utils/geocode";
import { stopQueries, type ItineraryStop } from "../utils/itinerary";

export interface RoutePoint {
	stop: ItineraryStop;
	coords: LatLng;
	/** true quando o endereco exato falhou e caiu numa consulta menos precisa. */
	approximate: boolean;
	/**
	 * Posicao da parada no itinerario (1-based). Vem da lista completa, nao do
	 * indice em `points`, para o numero do marcador continuar batendo com a lista
	 * de texto mesmo quando alguma parada nao e localizada.
	 */
	order: number;
}

interface UseItineraryRouteResult {
	points: RoutePoint[];
	/** Paradas sem endereco ou que o geocoder nao encontrou. */
	unresolved: ItineraryStop[];
	loading: boolean;
}

export function useItineraryRoute(
	stops: ItineraryStop[],
): UseItineraryRouteResult {
	const [points, setPoints] = useState<RoutePoint[]>([]);
	const [unresolved, setUnresolved] = useState<ItineraryStop[]>([]);
	const [loading, setLoading] = useState(false);

	// As buscas sao seriais (rate limit do Nominatim), entao a chave evita
	// refazer tudo a cada render — so quando enderecos/ordem realmente mudam.
	const stopsKey = stops
		.map((stop) => `${stop.id}:${stopQueries(stop).join(">")}`)
		.join("|");

	useEffect(() => {
		let mounted = true;

		const resolve = async () => {
			setLoading(true);
			const resolvedPoints: RoutePoint[] = [];
			const missing: ItineraryStop[] = [];

			for (const [index, stop] of stops.entries()) {
				const queries = stopQueries(stop);
				if (queries.length === 0) {
					missing.push(stop);
					continue;
				}

				let coords: LatLng | null = null;
				let attempt = 0;
				for (const query of queries) {
					coords = await geocode(query);
					if (!mounted) return;
					if (coords) break;
					attempt += 1;
				}

				if (coords) {
					resolvedPoints.push({
						stop,
						coords,
						approximate: attempt > 0,
						order: index + 1,
					});
				} else {
					missing.push(stop);
				}
			}

			if (!mounted) return;
			setPoints(resolvedPoints);
			setUnresolved(missing);
			setLoading(false);
		};

		resolve();
		return () => {
			mounted = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stopsKey]);

	return { points, unresolved, loading };
}
