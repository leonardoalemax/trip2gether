export interface LatLng {
	lat: number;
	lon: number;
}

const STORAGE_KEY = "trip2gether_geocode_cache";
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

/**
 * Nominatim pede no maximo 1 requisicao por segundo, entao as buscas passam por
 * uma fila serial e tudo que ja foi resolvido fica em cache (memoria +
 * localStorage) para nao repetir chamada entre expandir/recolher o card.
 */
const memoryCache = new Map<string, LatLng | null>();
let cacheLoaded = false;

function loadPersistedCache() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return;
		const parsed = JSON.parse(raw) as Record<string, LatLng | null>;
		for (const [key, value] of Object.entries(parsed)) {
			memoryCache.set(key, value);
		}
	} catch {
		// cache corrompido ou localStorage indisponivel — segue sem cache
	}
}

function persistCache() {
	try {
		const asObject: Record<string, LatLng | null> = {};
		for (const [key, value] of memoryCache.entries()) {
			asObject[key] = value;
		}
		localStorage.setItem(STORAGE_KEY, JSON.stringify(asObject));
	} catch {
		// sem espaco / indisponivel — cache em memoria ainda vale
	}
}

const sleep = (ms: number) =>
	new Promise<void>((resolve) => {
		setTimeout(resolve, ms);
	});

let queue: Promise<unknown> = Promise.resolve();

function enqueue<T>(task: () => Promise<T>): Promise<T> {
	const result = queue.then(task, task);
	// Espaca as chamadas seguintes independentemente do resultado desta.
	queue = result.then(
		() => sleep(1100),
		() => sleep(1100),
	);
	return result;
}

async function requestGeocode(query: string): Promise<LatLng | null> {
	const url = `${NOMINATIM_URL}?format=json&limit=1&q=${encodeURIComponent(query)}`;
	const response = await fetch(url, {
		headers: { Accept: "application/json" },
	});
	if (!response.ok) return null;

	const data = (await response.json()) as { lat: string; lon: string }[];
	const first = data[0];
	if (!first) return null;

	const lat = Number.parseFloat(first.lat);
	const lon = Number.parseFloat(first.lon);
	if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

	return { lat, lon };
}

export async function geocode(query: string): Promise<LatLng | null> {
	if (!cacheLoaded) {
		loadPersistedCache();
		cacheLoaded = true;
	}

	const key = query.trim().toLowerCase();
	if (!key) return null;
	if (memoryCache.has(key)) return memoryCache.get(key) ?? null;

	const coords = await enqueue(() => requestGeocode(key)).catch(() => null);

	memoryCache.set(key, coords);
	persistCache();
	return coords;
}
