import AppIcon, { AppIconName } from "../../../Icons/AppIcon";

type IconName = Extract<AppIconName, "edit" | "add" | "switch">;

interface IconButtonProps {
	onClick: () => void;
	label: string;
	icon: IconName;
	className?: string;
}

export default function IconButton({
	onClick,
	label,
	icon,
	className = "",
}: IconButtonProps) {
	return (
		<button
			className={`btn btn-ghost btn-xs btn-square ${className}`.trim()}
			onClick={onClick}
			aria-label={label}>
			<AppIcon name={icon} className='h-3.5 w-3.5' />
		</button>
	);
}
