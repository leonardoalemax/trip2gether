interface IconProps {
	className?: string;
}

export default function ReservationsIcon({ className = "h-4 w-4" }: IconProps) {
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
				d='M4 21h16M6 21V5a1 1 0 011-1h10a1 1 0 011 1v16M9 8h2v2H9V8zm4 0h2v2h-2V8zM9 12h2v2H9v-2zm4 0h2v2h-2v-2zM11 21v-3a1 1 0 011-1h0a1 1 0 011 1v3'
			/>
		</svg>
	);
}
