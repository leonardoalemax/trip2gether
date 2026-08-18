import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import type { Passeio, DraftPasseio, Reservation } from "../../types";
import PasseioFields, { PASSEIO_ITEM_TYPE_OPTIONS } from "./PasseioFields";
import PasseioItinerary from "./PasseioItinerary";

const itemTypeLabel = (type: string) =>
	PASSEIO_ITEM_TYPE_OPTIONS.find((option) => option.value === type)?.label ??
	type;

/**
 * `new Date("2026-09-23")` e lido como meia-noite UTC e, em fuso negativo,
 * exibe o dia anterior. O sufixo de hora forca leitura no fuso local.
 */
const formatDate = (value?: string) =>
	value ? new Date(`${value}T00:00:00`).toLocaleDateString("pt-BR") : "";

/**
 * Data + faixa de horario numa linha so. O itinerario abaixo repete os horarios
 * de saida/retorno, mas nao a data — por isso a data fica aqui.
 */
function scheduleLabel(passeio: Passeio) {
	const startDate = formatDate(passeio.departureDate);
	const endDate = formatDate(passeio.returnDate);
	const times = [passeio.departureTime, passeio.returnTime]
		.filter(Boolean)
		.join(" – ");

	if (!startDate && !endDate) return times || "sem data";
	if (endDate && endDate !== startDate) {
		return `${startDate} ${passeio.departureTime || ""} → ${endDate} ${
			passeio.returnTime || ""
		}`.replace(/\s+/g, " ");
	}
	return times ? `${startDate} · ${times}` : startDate;
}

const isHexColor = (value: string | undefined): value is string =>
	!!value && /^#[0-9a-fA-F]{6}$/.test(value);

const hexToRgba = (hex: string, alpha: number) => {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface PasseioListProps {
	passeios: Passeio[];
	reservations: Reservation[];
	handleFieldUpdate: <K extends keyof DraftPasseio>(
		passeio: Passeio,
		field: K,
		value: DraftPasseio[K],
	) => void;
	handleDelete: (passeioId: string) => void;
	setPasseios: React.Dispatch<React.SetStateAction<Passeio[]>>;
}

const PasseioList: React.FC<PasseioListProps> = ({
	passeios,
	reservations,
	handleFieldUpdate,
	handleDelete,
	setPasseios,
}) => {
	const [expandedPasseioIds, setExpandedPasseioIds] = useState<string[]>([]);

	const toggleExpanded = (passeioId: string) => {
		setExpandedPasseioIds((prev) =>
			prev.includes(passeioId)
				? prev.filter((id) => id !== passeioId)
				: [...prev, passeioId],
		);
	};

	return (
		<div className='space-y-4 w-full'>
			{passeios.map((passeio) =>
				(() => {
					const baseColor = isHexColor(passeio.color)
						? passeio.color
						: "#ddd6fe";
					const isExpanded = expandedPasseioIds.includes(passeio.id);

					return (
						<div
							key={passeio.id}
							className='w-full p-4 border rounded-xl space-y-4 shadow-[0_1px_2px_rgba(15,23,42,0.08)]'
							style={{
								backgroundColor: hexToRgba(baseColor, 0.4),
								borderColor: `${baseColor}55`,
							}}>
							<div className='flex items-start justify-between gap-3'>
								<div className='space-y-1'>
									<div className='flex items-center gap-2'>
										<span
											className='inline-block h-2.5 w-2.5 rounded-full'
											style={{ backgroundColor: baseColor }}
										/>
										<span className='text-sm font-semibold text-base-content/90'>
											{passeio.title || "Passeio sem título"}
										</span>
									</div>
									<p className='text-xs text-base-content/70'>
										{passeio.city || "Cidade ainda não informada"}
										{" · "}
										{scheduleLabel(passeio)}
									</p>
									{passeio.items && passeio.items.length > 0 && (
										<div className='space-y-0.5 pt-1'>
											{passeio.items.map((item) => (
												<p
													key={item.id}
													className={`text-xs ${item.purchased ? "text-success" : "text-base-content/70"} font-semibold`}>
													{item.purchased ? "✅" : "🎟️"}{" "}
													{item.title ||
														itemTypeLabel(item.type)}{" "}
													·{" "}
													{itemTypeLabel(item.type)}
													{item.value
														? ` · R$ ${item.value}`
														: ""}
												</p>
											))}
										</div>
									)}
									{/* Checkpoints e endereco nao aparecem aqui de proposito:
									    o itinerario logo abaixo ja lista os dois, com
									    endereco completo e botao de rota. */}
									{passeio.createdByEmail && (
										<p className='text-xs text-base-content/50 pt-1'>
											Criado por: {passeio.createdByEmail}
										</p>
									)}
								</div>
								<div className='flex items-center gap-1'>
									<button
										type='button'
										className='btn btn-ghost btn-xs btn-square'
										aria-label={
											isExpanded ? "Recolher" : "Expandir"
										}
										onClick={() => toggleExpanded(passeio.id)}>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											className='size-4'
											viewBox='0 0 24 24'
											fill='none'
											stroke='currentColor'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'>
											{isExpanded ? (
												<polyline points='18 15 12 9 6 15' />
											) : (
												<polyline points='6 9 12 15 18 9' />
											)}
										</svg>
									</button>
									<button
										aria-label='Remover passeio'
										className='btn btn-ghost btn-xs btn-square text-error'
										onClick={() => handleDelete(passeio.id)}>
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
							</div>
							{/* So o formulario colapsa. */}
							{isExpanded ? (
								<div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
									<PasseioFields
										values={passeio}
										onChange={(field, value) =>
											setPasseios((prev) =>
												prev.map((p) =>
													p.id === passeio.id
														? { ...p, [field]: value }
														: p,
												),
											)
										}
										onBlur={(field, value) =>
											handleFieldUpdate(
												passeio,
												field,
												value,
											)
										}
									/>
								</div>
							) : (
								passeio.descriptionMd && (
									<div
										className='pt-2 border-t border-base-200/60'
										data-color-mode='light'>
										<MDEditor.Markdown
											source={passeio.descriptionMd}
											style={{ background: "transparent" }}
										/>
									</div>
								)
							)}

							{/* Itinerario e mapa ficam sempre visiveis. */}
							<PasseioItinerary
								passeio={passeio}
								reservations={reservations}
							/>
						</div>
					);
				})(),
			)}
		</div>
	);
};

export default PasseioList;
