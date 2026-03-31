const COOKIE_KEY = "trip2gether_default_trip";

export function getDefaultTripId(): string | null {
	const match = document.cookie
		.split("; ")
		.find((row) => row.startsWith(`${COOKIE_KEY}=`));
	return match ? decodeURIComponent(match.split("=")[1]) : null;
}

export function setDefaultTripId(tripId: string): void {
	const maxAge = 60 * 60 * 24 * 365; // 1 year
	document.cookie = `${COOKIE_KEY}=${encodeURIComponent(tripId)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function clearDefaultTripId(): void {
	document.cookie = `${COOKIE_KEY}=; path=/; max-age=0`;
}
