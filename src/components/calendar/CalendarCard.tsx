import React from "react";
import { useTripContext } from "../../context/TripContext";
import CalendarLegend from "./CalendarLegend";
import CalendarDayView from "./CalendarDayView";
import CalendarWeek from "./CalendarWeek";
import { useCalendarTickets } from "./hooks/useCalendarTickets";
import { useCalendarTimezone } from "./hooks/useCalendarTimezone";
import { useReservationMoments } from "./hooks/useReservationMoments";
import { usePasseioMoments } from "./hooks/usePasseioMoments";
import { useTicketMoments } from "./hooks/useTicketMoments";
import { useCalendarWeeks } from "./hooks/useCalendarWeeks";
import { useReservations } from "../../hooks/useReservations";
import { usePasseios } from "../../hooks/usePasseios";
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
	const { ticketMoments, ticketMomentsBySlot } = useTicketMoments(
		tickets,
		selectedTimezone,
	);
	const {
		reservationMoments,
		reservationMomentsBySlot,
		reservationColorByDateSlot,
	} = useReservationMoments(reservations, selectedTimezone);
	const {
		passeioMoments,
		passeioMomentsBySlot,
		passeioColorByDateSlot,
	} = usePasseioMoments(passeios, selectedTimezone);
	const { weeks, startDate, endDate } = useCalendarWeeks(
		ticketMoments,
		reservationMoments,
		passeioMoments,
	);
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

	if (
		activeTripLoading ||
		ticketsLoading ||
		reservationsLoading ||
		passeiosLoading
	) {
		return (
			<div
				className='card border border-base-200 shadow-[0_1px_2px_rgba(15,23,42,0.08)]'
				style={{ backgroundColor: "rgba(255,255,255,0.4)" }}>
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
		<div>
			{/* Legenda: sticky full-width no mobile, estática no desktop */}
			<div className='sticky top-0 z-20 -mx-4 lg:-mx-6 px-4 lg:px-6 pt-4 lg:pt-6 pb-3 bg-base-100/95 backdrop-blur border-b border-base-200 mb-4 md:static md:mx-0 md:px-0 md:pt-4 md:lg:pt-6 md:pb-0 md:bg-transparent md:backdrop-blur-none md:border-b-0 md:mb-4'>
				<CalendarLegend
					reservations={reservations}
					passeios={passeios}
					availableTimezones={availableTimezones}
					selectedTimezone={selectedTimezone}
					onTimezoneChange={setSelectedTimezone}
				/>
			</div>

			<div
				className='card border border-base-200 shadow-[0_1px_2px_rgba(15,23,42,0.08)]'
				style={{ backgroundColor: "rgba(255,255,255,0.4)" }}>
				<div className='card-body p-4 gap-4'>
					{selectedDayIso ? (
						<CalendarDayView
							dayIso={selectedDayIso}
							allDayIsos={allDayIsos}
							ticketMomentsBySlot={ticketMomentsBySlot}
							reservationMomentsBySlot={reservationMomentsBySlot}
							reservationColorByDateSlot={
								reservationColorByDateSlot
							}
							passeioMomentsBySlot={passeioMomentsBySlot}
							passeioColorByDateSlot={passeioColorByDateSlot}
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
									tripStart={startDate ?? undefined}
									tripEnd={endDate ?? undefined}
									ticketMomentsBySlot={ticketMomentsBySlot}
									reservationMomentsBySlot={
										reservationMomentsBySlot
									}
									reservationColorByDateSlot={
										reservationColorByDateSlot
									}
									passeioMomentsBySlot={passeioMomentsBySlot}
									passeioColorByDateSlot={
										passeioColorByDateSlot
									}
									onDayHeaderClick={setSelectedDayIso}
								/>
							))}
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
}
