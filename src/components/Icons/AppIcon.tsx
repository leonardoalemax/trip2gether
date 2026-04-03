import { ComponentType } from "react";
import AddIcon from "./icons/AddIcon";
import CalendarIcon from "./icons/CalendarIcon";
import EditIcon from "./icons/EditIcon";
import ReservationsIcon from "./icons/ReservationsIcon";
import SwitchIcon from "./icons/SwitchIcon";
import TicketsIcon from "./icons/TicketsIcon";
import PaymentsIcon from "./icons/PaymentsIcon";

type IconComponent = ComponentType<{ className?: string }>;

const ICONS = {
	calendar: CalendarIcon,
	tickets: TicketsIcon,
	reservations: ReservationsIcon,
	payments: PaymentsIcon,
	edit: EditIcon,
	add: AddIcon,
	switch: SwitchIcon,
} as const satisfies Record<string, IconComponent>;

export type AppIconName = keyof typeof ICONS;

interface AppIconProps {
	name: AppIconName;
	className?: string;
}

export default function AppIcon({ name, className = "h-4 w-4" }: AppIconProps) {
	const IconComponent = ICONS[name];

	return <IconComponent className={className} />;
}
