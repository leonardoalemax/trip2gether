import React from "react";
import { ScreenType } from "../../types";

const SCREEN_CONFIG: Record<ScreenType, { title: string; primary?: string }> = {
	calendar: { title: "Calendário" },
	tickets: { title: "Passagens Aéreas", primary: "+ Nova passagem" },
	reservations: { title: "Reservas", primary: "+ Nova reserva" },
};

interface NavbarProps {
	activeScreen: ScreenType;
	onPrimary: () => void;
}

export default function Navbar({ activeScreen, onPrimary }: NavbarProps) {
	const { title, primary } = SCREEN_CONFIG[activeScreen];
	return (
		<div className='navbar bg-base-100 border-b border-base-300 min-h-12 px-4 gap-2 flex-shrink-0'>
			<label
				htmlFor='drawer-toggle'
				className='btn btn-ghost btn-sm drawer-button lg:hidden'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-5 w-5'
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						d='M4 6h16M4 12h16M4 18h16'
					/>
				</svg>
			</label>
			<span className='font-serif text-base font-semibold flex-1'>
				{title}
			</span>
			{primary && (
				<button className='btn btn-primary btn-sm' onClick={onPrimary}>
					{primary}
				</button>
			)}
		</div>
	);
}
