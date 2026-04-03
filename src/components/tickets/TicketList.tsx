import React, { useState } from "react";
import type { Ticket, DraftTicket } from "../../types";
import TicketFields from "./TicketFields";

interface TicketListProps {
	tickets: Ticket[];
	handleFieldUpdate: (
		ticket: Ticket,
		field: keyof DraftTicket,
		value: string,
	) => void;
	handleDelete: (ticketId: string) => void;
	setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
}

const TicketList: React.FC<TicketListProps> = ({
	tickets,
	handleFieldUpdate,
	handleDelete,
	setTickets,
}) => {
	const [expandedTicketIds, setExpandedTicketIds] = useState<string[]>([]);

	const toggleExpanded = (ticketId: string) => {
		setExpandedTicketIds((prev) =>
			prev.includes(ticketId)
				? prev.filter((id) => id !== ticketId)
				: [...prev, ticketId],
		);
	};

	return (
		<div className='space-y-3 w-full'>
			{tickets.map((ticket, i) => {
				const isExpanded = expandedTicketIds.includes(ticket.id);
				return (
					<div
						key={ticket.id}
						className='w-full p-4 border border-base-200 rounded-xl space-y-3 shadow-[0_1px_2px_rgba(15,23,42,0.08)]'
						style={{ backgroundColor: "rgba(255, 255, 255, 0.4)" }}>
						<div className='flex items-start justify-between gap-3'>
							<div className='space-y-1'>
								<span className='text-sm font-semibold text-base-content/70'>
									Trecho {i + 1}
									{ticket.flightNumber
										? ` · ${ticket.flightNumber}`
										: ""}
								</span>
								<p className='text-sm font-medium text-base-content/90'>
									{ticket.departureAirport || "Origem"} →{" "}
									{ticket.arrivalAirport || "Destino"}
								</p>
								{ticket.airlineName && (
									<p className='text-xs text-base-content/70'>
										✈️ {ticket.airlineName}
									</p>
								)}
								{ticket.departureDate && (
									<p className='text-xs text-base-content/70'>
										📅{" "}
										{new Date(
											ticket.departureDate,
										).toLocaleDateString("pt-BR")}
										{ticket.departureTime
											? ` às ${ticket.departureTime}`
											: ""}
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
									onClick={() => toggleExpanded(ticket.id)}>
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
									aria-label='Remover trecho'
									className='btn btn-ghost btn-xs btn-square text-error'
									onClick={() => handleDelete(ticket.id)}>
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
							<div className='grid grid-cols-2 gap-2'>
								<TicketFields
									values={ticket}
									onChange={(field, value) =>
										setTickets((prev) =>
											prev.map((t) =>
												t.id === ticket.id
													? ({
															...t,
															[field]: value,
														} as Ticket)
													: t,
											),
										)
									}
									onBlur={(field, value) =>
										handleFieldUpdate(ticket, field, value)
									}
								/>
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};

export default TicketList;
