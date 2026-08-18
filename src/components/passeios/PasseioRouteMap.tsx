import React, { useEffect, useRef } from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { RoutePoint } from "./hooks/useItineraryRoute";

interface PasseioRouteMapProps {
	points: RoutePoint[];
}

/** Vermelho das paradas; a estadia usa o tom mais escuro para se distinguir. */
const STOP_RED = "#dc2626";
const STAY_RED = "#7f1d1d";

/** Numero/emoji da parada — divIcon evita o problema classico de path das
 * imagens de marker do Leaflet quando empacotado pelo Vite. */
function markerIcon(label: string, background: string, faded: boolean) {
	return L.divIcon({
		className: "",
		html: `<div style="
			background:${background};
			color:#fff;
			width:26px;
			height:26px;
			border-radius:50%;
			display:flex;
			align-items:center;
			justify-content:center;
			font-size:12px;
			font-weight:700;
			border:2px solid #fff;
			box-shadow:0 1px 4px rgba(0,0,0,0.4);
			opacity:${faded ? 0.7 : 1};
		">${label}</div>`,
		iconSize: [26, 26],
		iconAnchor: [13, 13],
	});
}

export default function PasseioRouteMap({ points }: PasseioRouteMapProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const mapRef = useRef<L.Map | null>(null);
	const layerRef = useRef<L.LayerGroup | null>(null);
	const boundsRef = useRef<L.LatLngBounds | null>(null);

	/**
	 * O mapa monta junto com o card colapsavel, entao no primeiro paint o
	 * container pode ainda nao ter o tamanho final — e o Leaflet calcula o zoom
	 * a partir do tamanho que mediu. Sempre remedir antes de reenquadrar.
	 */
	const refit = (map: L.Map) => {
		map.invalidateSize();
		if (boundsRef.current) {
			map.fitBounds(boundsRef.current, { maxZoom: 15 });
		}
	};

	useEffect(() => {
		const container = containerRef.current;
		if (!container || mapRef.current) return;

		const map = L.map(container, { scrollWheelZoom: false });
		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution: "&copy; OpenStreetMap",
			maxZoom: 19,
		}).addTo(map);

		mapRef.current = map;
		layerRef.current = L.layerGroup().addTo(map);

		const observer = new ResizeObserver(() => refit(map));
		observer.observe(container);
		// Rede de seguranca: o observer cobre expandir/recolher e resize da
		// janela, mas nao da para contar com ele para o primeiro layout.
		const timer = setTimeout(() => refit(map), 120);

		return () => {
			clearTimeout(timer);
			observer.disconnect();
			map.remove();
			mapRef.current = null;
			layerRef.current = null;
		};
	}, []);

	useEffect(() => {
		const map = mapRef.current;
		const layer = layerRef.current;
		if (!map || !layer) return;

		layer.clearLayers();
		if (points.length === 0) return;

		const latLngs = points.map(
			(point) => [point.coords.lat, point.coords.lon] as L.LatLngTuple,
		);

		L.polyline(latLngs, {
			color: STOP_RED,
			weight: 3,
			opacity: 0.9,
			dashArray: "6 6",
		}).addTo(layer);

		points.forEach((point) => {
			const isStay =
				point.stop.kind === "origin" || point.stop.kind === "destination";

			L.marker([point.coords.lat, point.coords.lon], {
				icon: markerIcon(
					isStay ? "🏨" : String(point.order),
					isStay ? STAY_RED : STOP_RED,
					point.approximate,
				),
				title: point.stop.title,
			})
				.addTo(layer)
				.bindPopup(
					`<strong>${point.stop.title}</strong>${
						point.stop.address ? `<br/>${point.stop.address}` : ""
					}${point.approximate ? "<br/><em>posição aproximada</em>" : ""}`,
				);
		});

		boundsRef.current = L.latLngBounds(latLngs).pad(0.2);
		refit(map);
	}, [points]);

	return (
		<div
			ref={containerRef}
			className='rounded-lg border border-base-200 overflow-hidden'
			style={{ height: 450, width: "100%" }}
		/>
	);
}
