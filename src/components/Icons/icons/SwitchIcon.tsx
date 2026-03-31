interface IconProps {
	className?: string;
}

export default function SwitchIcon({ className = "h-4 w-4" }: IconProps) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			className={className}
			fill='none'
			viewBox='0 0 24 24'
			stroke='currentColor'
			aria-hidden='true'>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth='2'
				d='M8 7h12m0 0l-4-4m4 4l-4 4M4 17h12m0 0l-4-4m4 4l-4 4'
			/>
		</svg>
	);
}
