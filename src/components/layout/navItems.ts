import { ScreenType } from "../../types";

export interface LayoutNavItem {
	id: ScreenType;
	label: string;
	emoji: string;
}

export const LAYOUT_NAV_ITEMS: LayoutNavItem[] = [
	{ id: "calendar", label: "Calendário", emoji: "📅" },
	{ id: "tickets", label: "Passagens", emoji: "✈️" },
	{ id: "reservations", label: "Reservas", emoji: "🏨" },
	{ id: "payments", label: "Pagamentos", emoji: "💵" },
];
