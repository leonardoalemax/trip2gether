import React from "react";
import { SlotType } from "../../types";
import { ReservationMoment } from "./types/ReservationMoment";
import { TicketMoment } from "./types/TicketMoment";
import { PasseioMoment } from "./types/PasseioMoment";
import CalendarPasseioTag from "./CalendarPasseioTag";
import { SLOTS } from "./utils/slotUtils";
import { darkenHex } from "./utils/styleUtils";

interface CalendarDayViewProps {
	dayIso: string;
	allDayIsos: string[];
	ticketMomentsBySlot: Map<string, TicketMoment[]>;
	reservationMomentsBySlot: Map<string, ReservationMoment[]>;
	reservationColorByDateSlot: Map<string, string>;
	passeioMomentsBySlot: Map<string, PasseioMoment[]>;
	passeioColorByDateSlot: Map<string, string>;
	onSelectDay: (iso: string) => void;
	onClose: () => void;
}

function formatDayLabel(iso: string) {
	const dayDate = new Date(`${iso}T00:00:00`);
	if (isNaN(dayDate.getTime())) return iso;

	return dayDate.toLocaleDateString("pt-BR", {
		weekday: "long",
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
}

function renderMomentTag(
	moment: TicketMoment | ReservationMoment | PasseioMoment,
	kind: "ticket" | "reservation" | "passeio",
	dayColor?: string,
) {
	if (kind === "ticket") {
		const ticketMoment = moment as TicketMoment;
		return (
			<div
				key={ticketMoment.id}
				style={{
					marginTop: 4,
					borderRadius: 6,
					padding: "4px 6px",
					fontSize: 11,
					fontWeight: 700,
					background: "#e5e7eb",
					color: "#374151",
				}}>
				{ticketMoment.kind === "departure" ? "↑" : "↓"}{" "}
				{ticketMoment.time} {ticketMoment.label}
			</div>
		);
	}

	if (kind === "passeio") {
		const passeioMoment = moment as PasseioMoment;

		return (
			<CalendarPasseioTag
				key={passeioMoment.id}
				moment={passeioMoment}
				dayColor={dayColor}
				fontSize={11}
			/>
		);
	}

	const reservationMoment = moment as ReservationMoment;
	const reservationColor = dayColor ?? "#f97316";

	return (
		<div
			key={reservationMoment.id}
			style={{
				marginTop: 4,
				borderRadius: 6,
				padding: "4px 6px",
				fontSize: 11,
				fontWeight: 700,
				background: `${reservationColor}22`,
				color: darkenHex(reservationColor, 0.6),
			}}>
			{reservationMoment.kind === "checkin" ? "↓" : "↑"}{" "}
			{reservationMoment.time} {reservationMoment.label}
		</div>
	);
}

export default function CalendarDayView({
	dayIso,
	allDayIsos,
	ticketMomentsBySlot,
	reservationMomentsBySlot,
	reservationColorByDateSlot,
	passeioMomentsBySlot,
	passeioColorByDateSlot,
	onSelectDay,
	onClose,
}: CalendarDayViewProps) {
	const currentIndex = allDayIsos.indexOf(dayIso);
	const prevIso = currentIndex > 0 ? allDayIsos[currentIndex - 1] : undefined;
	const nextIso =
		currentIndex >= 0 && currentIndex < allDayIsos.length - 1
			? allDayIsos[currentIndex + 1]
			: undefined;

	return (
		<div className='rounded-lg border border-base-200 p-3 space-y-3'>
			<div className='flex items-center justify-between gap-2'>
				<div>
					<p className='text-[10px] uppercase tracking-wide text-base-content/50 font-semibold'>
						Visualizacao diaria
					</p>
					<h4 className='text-sm font-semibold capitalize'>
						{formatDayLabel(dayIso)}
					</h4>
				</div>
				<div className='flex items-center gap-1'>
					<button
						type='button'
						className='btn btn-ghost btn-xs'
						onClick={onClose}>
						Voltar
					</button>
					<button
						type='button'
						className='btn btn-ghost btn-xs'
						disabled={!prevIso}
						onClick={() => prevIso && onSelectDay(prevIso)}>
						Anterior
					</button>
					<button
						type='button'
						className='btn btn-ghost btn-xs'
						disabled={!nextIso}
						onClick={() => nextIso && onSelectDay(nextIso)}>
						Proximo
					</button>
				</div>
			</div>

			<div className='space-y-2'>
				{SLOTS.map((slot) => {
					const ticketList =
						ticketMomentsBySlot.get(`${dayIso}|${slot}`) ?? [];
					const reservationList =
						reservationMomentsBySlot.get(`${dayIso}|${slot}`) ?? [];
					const reservationDayColor = reservationColorByDateSlot.get(
						`${dayIso}|${slot}`,
					);
					const passeioList =
						passeioMomentsBySlot.get(`${dayIso}|${slot}`) ?? [];
					const passeioDayColor = passeioColorByDateSlot.get(
						`${dayIso}|${slot}`,
					);
					const hasItems =
						ticketList.length > 0 ||
						reservationList.length > 0 ||
						passeioList.length > 0;

					return (
						<div
							key={slot}
							className='rounded-md border border-base-200 overflow-hidden'>
							<div className='px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-base-content/60 bg-base-200/50'>
								{slot}
							</div>
							<div
								style={{
									padding: 8,
									background: reservationDayColor
										? `${reservationDayColor}22`
										: passeioDayColor
											? `${passeioDayColor}22`
											: "transparent",
								}}>
								{!hasItems ? (
									<p className='text-xs text-base-content/40'>
										Sem eventos
									</p>
								) : (
									<>
										{ticketList.map((item) =>
											renderMomentTag(
												item,
												"ticket",
												reservationDayColor,
											),
										)}
										{reservationList.map((item) =>
											renderMomentTag(
												item,
												"reservation",
												reservationDayColor,
											),
										)}
										{passeioList.map((item) =>
											renderMomentTag(
												item,
												"passeio",
												passeioDayColor,
											),
										)}
									</>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
