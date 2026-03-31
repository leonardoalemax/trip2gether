interface IconProps {
	className?: string;
}

export default function TicketsIcon({ className = "h-4 w-4" }: IconProps) {
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
				d='M2 14l8-1 5-8h2l-2 8 5 1v2l-5 1 2 2v1l-5-2-2 1v-1l1-2-9-1z'
			/>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth='2'
				d='M10 13h5'
			/>
		</svg>
	);
}
