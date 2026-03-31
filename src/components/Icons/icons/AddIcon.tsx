interface IconProps {
	className?: string;
}

export default function AddIcon({ className = "h-4 w-4" }: IconProps) {
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
				d='M12 4v16m8-8H4'
			/>
		</svg>
	);
}
