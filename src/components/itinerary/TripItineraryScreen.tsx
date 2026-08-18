import React from "react";
import { useTripContext } from "../../context/TripContext";
import { useReservations } from "../../hooks/useReservations";
import { usePasseios } from "../../hooks/usePasseios";
import { useCalendarTickets } from "../calendar/hooks/useCalendarTickets";
import { useCalendarTimezone } from "../calendar/hooks/useCalendarTimezone";
import { useTicketMoments } from "../calendar/hooks/useTicketMoments";
import { useReservationMoments } from "../calendar/hooks/useReservationMoments";
import { usePasseioMoments } from "../calendar/hooks/usePasseioMoments";
import { useCalendarWeeks } from "../calendar/hooks/useCalendarWeeks";
import { useTripAgenda } from "./hooks/useTripAgenda";
import AgendaDayList from "./AgendaDayList";

export default function TripItineraryScreen() {
	const { activeTrip, loading: activeTripLoading } = useTripContext();

	const { tickets, ticketsLoading } = useCalendarTickets({
		activeTrip,
		activeTripLoading,
	});
	const { reservations, reservationsLoading } = useReservations({
		tripId: activeTrip?.id,
		enabled: !activeTripLoading,
	});
	const { passeios, passeiosLoading } = usePasseios({
		tripId: activeTrip?.id,
		enabled: !activeTripLoading,
	});

	const { availableTimezones, selectedTimezone, setSelectedTimezone } =
		useCalendarTimezone(
			tickets,
			reservations,
			passeios,
			activeTrip?.defaultTimezone,
		);
	const { ticketMoments } = useTicketMoments(tickets, selectedTimezone);
	const { reservationMoments } = useReservationMoments(
		reservations,
		selectedTimezone,
	);
	const { passeioMoments } = usePasseioMoments(passeios, selectedTimezone);
	const { startDate, endDate } = useCalendarWeeks(
		ticketMoments,
		reservationMoments,
		passeioMoments,
	);

	const days = useTripAgenda(
		ticketMoments,
		reservationMoments,
		passeioMoments,
		startDate,
		endDate,
	);

	if (!activeTrip) {
		return (
			<div className='p-6 text-base-content/50 text-sm'>
				Selecione uma viagem para ver o itinerário.
			</div>
		);
	}

	if (
		activeTripLoading ||
		ticketsLoading ||
		reservationsLoading ||
		passeiosLoading
	) {
		return (
			<div className='p-6 flex justify-center'>
				<span className='loading loading-spinner loading-lg' />
			</div>
		);
	}

	const freeDays = days.filter((day) => day.free).length;

	return (
		<div className='p-4 space-y-4 max-w-3xl mx-auto'>
			<div className='flex flex-wrap items-end justify-between gap-3'>
				<div>
					<h2 className='text-xl font-bold'>Itinerário</h2>
					<p className='text-xs text-base-content/60'>
						{days.length > 0
							? `${days.length} dia${days.length === 1 ? "" : "s"} · ${freeDays} ainda ${freeDays === 1 ? "livre" : "livres"}`
							: "Sem nada marcado ainda"}
					</p>
				</div>
				<div className='flex items-center gap-2'>
					<span className='text-[11px] text-base-content/60'>
						Horários em
					</span>
					<select
						className='select select-bordered select-xs'
						value={selectedTimezone}
						onChange={(e) => setSelectedTimezone(e.target.value)}
						disabled={availableTimezones.length === 0}>
						{availableTimezones.length === 0 ? (
							<option value=''>Sem fuso definido</option>
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

			{days.length === 0 && (
				<p className='text-sm text-base-content/50'>
					Cadastre passagens, reservas ou passeios para montar o
					itinerário.
				</p>
			)}

			<AgendaDayList days={days} />
		</div>
	);
}
