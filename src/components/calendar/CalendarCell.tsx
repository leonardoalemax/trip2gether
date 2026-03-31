import React from "react";
import { SlotType } from "@/types";
import { ReservationMoment } from "./types/ReservationMoment";
import { TicketMoment } from "./types/TicketMoment";
import { darkenHex } from "./utils/styleUtils";

interface CalendarCellProps {
	iso: string;
	slot: SlotType;
	ticketList: TicketMoment[];
	reservationList: ReservationMoment[];
	reservationDayColor: string | undefined;
}

export default function CalendarCell({
	iso,
	slot,
	ticketList,
	reservationList,
	reservationDayColor,
}: CalendarCellProps) {
	void iso;
	void slot;
	const baseCellBackground = reservationDayColor
		? `${reservationDayColor}33`
		: undefined;

	if (ticketList.length > 0 || reservationList.length > 0) {
		const fallbackInnerBg = reservationDayColor
			? `${reservationDayColor}66`
			: "#f9fafb";
		const fallbackInnerText = reservationDayColor
			? darkenHex(reservationDayColor, 0.55)
			: "#374151";

		return (
			<td
				style={{
					padding: 3,
					verticalAlign: "top",
					borderLeft: "1px solid #f3f4f6",
					minWidth: 78,
					background: baseCellBackground,
				}}>
				<div
					style={{
						borderRadius: 7,
						padding: "5px 7px",
						minHeight: 34,
						background: fallbackInnerBg,
						color: fallbackInnerText,
					}}>
					{ticketList.map((ticketMoment) => (
						<div
							key={ticketMoment.id}
							style={{
								marginTop: 2,
								borderRadius: 4,
								padding: "2px 5px",
								fontSize: 9,
								fontWeight: 700,
								background: "#e5e7eb",
								color: "#374151",
							}}>
							{ticketMoment.kind === "departure" ? "↑" : "↓"}{" "}
							{ticketMoment.time} {ticketMoment.label}
						</div>
					))}
					{reservationList.map((reservationMoment) => (
						<div
							key={reservationMoment.id}
							style={{
								marginTop: 2,
								borderRadius: 4,
								padding: "2px 5px",
								fontSize: 9,
								fontWeight: 700,
								background: "#ffedd5",
								color: "#9a3412",
							}}>
							{reservationMoment.kind === "checkin" ? "↓" : "↑"}{" "}
							{reservationMoment.time} {reservationMoment.label}
						</div>
					))}
				</div>
			</td>
		);
	}

	return (
		<td
			style={{
				padding: 3,
				verticalAlign: "top",
				borderLeft: "1px solid #f3f4f6",
				minWidth: 78,
				background: baseCellBackground,
			}}>
			<div
				style={{
					minHeight: 34,
				}}
			/>
		</td>
	);
}
