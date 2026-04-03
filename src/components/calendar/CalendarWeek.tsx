import React from "react";
import { ReservationMoment } from "./types/ReservationMoment";
import { TicketMoment } from "./types/TicketMoment";
import CalendarCell from "./CalendarCell";
import { SLOTS, DAY_NAMES } from "./utils/slotUtils";
import { dstr, formatWeekLabel } from "./utils/dateUtils";
import { darkenHex } from "./utils/styleUtils";

interface CalendarWeekProps {
	weekDays: Date[];
	weekIndex: number;
	tripStart?: Date | undefined;
	tripEnd?: Date | undefined;
	ticketMomentsBySlot: Map<string, TicketMoment[]>;
	reservationMomentsBySlot: Map<string, ReservationMoment[]>;
	reservationColorByDateSlot: Map<string, string>;
	onDayHeaderClick?: (iso: string) => void;
}

export default function CalendarWeek({
	weekDays,
	weekIndex,
	tripStart,
	tripEnd,
	ticketMomentsBySlot,
	reservationMomentsBySlot,
	reservationColorByDateSlot,
	onDayHeaderClick,
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
			<div className='md:hidden space-y-2'>
				{weekDays.map((day) => {
					const iso = dstr(day);
					const isPadding =
						(tripStart && day < tripStart) ||
						(tripEnd && day > tripEnd);
					if (isPadding) return null;
					return (
						<div
							key={iso}
							className='rounded-lg border border-base-200 overflow-hidden'>
							<button
								type='button'
								onClick={() => onDayHeaderClick?.(iso)}
								className='w-full px-3 py-2 text-left bg-base-200/50 border-b border-base-200'
								style={{
									cursor: onDayHeaderClick
										? "pointer"
										: "default",
								}}>
								<p className='text-[11px] font-semibold text-base-content/70'>
									{DAY_NAMES[day.getDay()]}
								</p>
								<p className='text-sm font-bold text-base-content'>
									{day.getDate()}
								</p>
							</button>

							<div className='divide-y divide-base-200'>
								{SLOTS.map((slot) => {
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
									const bg = reservationDayColor
										? `${reservationDayColor}22`
										: "transparent";

									return (
										<div
											key={slot}
											className='grid grid-cols-[70px,1fr] gap-2 px-2 py-2'
											style={{ background: bg }}>
											<div className='text-[10px] uppercase tracking-wide text-base-content/50 font-semibold pt-0.5'>
												{slot}
											</div>
											<div>
												{ticketList.length === 0 &&
												reservationList.length === 0 ? (
													<p className='text-xs text-base-content/40'>
														Sem eventos
													</p>
												) : (
													<>
														{ticketList.map(
															(ticketMoment) => (
																<div
																	key={
																		ticketMoment.id
																	}
																	style={{
																		marginTop: 2,
																		borderRadius: 4,
																		padding:
																			"2px 5px",
																		fontSize: 10,
																		fontWeight: 700,
																		background:
																			"#e5e7eb",
																		color: "#374151",
																	}}>
																	{ticketMoment.kind ===
																	"departure"
																		? "↑"
																		: "↓"}{" "}
																	{
																		ticketMoment.time
																	}{" "}
																	{
																		ticketMoment.label
																	}
																</div>
															),
														)}
														{reservationList.map(
															(
																reservationMoment,
															) => (
																<div
																	key={
																		reservationMoment.id
																	}
																	style={{
																		marginTop: 2,
																		borderRadius: 4,
																		padding:
																			"2px 5px",
																		fontSize: 10,
																		fontWeight: 700,
																		background:
																			reservationDayColor
																				? `${reservationDayColor}33`
																				: "#ffedd5",
																		color: reservationDayColor
																			? darkenHex(
																					reservationDayColor,
																					0.55,
																				)
																			: "#9a3412",
																	}}>
																	{reservationMoment.kind ===
																	"checkin"
																		? "↓"
																		: "↑"}{" "}
																	{
																		reservationMoment.time
																	}{" "}
																	{
																		reservationMoment.label
																	}
																</div>
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
				})}
			</div>

			<div
				className='hidden md:block'
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
											cursor: onDayHeaderClick
												? "pointer"
												: "default",
										}}
										onClick={() => onDayHeaderClick?.(iso)}>
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
