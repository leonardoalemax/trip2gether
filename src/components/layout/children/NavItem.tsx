import { ScreenType } from "../../../types";
import AppIcon, { AppIconName } from "../../Icons/AppIcon";

type NavIconName = Extract<
	AppIconName,
	"calendar" | "tickets" | "reservations"
>;

interface NavItemProps {
	id: ScreenType;
	label: string;
	icon: NavIconName;
	isActive: boolean;
	onClick: (screen: ScreenType) => void;
}

export default function NavItem({
	id,
	label,
	icon,
	isActive,
	onClick,
}: NavItemProps) {
	return (
		<li>
			<a
				className={`text-sm ${isActive ? "-active font-medium" : ""}`}
				onClick={() => onClick(id)}
				style={{ cursor: "pointer" }}>
				<AppIcon name={icon} className='h-4 w-4' />
				{label}
			</a>
		</li>
	);
}
