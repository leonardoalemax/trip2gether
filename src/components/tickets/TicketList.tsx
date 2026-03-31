import React from "react";
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
	return (
		<div className='space-y-3'>
			{tickets.map((ticket, i) => (
				<div
					key={ticket.id}
					className='p-4 border border-base-200 rounded-xl space-y-3 bg-base-100'>
					<div className='flex items-center justify-between'>
						<span className='text-sm font-semibold text-base-content/70'>
							Trecho {i + 1}
							{ticket.flightNumber
								? ` · ${ticket.flightNumber}`
								: ""}
						</span>
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
				</div>
			))}
		</div>
	);
};

export default TicketList;
