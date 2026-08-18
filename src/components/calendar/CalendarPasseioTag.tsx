import React from "react";
import { PasseioMoment } from "./types/PasseioMoment";
import { darkenHex } from "./utils/styleUtils";

interface CalendarPasseioTagProps {
	moment: PasseioMoment;
	dayColor: string | undefined;
	/** Acompanha o tamanho de fonte ja usado por cada visao do calendario. */
	fontSize: number;
}

const FALLBACK_COLOR = "#ddd6fe";

/**
 * Etiqueta de passeio no calendario. Um passeio vira um bloco continuo: os
 * slots do meio nao repetem horario e ficam com a borda arredondada aberta, de
 * modo que slots vizinhos leiam como uma faixa unica. Checkpoints entram como
 * marcas pontuais dentro dessa faixa.
 */
export default function CalendarPasseioTag({
	moment,
	dayColor,
	fontSize,
}: CalendarPasseioTagProps) {
	const color = dayColor ?? FALLBACK_COLOR;
	const textColor = darkenHex(color, 0.6);
	const isBlock = moment.kind === "bloco";
	const position = moment.position ?? "single";

	// Cantos retos onde o bloco continua no slot seguinte/anterior.
	const openTop = isBlock && (position === "middle" || position === "end");
	const openBottom = isBlock && (position === "middle" || position === "start");

	if (!isBlock) {
		return (
			<div
				style={{
					marginTop: 2,
					marginLeft: 6,
					borderRadius: 4,
					padding: "1px 5px",
					fontSize,
					fontWeight: 600,
					background: "transparent",
					color: textColor,
					borderLeft: `2px solid ${darkenHex(color, 0.35)}`,
				}}
				title={`${moment.time} ${moment.label}`}>
				📍 {moment.time} {moment.label}
			</div>
		);
	}

	return (
		<div
			style={{
				marginTop: openTop ? 0 : 2,
				borderTopLeftRadius: openTop ? 0 : 4,
				borderTopRightRadius: openTop ? 0 : 4,
				borderBottomLeftRadius: openBottom ? 0 : 4,
				borderBottomRightRadius: openBottom ? 0 : 4,
				padding: "2px 5px",
				fontSize,
				fontWeight: 700,
				background: `${color}55`,
				color: textColor,
				borderLeft: `3px solid ${darkenHex(color, 0.35)}`,
			}}
			title={`${moment.time} ${moment.label}`.trim()}>
			{position === "middle" ? (
				// Sem horario proprio: o meio do bloco so mantem a faixa viva.
				<span style={{ opacity: 0.75 }}>{moment.label}</span>
			) : (
				<>
					🗺️ {position === "end" ? `até ${moment.time}` : moment.time}{" "}
					{moment.label}
				</>
			)}
		</div>
	);
}
