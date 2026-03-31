import React, { useMemo } from "react";
import type { DraftTicket } from "../../types";
import { TIMEZONE_OPTIONS } from "./timezoneOptions";

interface TicketFieldsProps {
	values: Partial<DraftTicket> | DraftTicket;
	onChange: (field: keyof DraftTicket, value: string) => void;
	onBlur?: (field: keyof DraftTicket, value: string) => void;
}

const TicketFields: React.FC<TicketFieldsProps> = ({
	values,
	onChange,
	onBlur,
}) => {
	const flightDuration = useMemo(() => {
		const {
			departureDate,
			departureTime,
			departureTimezone,
			arrivalDate,
			arrivalTime,
			arrivalTimezone,
		} = values;

		if (
			!departureDate ||
			!departureTime ||
			!departureTimezone ||
			!arrivalDate ||
			!arrivalTime ||
			!arrivalTimezone
		)
			return null;

		const [depYear, depMonth, depDay] = departureDate
			.split("-")
			.map(Number);
		const [depHour, depMinute] = departureTime.split(":").map(Number);
		const [arrYear, arrMonth, arrDay] = arrivalDate.split("-").map(Number);
		const [arrHour, arrMinute] = arrivalTime.split(":").map(Number);

		if (
			!depYear ||
			!depMonth ||
			!depDay ||
			Number.isNaN(depHour) ||
			Number.isNaN(depMinute) ||
			!arrYear ||
			!arrMonth ||
			!arrDay ||
			Number.isNaN(arrHour) ||
			Number.isNaN(arrMinute)
		)
			return null;

		const depOffsetMs =
			Number.parseFloat(departureTimezone) * 60 * 60 * 1000;
		const arrOffsetMs = Number.parseFloat(arrivalTimezone) * 60 * 60 * 1000;
		if (!Number.isFinite(depOffsetMs) || !Number.isFinite(arrOffsetMs))
			return null;

		const depUTC =
			Date.UTC(depYear, depMonth - 1, depDay, depHour, depMinute) -
			depOffsetMs;
		const arrUTC =
			Date.UTC(arrYear, arrMonth - 1, arrDay, arrHour, arrMinute) -
			arrOffsetMs;

		const diffMs = arrUTC - depUTC;
		if (diffMs < 0) return null;

		const totalMin = Math.round(diffMs / 60000);
		const hours = Math.floor(totalMin / 60);
		const minutes = totalMin % 60;
		return `${hours}h ${minutes.toString().padStart(2, "0")}min`;
	}, [values]);

	return (
		<>
			<div className='form-control col-span-2'>
				<label className='label py-0'>
					<span className='label-text text-xs'>Companhia aérea</span>
				</label>
				<input
					type='text'
					placeholder='Ex: LATAM'
					value={values.airlineName || ""}
					onBlur={(e) => onBlur?.("airlineName", e.target.value)}
					onChange={(e) => onChange("airlineName", e.target.value)}
					className='input input-bordered input-sm'
				/>
			</div>

			<div className='form-control col-span-2'>
				<label className='label py-0'>
					<span className='label-text text-xs'>Número do voo</span>
				</label>
				<input
					type='text'
					placeholder='Ex: LA8084'
					value={values.flightNumber || ""}
					onBlur={(e) => onBlur?.("flightNumber", e.target.value)}
					onChange={(e) => onChange("flightNumber", e.target.value)}
					className='input input-bordered input-sm'
				/>
			</div>

			<div className='form-control'>
				<label className='label py-0'>
					<span className='label-text text-xs'>Saída</span>
				</label>
				<input
					type='text'
					placeholder='Ex: GRU'
					value={values.departureAirport || ""}
					onBlur={(e) => onBlur?.("departureAirport", e.target.value)}
					onChange={(e) =>
						onChange("departureAirport", e.target.value)
					}
					className='input input-bordered input-sm'
				/>
			</div>

			<div className='form-control'>
				<label className='label py-0'>
					<span className='label-text text-xs'>Chegada</span>
				</label>
				<input
					type='text'
					placeholder='Ex: JFK'
					value={values.arrivalAirport || ""}
					onBlur={(e) => onBlur?.("arrivalAirport", e.target.value)}
					onChange={(e) => onChange("arrivalAirport", e.target.value)}
					className='input input-bordered input-sm'
				/>
			</div>

			<div className='form-control'>
				<label className='label py-0'>
					<span className='label-text text-xs'>Data de partida</span>
				</label>
				<input
					type='date'
					value={values.departureDate || ""}
					onBlur={(e) => onBlur?.("departureDate", e.target.value)}
					onChange={(e) => onChange("departureDate", e.target.value)}
					className='input input-bordered input-sm'
				/>
			</div>

			<div className='form-control'>
				<label className='label py-0'>
					<span className='label-text text-xs'>Data de chegada</span>
				</label>
				<input
					type='date'
					value={values.arrivalDate || ""}
					onBlur={(e) => onBlur?.("arrivalDate", e.target.value)}
					onChange={(e) => onChange("arrivalDate", e.target.value)}
					className='input input-bordered input-sm'
				/>
			</div>

			<div className='form-control'>
				<label className='label py-0'>
					<span className='label-text text-xs'>Hora de partida</span>
				</label>
				<input
					type='time'
					value={values.departureTime || ""}
					onBlur={(e) => onBlur?.("departureTime", e.target.value)}
					onChange={(e) => onChange("departureTime", e.target.value)}
					className='input input-bordered input-sm'
				/>
			</div>

			<div className='form-control'>
				<label className='label py-0'>
					<span className='label-text text-xs'>Hora de chegada</span>
				</label>
				<input
					type='time'
					value={values.arrivalTime || ""}
					onBlur={(e) => onBlur?.("arrivalTime", e.target.value)}
					onChange={(e) => onChange("arrivalTime", e.target.value)}
					className='input input-bordered input-sm'
				/>
			</div>

			<div className='form-control'>
				<label className='label py-0'>
					<span className='label-text text-xs'>Fuso partida</span>
				</label>
				<select
					value={values.departureTimezone || ""}
					onChange={(e) =>
						onChange("departureTimezone", e.target.value)
					}
					onBlur={(e) =>
						onBlur?.("departureTimezone", e.target.value)
					}
					className='select select-bordered select-sm'>
					<option value=''>Selecione</option>
					{TIMEZONE_OPTIONS.map((tz) => (
						<option key={tz.value} value={tz.value}>
							{tz.label}
						</option>
					))}
				</select>
			</div>

			<div className='form-control'>
				<label className='label py-0'>
					<span className='label-text text-xs'>Fuso chegada</span>
				</label>
				<select
					value={values.arrivalTimezone || ""}
					onChange={(e) =>
						onChange("arrivalTimezone", e.target.value)
					}
					onBlur={(e) => onBlur?.("arrivalTimezone", e.target.value)}
					className='select select-bordered select-sm'>
					<option value=''>Selecione</option>
					{TIMEZONE_OPTIONS.map((tz) => (
						<option key={tz.value} value={tz.value}>
							{tz.label}
						</option>
					))}
				</select>
			</div>

			{flightDuration && (
				<div className='col-span-2 flex items-center gap-2 py-1 px-3 bg-primary/10 rounded-lg border border-primary/20'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-4 w-4 text-primary shrink-0'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
						/>
					</svg>
					<span className='text-xs font-medium text-primary'>
						Duração do voo: {flightDuration}
					</span>
				</div>
			)}
		</>
	);
};

export default TicketFields;
