import React, { useState } from "react";
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
	tripMembers?: string[];
}

const ReservationList: React.FC<ReservationListProps> = ({
	reservations,
	handleFieldUpdate,
	handleDelete,
	setReservations,
	tripMembers = [],
}) => {
	const [expandedReservationIds, setExpandedReservationIds] = useState<
		string[]
	>([]);

	const toggleExpanded = (reservationId: string) => {
		setExpandedReservationIds((prev) =>
			prev.includes(reservationId)
				? prev.filter((id) => id !== reservationId)
				: [...prev, reservationId],
		);
	};

	return (
		<div className='space-y-4 w-full'>
			{reservations.map((reservation, i) =>
				(() => {
					const baseColor = isHexColor(reservation.color)
						? reservation.color
						: "#bfdbfe";
					const isExpanded = expandedReservationIds.includes(
						reservation.id,
					);

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
									{reservation.hotelAddress && (
										<p className='text-xs text-base-content/60'>
											📍 {reservation.hotelAddress}
										</p>
									)}{" "}
									{reservation.reservationLink && (
										<p className='text-xs text-primary/80 hover:text-primary'>
											<a
												href={
													reservation.reservationLink
												}
												target='_blank'
												rel='noopener noreferrer'
												className='underline'>
												🔗 Ver reserva
											</a>
										</p>
									)}{" "}
									<p className='text-xs text-base-content/70'>
										{reservation.city ||
											"Cidade não informada"}
									</p>
									{reservation.reservationValue && (
										<p className='text-xs font-semibold text-base-content/80'>
											💰 {reservation.reservationValue}
										</p>
									)}
									{reservation.reservedByEmail && (
										<p className='text-xs text-base-content/70'>
											👤 Reservado por:{" "}
											{reservation.reservedByEmail}
										</p>
									)}
									{reservation.paymentType && (
										<p className='text-xs text-base-content/70'>
											{reservation.paymentType ===
											"pagar_na_hora"
												? "💳 Pagar na hora"
												: "✅ Pago pelo reservante"}
										</p>
									)}
									{reservation.paymentType ===
										"pago_pelo_reservante" &&
										reservation.signalAmount && (
											<p className='text-xs text-base-content/70'>
												💸 Sinal:{" "}
												{reservation.signalAmount}
											</p>
										)}
									{reservation.paymentType ===
										"pago_pelo_reservante" &&
										reservation.paymentDueDate && (
											<p className='text-xs text-base-content/70'>
												📅 Vencimento:{" "}
												{new Date(
													reservation.paymentDueDate,
												).toLocaleDateString("pt-BR")}
											</p>
										)}
									{reservation.createdByEmail && (
										<p className='text-xs text-base-content/50 pt-1'>
											Criado por:{" "}
											{reservation.createdByEmail}
										</p>
									)}
								</div>
								<div className='flex items-center gap-1'>
									<button
										type='button'
										className='btn btn-ghost btn-xs btn-square'
										aria-label={
											isExpanded ? "Recolher" : "Expandir"
										}
										onClick={() =>
											toggleExpanded(reservation.id)
										}>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											className='size-4'
											viewBox='0 0 24 24'
											fill='none'
											stroke='currentColor'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'>
											{isExpanded ? (
												<polyline points='18 15 12 9 6 15' />
											) : (
												<polyline points='6 9 12 15 18 9' />
											)}
										</svg>
									</button>
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
							</div>
							{isExpanded && (
								<div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
									<ReservationFields
										values={reservation}
										onChange={(
											field: keyof DraftReservation,
											value: string,
										) =>
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
										onBlur={(
											field: keyof DraftReservation,
											value: string,
										) =>
											handleFieldUpdate(
												reservation,
												field,
												value,
											)
										}
										tripMembers={tripMembers}
									/>
								</div>
							)}
						</div>
					);
				})(),
			)}
		</div>
	);
};

export default ReservationList;
