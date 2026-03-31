import React from "react";
import type { DraftReservation } from "../../types";
import { TIMEZONE_OPTIONS } from "../tickets/timezoneOptions";

interface ReservationFieldsProps {
	values: Partial<DraftReservation> | DraftReservation;
	onChange: (field: keyof DraftReservation, value: string) => void;
	onBlur?: (field: keyof DraftReservation, value: string) => void;
}

const ReservationFields: React.FC<ReservationFieldsProps> = ({
	values,
	onChange,
	onBlur,
}) => {
	return (
		<>
			<div className='form-control col-span-2'>
				<label className='label py-0'>
					<span className='label-text text-xs'>Cidade</span>
				</label>
				<input
					type='text'
					placeholder='Ex: Tóquio'
					value={values.city || ""}
					onBlur={(e) => onBlur?.("city", e.target.value)}
					onChange={(e) => onChange("city", e.target.value)}
					className='input input-bordered input-sm'
				/>
			</div>

			<div className='form-control col-span-2'>
				<label className='label py-0'>
					<span className='label-text text-xs'>Hotel</span>
				</label>
				<input
					type='text'
					placeholder='Ex: Shinjuku Hotel'
					value={values.hotelName || ""}
					onBlur={(e) => onBlur?.("hotelName", e.target.value)}
					onChange={(e) => onChange("hotelName", e.target.value)}
					className='input input-bordered input-sm'
				/>
			</div>

			<div className='form-control col-span-2'>
				<label className='label py-0'>
					<span className='label-text text-xs'>Timezone</span>
				</label>
				<select
					value={values.timezone || ""}
					onChange={(e) => onChange("timezone", e.target.value)}
					onBlur={(e) => onBlur?.("timezone", e.target.value)}
					className='select select-bordered select-sm'>
					<option value=''>Selecione</option>
					{TIMEZONE_OPTIONS.map((tz) => (
						<option key={tz.value} value={tz.value}>
							{tz.label}
						</option>
					))}
				</select>
			</div>

			<div className='form-control col-span-2'>
				<label className='label py-0'>
					<span className='label-text text-xs'>Cor da reserva</span>
				</label>
				<div className='flex items-center gap-2'>
					<input
						type='color'
						value={values.color || "#bfdbfe"}
						onChange={(e) => onChange("color", e.target.value)}
						onBlur={(e) => onBlur?.("color", e.target.value)}
						className='input input-bordered input-sm h-9 w-14 p-1'
					/>
					<input
						type='text'
						value={values.color || "#bfdbfe"}
						onChange={(e) => onChange("color", e.target.value)}
						onBlur={(e) => onBlur?.("color", e.target.value)}
						placeholder='#bfdbfe'
						className='input input-bordered input-sm flex-1'
					/>
				</div>
			</div>

			<div className='form-control'>
				<label className='label py-0'>
					<span className='label-text text-xs'>Data check-in</span>
				</label>
				<input
					type='date'
					value={values.checkInDate || ""}
					onBlur={(e) => onBlur?.("checkInDate", e.target.value)}
					onChange={(e) => onChange("checkInDate", e.target.value)}
					className='input input-bordered input-sm'
				/>
			</div>

			<div className='form-control'>
				<label className='label py-0'>
					<span className='label-text text-xs'>Hora check-in</span>
				</label>
				<input
					type='time'
					value={values.checkInTime || ""}
					onBlur={(e) => onBlur?.("checkInTime", e.target.value)}
					onChange={(e) => onChange("checkInTime", e.target.value)}
					className='input input-bordered input-sm'
				/>
			</div>

			<div className='form-control'>
				<label className='label py-0'>
					<span className='label-text text-xs'>Data check-out</span>
				</label>
				<input
					type='date'
					value={values.checkOutDate || ""}
					onBlur={(e) => onBlur?.("checkOutDate", e.target.value)}
					onChange={(e) => onChange("checkOutDate", e.target.value)}
					className='input input-bordered input-sm'
				/>
			</div>

			<div className='form-control'>
				<label className='label py-0'>
					<span className='label-text text-xs'>Hora check-out</span>
				</label>
				<input
					type='time'
					value={values.checkOutTime || ""}
					onBlur={(e) => onBlur?.("checkOutTime", e.target.value)}
					onChange={(e) => onChange("checkOutTime", e.target.value)}
					className='input input-bordered input-sm'
				/>
			</div>
		</>
	);
};

export default ReservationFields;
