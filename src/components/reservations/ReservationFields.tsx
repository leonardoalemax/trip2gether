import React from "react";
import type { DraftReservation } from "../../types";
import { TIMEZONE_OPTIONS } from "../tickets/timezoneOptions";

interface ReservationFieldsProps {
	values: Partial<DraftReservation> | DraftReservation;
	onChange: (field: keyof DraftReservation, value: string) => void;
	onBlur?: (field: keyof DraftReservation, value: string) => void;
	tripMembers?: string[];
}

const ReservationFields: React.FC<ReservationFieldsProps> = ({
	values,
	onChange,
	onBlur,
	tripMembers = [],
}) => {
	return (
		<>
			{/* Hotel Information Section */}
			<div className='col-span-2 space-y-4'>
				<h3 className='text-sm font-semibold text-base-content/80 flex items-center gap-2'>
					<span className='text-lg'>🏨</span> Informações do Hotel
				</h3>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div className='form-control'>
						<label className='label py-1 px-0'>
							<span className='label-text text-xs font-semibold text-base-content/70'>
								Cidade
							</span>
						</label>
						<input
							type='text'
							placeholder='Ex: Tóquio'
							value={values.city || ""}
							onBlur={(e) => onBlur?.("city", e.target.value)}
							onChange={(e) => onChange("city", e.target.value)}
							className='input input-bordered input-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30'
						/>
					</div>

					<div className='form-control'>
						<label className='label py-1 px-0'>
							<span className='label-text text-xs font-semibold text-base-content/70'>
								Hotel
							</span>
						</label>
						<input
							type='text'
							placeholder='Ex: Shinjuku Hotel'
							value={values.hotelName || ""}
							onBlur={(e) =>
								onBlur?.("hotelName", e.target.value)
							}
							onChange={(e) =>
								onChange("hotelName", e.target.value)
							}
							className='input input-bordered input-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30'
						/>
					</div>

					<div className='form-control md:col-span-2'>
						<label className='label py-1 px-0'>
							<span className='label-text text-xs font-semibold text-base-content/70'>
								Endereço do Hotel
							</span>
						</label>
						<input
							type='text'
							placeholder='Ex: Rua Principal, 123'
							value={values.hotelAddress || ""}
							onBlur={(e) =>
								onBlur?.("hotelAddress", e.target.value)
							}
							onChange={(e) =>
								onChange("hotelAddress", e.target.value)
							}
							className='input input-bordered input-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30'
						/>
					</div>

					<div className='form-control md:col-span-2'>
						<label className='label py-1 px-0'>
							<span className='label-text text-xs font-semibold text-base-content/70'>
								Link da Reserva
							</span>
						</label>
						<input
							type='url'
							placeholder='Ex: https://booking.com/reservation/123'
							value={values.reservationLink || ""}
							onBlur={(e) =>
								onBlur?.("reservationLink", e.target.value)
							}
							onChange={(e) =>
								onChange("reservationLink", e.target.value)
							}
							className='input input-bordered input-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30'
						/>
					</div>
				</div>
			</div>

			{/* Payment & Reservation Section */}
			<div className='col-span-2 space-y-4'>
				<h3 className='text-sm font-semibold text-base-content/80 flex items-center gap-2'>
					<span className='text-lg'>💳</span> Pagamento e Reservante
				</h3>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div className='form-control'>
						<label className='label py-1 px-0'>
							<span className='label-text text-xs font-semibold text-base-content/70'>
								Valor da Reserva
							</span>
						</label>
						<input
							type='text'
							placeholder='Ex: R$ 500,00 ou 500'
							value={values.reservationValue || ""}
							onBlur={(e) =>
								onBlur?.("reservationValue", e.target.value)
							}
							onChange={(e) =>
								onChange("reservationValue", e.target.value)
							}
							className='input input-bordered input-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30'
						/>
					</div>

					<div className='form-control'>
						<label className='label py-1 px-0'>
							<span className='label-text text-xs font-semibold text-base-content/70'>
								Reservado por
							</span>
						</label>
						<select
							value={values.reservedByEmail || ""}
							onChange={(e) =>
								onChange("reservedByEmail", e.target.value)
							}
							onBlur={(e) =>
								onBlur?.("reservedByEmail", e.target.value)
							}
							className='select select-bordered select-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30'>
							<option value=''>Selecione um membro</option>
							{tripMembers.map((email) => (
								<option key={email} value={email}>
									{email}
								</option>
							))}
						</select>
					</div>

					<div className='form-control md:col-span-2'>
						<label className='label py-1 px-0'>
							<span className='label-text text-xs font-semibold text-base-content/70'>
								Tipo de Pagamento
							</span>
						</label>
						<select
							value={values.paymentType || ""}
							onChange={(e) =>
								onChange("paymentType", e.target.value)
							}
							onBlur={(e) =>
								onBlur?.("paymentType", e.target.value)
							}
							className='select select-bordered select-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30'>
							<option value=''>Selecione</option>
							<option value='pagar_na_hora'>Pagar na hora</option>
							<option value='pago_pelo_reservante'>
								Pago pelo reservante
							</option>
						</select>
					</div>

					{values.paymentType === "pago_pelo_reservante" && (
						<div className='form-control md:col-span-2'>
							<label className='label py-1 px-0'>
								<span className='label-text text-xs font-semibold text-base-content/70'>
									Data de Vencimento
								</span>
							</label>
							<input
								type='date'
								value={values.paymentDueDate || ""}
								onBlur={(e) =>
									onBlur?.("paymentDueDate", e.target.value)
								}
								onChange={(e) =>
									onChange("paymentDueDate", e.target.value)
								}
								className='input input-bordered input-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30'
							/>
						</div>
					)}
				</div>
			</div>

			{/* Duration & Details Section */}
			<div className='col-span-2 space-y-4'>
				<h3 className='text-sm font-semibold text-base-content/80 flex items-center gap-2'>
					<span className='text-lg'>📅</span> Datas e Horários
				</h3>
				<div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
					<div className='form-control'>
						<label className='label py-1 px-0'>
							<span className='label-text text-xs font-semibold text-base-content/70'>
								Check-in
							</span>
						</label>
						<input
							type='date'
							value={values.checkInDate || ""}
							onBlur={(e) =>
								onBlur?.("checkInDate", e.target.value)
							}
							onChange={(e) =>
								onChange("checkInDate", e.target.value)
							}
							className='input input-bordered input-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30'
						/>
					</div>

					<div className='form-control'>
						<label className='label py-1 px-0'>
							<span className='label-text text-xs font-semibold text-base-content/70'>
								Hora
							</span>
						</label>
						<input
							type='time'
							value={values.checkInTime || ""}
							onBlur={(e) =>
								onBlur?.("checkInTime", e.target.value)
							}
							onChange={(e) =>
								onChange("checkInTime", e.target.value)
							}
							className='input input-bordered input-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30'
						/>
					</div>

					<div className='form-control'>
						<label className='label py-1 px-0'>
							<span className='label-text text-xs font-semibold text-base-content/70'>
								Check-out
							</span>
						</label>
						<input
							type='date'
							value={values.checkOutDate || ""}
							onBlur={(e) =>
								onBlur?.("checkOutDate", e.target.value)
							}
							onChange={(e) =>
								onChange("checkOutDate", e.target.value)
							}
							className='input input-bordered input-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30'
						/>
					</div>

					<div className='form-control'>
						<label className='label py-1 px-0'>
							<span className='label-text text-xs font-semibold text-base-content/70'>
								Hora
							</span>
						</label>
						<input
							type='time'
							value={values.checkOutTime || ""}
							onBlur={(e) =>
								onBlur?.("checkOutTime", e.target.value)
							}
							onChange={(e) =>
								onChange("checkOutTime", e.target.value)
							}
							className='input input-bordered input-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30'
						/>
					</div>
				</div>
			</div>

			{/* Settings Section */}
			<div className='col-span-2 space-y-4'>
				<h3 className='text-sm font-semibold text-base-content/80 flex items-center gap-2'>
					<span className='text-lg'>⚙️</span> Configurações
				</h3>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div className='form-control'>
						<label className='label py-1 px-0'>
							<span className='label-text text-xs font-semibold text-base-content/70'>
								Timezone
							</span>
						</label>
						<select
							value={values.timezone || ""}
							onChange={(e) =>
								onChange("timezone", e.target.value)
							}
							onBlur={(e) => onBlur?.("timezone", e.target.value)}
							className='select select-bordered select-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30'>
							<option value=''>Selecione</option>
							{TIMEZONE_OPTIONS.map((tz) => (
								<option key={tz.value} value={tz.value}>
									{tz.label}
								</option>
							))}
						</select>
					</div>

					<div className='form-control'>
						<label className='label py-1 px-0'>
							<span className='label-text text-xs font-semibold text-base-content/70'>
								Cor da Reserva
							</span>
						</label>
						<div className='flex items-center gap-2'>
							<input
								type='color'
								value={values.color || "#bfdbfe"}
								onChange={(e) =>
									onChange("color", e.target.value)
								}
								onBlur={(e) =>
									onBlur?.("color", e.target.value)
								}
								className='input input-bordered input-sm h-10 w-16 p-1 rounded-lg cursor-pointer'
							/>
							<input
								type='text'
								value={values.color || "#bfdbfe"}
								onChange={(e) =>
									onChange("color", e.target.value)
								}
								onBlur={(e) =>
									onBlur?.("color", e.target.value)
								}
								placeholder='#bfdbfe'
								className='input input-bordered input-sm rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-primary/30'
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ReservationFields;
