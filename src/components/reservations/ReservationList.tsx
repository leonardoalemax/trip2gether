import React from "react";
import type { Reservation, DraftReservation } from "../../types";
import ReservationFields from "./ReservationFields";

const isHexColor = (value: string | undefined): value is string =>
	!!value && /^#[0-9a-fA-F]{6}$/.test(value);

const hexToRgba = (hex: string, alpha: number) => {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface ReservationListProps {
	reservations: Reservation[];
	handleFieldUpdate: (
		reservation: Reservation,
		field: keyof DraftReservation,
		value: string,
	) => void;
	handleDelete: (reservationId: string) => void;
	setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
}

const ReservationList: React.FC<ReservationListProps> = ({
	reservations,
	handleFieldUpdate,
	handleDelete,
	setReservations,
}) => {
	return (
		<div className='space-y-4 w-full'>
			{reservations.map((reservation, i) =>
				(() => {
					const baseColor = isHexColor(reservation.color)
						? reservation.color
						: "#bfdbfe";

					return (
						<div
							key={reservation.id}
							className='w-full p-4 border rounded-xl space-y-4 shadow-[0_1px_2px_rgba(15,23,42,0.08)]'
							style={{
								backgroundColor: hexToRgba(baseColor, 0.4),
								borderColor: `${baseColor}55`,
							}}>
							<div className='flex items-start justify-between gap-3'>
								<div className='space-y-1'>
									<div className='flex items-center gap-2'>
										<span
											className='inline-block h-2.5 w-2.5 rounded-full'
											style={{
												backgroundColor: baseColor,
											}}
										/>
										<span className='text-sm font-semibold text-base-content/70'>
											Reserva {i + 1}
										</span>
									</div>
									<p className='text-sm font-medium text-base-content/90'>
										{reservation.hotelName ||
											"Hotel ainda não informado"}
									</p>
									<p className='text-xs text-base-content/70'>
										{reservation.city ||
											"Cidade não informada"}
									</p>
								</div>
								<button
									aria-label='Remover reserva'
									className='btn btn-ghost btn-xs btn-square text-error'
									onClick={() =>
										handleDelete(reservation.id)
									}>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className='h-4 w-4'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M3 7h18'
										/>
									</svg>
								</button>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
								<ReservationFields
									values={reservation}
									onChange={(field, value) =>
										setReservations((prev) =>
											prev.map((r) =>
												r.id === reservation.id
													? ({
															...r,
															[field]: value,
														} as Reservation)
													: r,
											),
										)
									}
									onBlur={(field, value) =>
										handleFieldUpdate(
											reservation,
											field,
											value,
										)
									}
								/>
							</div>
						</div>
					);
				})(),
			)}
		</div>
	);
};

export default ReservationList;
