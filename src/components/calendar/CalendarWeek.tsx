import React from "react";
import { ReservationMoment } from "./types/ReservationMoment";
import { TicketMoment } from "./types/TicketMoment";
import CalendarCell from "./CalendarCell";
import { SLOTS, DAY_NAMES } from "./utils/slotUtils";
import { dstr, formatWeekLabel } from "./utils/dateUtils";

interface CalendarWeekProps {
	weekDays: Date[];
	weekIndex: number;
	ticketMomentsBySlot: Map<string, TicketMoment[]>;
	reservationMomentsBySlot: Map<string, ReservationMoment[]>;
	reservationColorByDateSlot: Map<string, string>;
}

export default function CalendarWeek({
	weekDays,
	weekIndex,
	ticketMomentsBySlot,
	reservationMomentsBySlot,
	reservationColorByDateSlot,
}: CalendarWeekProps) {
	return (
		<div>
			<p
				style={{
					fontSize: 10,
					textTransform: "uppercase",
					letterSpacing: "0.08em",
					color: "#9ca3af",
					fontWeight: 600,
					marginBottom: 8,
				}}>
				{formatWeekLabel(weekDays, weekIndex)}
			</p>
			<div
				style={{
					overflowX: "auto",
					borderRadius: 12,
					border: "1px solid #f3f4f6",
				}}>
				<table
					style={{
						width: "100%",
						tableLayout: "fixed",
						borderCollapse: "collapse",
						minWidth: 520,
					}}>
					<colgroup>
						<col style={{ width: 72 }} />
						{weekDays.map((day) => (
							<col
								key={dstr(day)}
								style={{ width: "calc((100% - 72px) / 7)" }}
							/>
						))}
					</colgroup>
					<thead>
						<tr style={{ background: "#f9fafb" }}>
							<th
								style={{
									width: 50,
									padding: "6px 8px",
								}}
							/>
							{weekDays.map((day) => {
								const iso = dstr(day);
								return (
									<th
										key={iso}
										style={{
											padding: "8px 4px",
											textAlign: "center",
											fontSize: 11,
											fontWeight: 600,
											background: "transparent",
											borderLeft: "1px solid #f3f4f6",
											color: "#374151",
										}}>
										{DAY_NAMES[day.getDay()]}
										<br />
										<span
											style={{
												fontSize: 14,
											}}>
											{day.getDate()}
										</span>
									</th>
								);
							})}
						</tr>
					</thead>
					<tbody>
						{SLOTS.map((slot) => (
							<tr
								key={slot}
								style={{
									borderTop: "1px solid #f3f4f6",
								}}>
								<td
									style={{
										padding: "6px 8px",
										fontSize: 10,
										color: "#9ca3af",
										fontWeight: 500,
										whiteSpace: "nowrap",
										background: "#fafafa",
										verticalAlign: "middle",
									}}>
									{slot}
								</td>
								{weekDays.map((day) => {
									const iso = dstr(day);
									const ticketList =
										ticketMomentsBySlot.get(
											`${iso}|${slot}`,
										) ?? [];
									const reservationList =
										reservationMomentsBySlot.get(
											`${iso}|${slot}`,
										) ?? [];
									const reservationDayColor =
										reservationColorByDateSlot.get(
											`${iso}|${slot}`,
										);

									return (
										<CalendarCell
											key={iso}
											iso={iso}
											slot={slot}
											ticketList={ticketList}
											reservationList={reservationList}
											reservationDayColor={
												reservationDayColor
											}
										/>
									);
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
