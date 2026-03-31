import React, { useCallback, useEffect, useState } from "react";
import { useTripContext } from "../../context/TripContext";
import {
	createTicket,
	deleteTicket,
	getTickets,
	updateTicket,
} from "../../services/ticketService";
import type { Ticket, DraftTicket } from "../../types";
import TicketForm from "./TicketForm";
import TicketList from "./TicketList";

const emptyDraft = (): DraftTicket => ({
	airlineName: "",
	flightNumber: "",
	departureAirport: "",
	arrivalAirport: "",
	departureDate: "",
	departureTime: "",
	departureTimezone: "",
	arrivalDate: "",
	arrivalTime: "",
	arrivalTimezone: "",
});

const TicketsScreen: React.FC = () => {
	const { activeTrip } = useTripContext();
	const [tickets, setTickets] = useState<Ticket[]>([]);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [draft, setDraft] = useState<DraftTicket | null>(null);

	const fetchTickets = useCallback(async () => {
		if (!activeTrip) return;
		setLoading(true);
		try {
			const data = await getTickets(activeTrip.id);
			setTickets(data);
		} finally {
			setLoading(false);
		}
	}, [activeTrip]);

	useEffect(() => {
		fetchTickets();
	}, [fetchTickets]);

	const handleAdd = async () => {
		if (!activeTrip || !draft) return;
		setSaving(true);
		try {
			const ticket = await createTicket(activeTrip.id, draft);
			setTickets((prev) => [...prev, ticket]);
			setDraft(null);
		} finally {
			setSaving(false);
		}
	};

	const handleFieldUpdate = async (
		ticket: Ticket,
		field: keyof DraftTicket,
		value: string,
	) => {
		if (!activeTrip) return;
		setTickets((prev) =>
			prev.map((t) =>
				t.id === ticket.id ? { ...t, [field]: value } : t,
			),
		);
		await updateTicket(activeTrip.id, ticket.id, { [field]: value });
	};

	const handleDelete = async (ticketId: string) => {
		if (!activeTrip) return;
		setTickets((prev) => prev.filter((t) => t.id !== ticketId));
		await deleteTicket(activeTrip.id, ticketId);
	};

	if (!activeTrip) {
		return (
			<div className='p-6 text-base-content/50 text-sm'>
				Selecione uma viagem para ver as passagens aéreas.
			</div>
		);
	}

	return (
		<div className='p-4 space-y-4 max-w-2xl mx-auto'>
			<div className='flex items-center justify-between'>
				<h2 className='text-xl font-bold'>Passagens Aéreas</h2>
				{!draft && (
					<button
						className='btn btn-primary btn-sm'
						onClick={() => setDraft(emptyDraft())}>
						+ Nova passagem
					</button>
				)}
			</div>

			{loading && (
				<div className='flex justify-center py-8'>
					<span className='loading loading-spinner loading-md' />
				</div>
			)}

			{!loading && tickets.length === 0 && !draft && (
				<p className='text-sm text-base-content/50'>
					Nenhuma passagem cadastrada.
				</p>
			)}

			<TicketForm
				draft={draft}
				setDraft={setDraft}
				handleAdd={handleAdd}
				saving={saving}
			/>

			<TicketList
				tickets={tickets}
				handleFieldUpdate={handleFieldUpdate}
				handleDelete={handleDelete}
				setTickets={setTickets}
			/>
		</div>
	);
};

export default TicketsScreen;
