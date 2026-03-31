import React from "react";
import { useTripContext } from "../../context/TripContext";
import CalendarLegend from "./CalendarLegend";
import CalendarDayView from "./CalendarDayView";
import CalendarWeek from "./CalendarWeek";
import { useCalendarTickets } from "./hooks/useCalendarTickets";
import { useCalendarTimezone } from "./hooks/useCalendarTimezone";
import { useReservationMoments } from "./hooks/useReservationMoments";
import { useTicketMoments } from "./hooks/useTicketMoments";
import { useCalendarWeeks } from "./hooks/useCalendarWeeks";
import { useReservations } from "../../hooks/useReservations";
import { dstr } from "./utils/dateUtils";

export default function CalendarCard() {
	const { activeTrip, loading: activeTripLoading } = useTripContext();

	const { tickets, ticketsLoading } = useCalendarTickets({
		activeTrip,
		activeTripLoading,
	});
	const { reservations, reservationsLoading } = useReservations({
		tripId: activeTrip?.id,
		enabled: !activeTripLoading,
	});
	const { availableTimezones, selectedTimezone, setSelectedTimezone } =
		useCalendarTimezone(tickets, reservations, activeTrip?.defaultTimezone);
	const { ticketMoments, ticketMomentsBySlot } = useTicketMoments(
		tickets,
		selectedTimezone,
	);
	const {
		reservationMoments,
		reservationMomentsBySlot,
		reservationColorByDateSlot,
	} = useReservationMoments(reservations, selectedTimezone);
	const { weeks } = useCalendarWeeks(ticketMoments, reservationMoments);
	const [selectedDayIso, setSelectedDayIso] = React.useState<string | null>(
		null,
	);

	const allDayIsos = React.useMemo(
		() => weeks.flat().map((day) => dstr(day)),
		[weeks],
	);

	React.useEffect(() => {
		if (!selectedDayIso) return;

		if (!allDayIsos.includes(selectedDayIso)) {
			setSelectedDayIso(null);
		}
	}, [allDayIsos, selectedDayIso]);

	if (activeTripLoading || ticketsLoading || reservationsLoading) {
		return (
			<div className='card bg-base-100 border border-base-200 shadow-sm'>
				<div className='card-body p-4'>
					<div className='flex items-center gap-3 text-sm text-base-content/60'>
						<span className='loading loading-spinner loading-sm' />
						Carregando calendario...
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='card bg-base-100 border border-base-200 shadow-sm'>
			<div className='card-body p-4 gap-4'>
				<CalendarLegend
					reservations={reservations}
					availableTimezones={availableTimezones}
					selectedTimezone={selectedTimezone}
					onTimezoneChange={setSelectedTimezone}
				/>
				{selectedDayIso ? (
					<CalendarDayView
						dayIso={selectedDayIso}
						allDayIsos={allDayIsos}
						ticketMomentsBySlot={ticketMomentsBySlot}
						reservationMomentsBySlot={reservationMomentsBySlot}
						reservationColorByDateSlot={reservationColorByDateSlot}
						onSelectDay={setSelectedDayIso}
						onClose={() => setSelectedDayIso(null)}
					/>
				) : null}

				{/* Calendar weeks */}
				{weeks.length === 0 ? (
					<div className='rounded-lg border border-base-200 p-4 text-sm text-base-content/60'>
						Nenhum dado de calendario para exibir.
					</div>
				) : !selectedDayIso ? (
					<div className='space-y-6'>
						{weeks.map((wDays, wi) => (
							<CalendarWeek
								key={wi}
								weekDays={wDays}
								weekIndex={wi}
								ticketMomentsBySlot={ticketMomentsBySlot}
								reservationMomentsBySlot={
									reservationMomentsBySlot
								}
								reservationColorByDateSlot={
									reservationColorByDateSlot
								}
								onDayHeaderClick={setSelectedDayIso}
							/>
						))}
					</div>
				) : null}
			</div>
		</div>
	);
}
