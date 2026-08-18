import React from "react";
import { Passeio, Reservation } from "../../types";
import { TIMEZONE_OPTIONS } from "../tickets/timezoneOptions";
import { darkenHex } from "./utils/styleUtils";

interface CalendarLegendProps {
	reservations: Reservation[];
	passeios: Passeio[];
	availableTimezones: typeof TIMEZONE_OPTIONS;
	selectedTimezone: string;
	onTimezoneChange: (tz: string) => void;
}

export default function CalendarLegend({
	reservations,
	passeios,
	availableTimezones,
	selectedTimezone,
	onTimezoneChange,
}: CalendarLegendProps) {
	const cities = React.useMemo(() => {
		const cityMap = new Map<
			string,
			{ id: string; name: string; color: string }
		>();

		for (const reservation of reservations) {
			const key = reservation.city.trim().toLowerCase();
			if (!key || cityMap.has(key)) continue;

			cityMap.set(key, {
				id: reservation.id,
				name: reservation.city,
				color: reservation.color || "#d1d5db",
			});
		}

		for (const passeio of passeios) {
			const key = passeio.city.trim().toLowerCase();
			if (!key || cityMap.has(key)) continue;

			cityMap.set(key, {
				id: passeio.id,
				name: passeio.city,
				color: passeio.color || "#ddd6fe",
			});
		}

		return Array.from(cityMap.values());
	}, [reservations, passeios]);

	return (
		<div className='space-y-3'>
			<div className='flex flex-wrap gap-3 text-xs'>
				{cities.map((city) => (
					<span
						key={city.id}
						className='flex items-center gap-1.5 font-medium'
						style={{ color: darkenHex(city.color, 0.55) }}>
						<span
							className='inline-block w-3 h-3 rounded'
							style={{ background: city.color }}
						/>
						{city.name}
					</span>
				))}
			</div>

			<div className='flex flex-wrap gap-4 pt-2 border-t border-base-200 text-xs text-base-content/40'>
				<span className='flex items-center gap-1.5'>
					<span
						className='inline-block w-3 h-3 rounded'
						style={{ background: "#fecaca" }}
					/>
					Voo
				</span>
				<span className='flex items-center gap-1.5'>
					<span
						className='inline-block w-3 h-3 rounded'
						style={{ background: "#fef08a" }}
					/>
					Reserva
				</span>
				<span className='flex items-center gap-1.5'>
					<span
						className='inline-block w-3 h-3 rounded'
						style={{ background: "#bbf7d0" }}
					/>
					Programação
				</span>
				<span className='flex items-center gap-1.5'>
					<span
						className='inline-block w-3 h-3 rounded'
						style={{ background: "#ddd6fe" }}
					/>
					Passeio
				</span>
				<span className='flex items-center gap-1.5'>
					<span
						className='inline-block w-3 h-3 rounded'
						style={{ background: "#e5e7eb" }}
					/>
					Passagens Aéreas
				</span>
				<div className='ml-auto flex items-center gap-2'>
					<span className='text-[11px] text-base-content/60'>
						Timezone
					</span>
					<select
						className='select select-bordered select-xs'
						value={selectedTimezone}
						onChange={(e) => onTimezoneChange(e.target.value)}
						disabled={availableTimezones.length === 0}>
						{availableTimezones.length === 0 ? (
							<option value=''>
								Sem fusos em passagens aéreas
							</option>
						) : (
							availableTimezones.map((tz) => (
								<option key={tz.value} value={tz.value}>
									{tz.label}
								</option>
							))
						)}
					</select>
				</div>
			</div>
		</div>
	);
}
