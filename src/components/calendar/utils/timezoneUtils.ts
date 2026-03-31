export function parseTimezoneOffsetHours(offset: string): number | null {
	const parsed = Number.parseFloat(offset);
	return Number.isFinite(parsed) ? parsed : null;
}

export function parseLocalToUTC(
	dateStr: string,
	timeStr: string,
	offsetStr: string,
): number | null {
	if (!dateStr || !timeStr || !offsetStr) return null;
	const offsetHours = parseTimezoneOffsetHours(offsetStr);
	if (offsetHours === null) return null;

	const [year, month, day] = dateStr.split("-").map(Number);
	const [hour, minute] = timeStr.split(":").map(Number);
	if (!year || !month || !day || Number.isNaN(hour) || Number.isNaN(minute))
		return null;

	return (
		Date.UTC(year, month - 1, day, hour, minute) -
		offsetHours * 60 * 60 * 1000
	);
}

export function formatInTimezone(utcMs: number, targetOffsetHours: number) {
	const shifted = new Date(utcMs + targetOffsetHours * 60 * 60 * 1000);
	const y = shifted.getUTCFullYear();
	const m = String(shifted.getUTCMonth() + 1).padStart(2, "0");
	const d = String(shifted.getUTCDate()).padStart(2, "0");
	const hh = String(shifted.getUTCHours()).padStart(2, "0");
	const mm = String(shifted.getUTCMinutes()).padStart(2, "0");
	return {
		iso: `${y}-${m}-${d}`,
		time: `${hh}:${mm}`,
		hour: shifted.getUTCHours(),
	};
}
