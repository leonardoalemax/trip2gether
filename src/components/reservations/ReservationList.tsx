import React from "react";
import type { Reservation, DraftReservation } from "../../types";
import ReservationFields from "./ReservationFields";

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
		<div className='space-y-3'>
			{reservations.map((reservation, i) => (
				<div
					key={reservation.id}
					className='p-4 border border-base-200 rounded-xl space-y-3 bg-base-100'>
					<div className='flex items-center justify-between'>
						<span className='text-sm font-semibold text-base-content/70'>
							Reserva {i + 1}
							{reservation.hotelName
								? ` · ${reservation.hotelName}`
								: ""}
						</span>
						<button
							aria-label='Remover reserva'
							className='btn btn-ghost btn-xs btn-square text-error'
							onClick={() => handleDelete(reservation.id)}>
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
					<div className='grid grid-cols-2 gap-2'>
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
								handleFieldUpdate(reservation, field, value)
							}
						/>
					</div>
				</div>
			))}
		</div>
	);
};

export default ReservationList;
