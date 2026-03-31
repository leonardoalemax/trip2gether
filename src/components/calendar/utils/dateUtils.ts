export function dstr(d: Date) {
	return d.toISOString().slice(0, 10);
}

export function addDays(d?: Date, n = 0) {
	if (!d) return new Date();

	const r = new Date(d);
	r.setDate(r.getDate() + n);
	return r;
}

export function parseDateOnly(dateStr: string): Date | null {
	if (!dateStr) return null;
	const date = new Date(`${dateStr}T00:00:00`);
	if (isNaN(date.getTime())) return null;
	return date;
}

export function formatWeekLabel(weekDays: Date[], weekIndex: number): string {
	if (weekDays.length === 0) return `Semana ${weekIndex + 1}`;
	const start = weekDays[0];
	const end = weekDays[weekDays.length - 1];

	if (typeof start === "undefined" || typeof end === "undefined")
		return `Semana ${weekIndex + 1}`;

	const sameMonth =
		start.getMonth() === end.getMonth() &&
		start.getFullYear() === end.getFullYear();

	if (sameMonth) {
		return `Semana ${weekIndex + 1} — ${start.getDate()} a ${end.getDate()} de ${start.toLocaleDateString("pt-BR", { month: "long" })}`;
	}

	return `Semana ${weekIndex + 1} — ${start.toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "short",
	})} a ${end.toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "short",
	})}`;
}
