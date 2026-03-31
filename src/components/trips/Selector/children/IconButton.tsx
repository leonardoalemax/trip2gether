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
			type='button'
			className={`h-6 w-6 rounded-md inline-flex items-center justify-center text-base-content/60 hover:bg-base-200 hover:text-base-content transition-colors ${className}`.trim()}
			onClick={onClick}
			aria-label={label}>
			<AppIcon name={icon} className='h-3.5 w-3.5' />
		</button>
	);
}
