import React from "react";
import type { AgendaDay, AgendaEntry } from "./hooks/useTripAgenda";

const TONE_CLASS: Record<AgendaEntry["tone"], string> = {
	voo: "border-l-slate-400 bg-slate-50",
	hotel: "border-l-orange-300 bg-orange-50",
	passeio: "border-l-violet-400 bg-violet-50",
	checkpoint: "border-l-violet-200 bg-transparent",
};

function formatDayHeading(iso: string) {
	// Sufixo de hora evita a leitura como meia-noite UTC, que exibiria o dia anterior.
	const date = new Date(`${iso}T00:00:00`);
	if (Number.isNaN(date.getTime())) return iso;
	return date.toLocaleDateString("pt-BR", {
		weekday: "long",
		day: "2-digit",
		month: "long",
	});
}

function isToday(iso: string) {
	const now = new Date();
	const local = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
	return local === iso;
}

export default function AgendaDayList({ days }: { days: AgendaDay[] }) {
	return (
		<div className='space-y-3'>
			{days.map((day) => (
				<div
					key={day.iso}
					className={`rounded-xl border overflow-hidden ${
						day.free
							? "border-base-200 bg-base-200/20"
							: "border-base-300 bg-base-100"
					}`}>
					<div className='px-3 py-2 border-b border-base-200 bg-base-200/40 flex items-center justify-between gap-2'>
						<h3 className='text-sm font-semibold capitalize'>
							{formatDayHeading(day.iso)}
							{isToday(day.iso) && (
								<span className='badge badge-primary badge-xs ml-2 align-middle'>
									hoje
								</span>
							)}
						</h3>
						{day.free && (
							<span className='text-[11px] font-medium text-base-content/50'>
								dia ainda livre
							</span>
						)}
					</div>

					{!day.free && (
						<div className='divide-y divide-base-200'>
							{day.slots.map((slot) => (
								<div
									key={slot.slot}
									className='grid grid-cols-[64px_1fr] gap-2 px-3 py-2'>
									<div className='text-[10px] uppercase tracking-wide text-base-content/45 font-semibold pt-1'>
										{slot.slot}
									</div>

									{slot.free ? (
										<p className='text-xs text-base-content/40 italic pt-1'>
											ainda livre
										</p>
									) : (
										<div className='space-y-1'>
											{slot.entries.map((entry) => (
												<div
													key={entry.id}
													className={`flex items-baseline gap-2 rounded-md border-l-4 px-2 py-1 ${TONE_CLASS[entry.tone]}`}>
													<span className='text-xs font-mono font-semibold text-base-content/70 shrink-0'>
														{entry.time || "—"}
													</span>
													<span className='text-sm shrink-0'>
														{entry.icon}
													</span>
													<span className='text-xs text-base-content/85'>
														{entry.title}
														{entry.detail && (
															<span className='text-base-content/45'>
																{" "}
																· {entry.detail}
															</span>
														)}
													</span>
												</div>
											))}
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</div>
			))}
		</div>
	);
}
