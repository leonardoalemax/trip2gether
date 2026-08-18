import React from "react";
import type { Passeio, Reservation } from "../../types";
import PasseioRouteMap from "./PasseioRouteMap";
import { useItineraryRoute } from "./hooks/useItineraryRoute";
import {
	buildItinerary,
	findStayForDate,
	type ItineraryStop,
} from "./utils/itinerary";
import { buildFullRouteLink, buildLegLink } from "./utils/googleMaps";

interface PasseioItineraryProps {
	passeio: Passeio;
	reservations: Reservation[];
}

const STOP_ICON: Record<ItineraryStop["kind"], string> = {
	origin: "🏨",
	place: "🎯",
	checkpoint: "📍",
	destination: "🏨",
};

function stopTimeLabel(stop: ItineraryStop) {
	if (stop.kind === "origin") {
		return stop.exitTime ? `Saída ${stop.exitTime}` : "Saída";
	}
	if (stop.kind === "destination") {
		return stop.entryTime ? `Retorno ${stop.entryTime}` : "Retorno";
	}
	if (stop.entryTime || stop.exitTime) {
		return `${stop.entryTime || "?"} – ${stop.exitTime || "?"}`;
	}
	return "";
}

export default function PasseioItinerary({
	passeio,
	reservations,
}: PasseioItineraryProps) {
	const stay = findStayForDate(reservations, passeio.departureDate);
	const stops = React.useMemo(
		() => buildItinerary(passeio, stay),
		[passeio, stay],
	);

	const { points, unresolved, loading } = useItineraryRoute(stops);
	const fullRouteUrl = React.useMemo(
		() => buildFullRouteLink(stops),
		[stops],
	);

	return (
		<div className='space-y-3 pt-2 border-t border-base-200/60'>
			<h3 className='text-sm font-semibold text-base-content/80 flex items-center gap-2'>
				<span className='text-lg'>🧭</span> Itinerário
				<span className='text-[11px] font-normal text-base-content/50'>
					🚆 trechos em transporte público
				</span>
			</h3>

			{/* Com estadia encontrada nao ha texto de origem: a parada 1 da lista
			    ja mostra nome e endereco dela. Sem estadia, o aviso explica de
			    onde vem a origem — isso a lista nao conta. */}
			{!stay && (
				<p className='text-xs text-base-content/60'>
					Nenhuma reserva cobre{" "}
					{passeio.departureDate
						? new Date(
								`${passeio.departureDate}T00:00:00`,
							).toLocaleDateString("pt-BR")
						: "a data do passeio"}
					, então a saída/retorno usam apenas a cidade do passeio. Cadastre
					a reserva do dia para usar o endereço da estadia.
				</p>
			)}

			<ol className='space-y-1'>
				{stops.map((stop, index) => {
					const previous = index > 0 ? stops[index - 1] : undefined;
					const legUrl = previous ? buildLegLink(previous, stop) : null;

					return (
						<li
							key={`${stop.kind}-${stop.id}`}
							className='flex items-start gap-2 text-xs'>
							<span className='pt-0.5'>{STOP_ICON[stop.kind]}</span>
							<div className='flex-1'>
								<p className='font-semibold text-base-content/85'>
									{index + 1}. {stop.title}
									{stopTimeLabel(stop) ? (
										<span className='font-normal text-base-content/60'>
											{" "}
											· {stopTimeLabel(stop)}
										</span>
									) : null}
								</p>
								{stop.address ? (
									<p className='text-base-content/55'>
										{stop.address}
									</p>
								) : (
									<p className='text-base-content/40 italic'>
										Sem endereço cadastrado
									</p>
								)}
								{previous &&
									(legUrl ? (
										<a
											href={legUrl}
											target='_blank'
											rel='noopener noreferrer'
											className='btn btn-xs btn-outline rounded-lg mt-1 font-normal'
											title={`Rota de ${previous.title} até ${stop.title}`}>
											🚆 Rota do {index} até aqui
										</a>
									) : (
										<p className='text-base-content/40 mt-1'>
											Sem endereço suficiente para gerar a
											rota deste trecho.
										</p>
									))}
							</div>
						</li>
					);
				})}
			</ol>

			{loading && (
				<p className='text-xs text-base-content/50 flex items-center gap-2'>
					<span className='loading loading-spinner loading-xs' />
					Localizando endereços no mapa...
				</p>
			)}

			{points.length > 1 && <PasseioRouteMap points={points} />}

			{!loading && points.length <= 1 && (
				<p className='text-xs text-base-content/50'>
					Cadastre ao menos dois endereços (estadia e checkpoints) para
					ver as paradas no mapa.
				</p>
			)}

			{!loading && unresolved.length > 0 && (
				<p className='text-xs text-base-content/50'>
					Não localizei no mapa:{" "}
					{unresolved.map((stop) => stop.title).join(", ")}.
				</p>
			)}

			{points.length > 1 && (
				<p className='text-[11px] text-base-content/40'>
					A linha liga as paradas na ordem do itinerário (não é rota de
					trânsito real) — use os botões acima para a rota de verdade.
				</p>
			)}

			{fullRouteUrl && (
				<a
					href={fullRouteUrl}
					target='_blank'
					rel='noopener noreferrer'
					className='btn btn-sm btn-primary rounded-lg'>
					🗺️ Abrir o dia inteiro no Google Maps
				</a>
			)}
		</div>
	);
}
