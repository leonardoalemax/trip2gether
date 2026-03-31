export const EV_STYLE: Record<string, { bg: string; text: string }> = {
	flight: { bg: "#fecaca", text: "#991b1b" },
	res: { bg: "#fef08a", text: "#854d0e" },
	prog: { bg: "#bbf7d0", text: "#166534" },
};

export function darkenHex(hex: string, f = 0.45): string {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return `rgb(${Math.round(r * (1 - f))},${Math.round(g * (1 - f))},${Math.round(b * (1 - f))})`;
}
