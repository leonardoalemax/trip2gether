import { stopQueries, type ItineraryStop } from "./itinerary";

/** Rotas ponto-a-ponto (botao de cada parada) saem como transporte publico. */
const TRAVEL_MODE = "transit";

/**
 * O link do dia inteiro usa outro modo de proposito: o Google nao calcula rota
 * de transporte publico passando por paradas intermediarias (nem na Directions
 * antiga nem na Routes nova). Com `transit` + waypoints ele descarta as paradas
 * do meio, entao encadear o dia so funciona em modo carro.
 */
const FULL_ROUTE_MODE = "driving";

/** Texto que representa a parada numa URL do Google (endereco ou nome). */
function stopText(stop: ItineraryStop): string | null {
	return stopQueries(stop)[0] ?? null;
}

/**
 * Link de rota de UM trecho (parada anterior -> parada atual) no formato oficial
 * "Maps URLs" (api=1), que o Google resolve para o app nativo no celular e para
 * o site no desktop — sem chave de API.
 *
 * Os pontos vao como TEXTO (endereco/nome) e nao como coordenadas: o geocoder do
 * Google acerta muito mais que o Nominatim que o mapa usa para plotar.
 */
export function buildLegLink(
	from: ItineraryStop,
	to: ItineraryStop,
): string | null {
	const origin = stopText(from);
	const destination = stopText(to);
	if (!origin || !destination || origin === destination) return null;

	const params = new URLSearchParams({
		api: "1",
		origin,
		destination,
		travelmode: TRAVEL_MODE,
	});

	return `https://www.google.com/maps/dir/?${params.toString()}`;
}

/** Abre o trajeto inteiro (todas as paradas) fora do app. */
export function buildFullRouteLink(stops: ItineraryStop[]): string | null {
	const described = stops
		.map((stop) => stopText(stop))
		.filter((text): text is string => !!text);
	if (described.length < 2) return null;

	const origin = described[0];
	const destination = described[described.length - 1];
	if (!origin || !destination) return null;

	const waypoints = described.slice(1, -1);
	if (waypoints.length === 0 && origin === destination) return null;

	const params = new URLSearchParams({
		api: "1",
		origin,
		destination,
		travelmode: FULL_ROUTE_MODE,
	});
	if (waypoints.length > 0) {
		params.set("waypoints", waypoints.join("|"));
	}

	return `https://www.google.com/maps/dir/?${params.toString()}`;
}
