import { ScreenType } from "../../types";
import { AppIconName } from "../Icons/AppIcon";

export type LayoutNavIcon = Extract<
	AppIconName,
	"calendar" | "tickets" | "reservations"
>;

export interface LayoutNavItem {
	id: ScreenType;
	label: string;
	icon: LayoutNavIcon;
}

export const LAYOUT_NAV_ITEMS: LayoutNavItem[] = [
	{ id: "calendar", label: "Calendário", icon: "calendar" },
	{ id: "tickets", label: "Passagens", icon: "tickets" },
	{ id: "reservations", label: "Reservas", icon: "reservations" },
];
