import React, { useCallback, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { useTripContext } from "../../context/TripContext";
import {
	createPasseio,
	deletePasseio,
	getPasseios,
	sortPasseios,
	updatePasseio,
} from "../../services/passeioService";
import type { Passeio, DraftPasseio } from "../../types";
import { useReservations } from "../../hooks/useReservations";
import PasseioForm from "./PasseioForm";
import PasseioList from "./PasseioList";

const emptyDraft = (): DraftPasseio => ({
	title: "",
	city: "",
	address: "",
	timezone: "",
	departureDate: "",
	departureTime: "",
	returnDate: "",
	returnTime: "",
	items: [],
	checkpoints: [],
	descriptionMd: "",
	color: "#ddd6fe",
});

const PasseiosScreen: React.FC = () => {
	const { activeTrip } = useTripContext();
	const [user] = useAuthState(auth);
	const [passeios, setPasseios] = useState<Passeio[]>([]);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [draft, setDraft] = useState<DraftPasseio | null>(null);
	// As reservas alimentam o itinerario: e delas que sai a cidade/endereco da
	// estadia no dia de cada passeio.
	const { reservations } = useReservations({ tripId: activeTrip?.id });

	const fetchPasseios = useCallback(async () => {
		if (!activeTrip) return;
		setLoading(true);
		try {
			const data = await getPasseios(activeTrip.id);
			setPasseios(data);
		} finally {
			setLoading(false);
		}
	}, [activeTrip]);

	useEffect(() => {
		fetchPasseios();
	}, [fetchPasseios]);

	const handleAdd = async () => {
		if (!activeTrip || !draft || !user) return;
		setSaving(true);
		try {
			const passeio = await createPasseio(activeTrip.id, {
				...draft,
				createdByUserId: user.uid,
				createdByEmail: user.email || "",
			});
			setPasseios((prev) => sortPasseios([...prev, passeio]));
			setDraft(null);
		} finally {
			setSaving(false);
		}
	};

	const handleFieldUpdate = async <K extends keyof DraftPasseio>(
		passeio: Passeio,
		field: K,
		value: DraftPasseio[K],
	) => {
		if (!activeTrip) return;
		// Reordena so quando o campo editado muda a posicao na lista — reordenar
		// a cada blur faria o card pular embaixo do cursor durante a edicao.
		const reorders = field === "departureDate" || field === "departureTime";
		setPasseios((prev) => {
			const next = prev.map((p) =>
				p.id === passeio.id ? { ...p, [field]: value } : p,
			);
			return reorders ? sortPasseios(next) : next;
		});
		await updatePasseio(activeTrip.id, passeio.id, { [field]: value });
	};

	const handleDelete = async (passeioId: string) => {
		if (!activeTrip) return;
		setPasseios((prev) => prev.filter((p) => p.id !== passeioId));
		await deletePasseio(activeTrip.id, passeioId);
	};

	if (!activeTrip) {
		return (
			<div className='p-6 text-base-content/50 text-sm'>
				Selecione uma viagem para ver os passeios.
			</div>
		);
	}

	return (
		<div className='p-4 space-y-4 max-w-2xl mx-auto'>
			<div className='flex items-center justify-between'>
				<h2 className='text-xl font-bold'>Passeios</h2>
				{!draft && (
					<button
						className='btn btn-primary btn-sm'
						onClick={() => setDraft(emptyDraft())}>
						+ Novo passeio
					</button>
				)}
			</div>

			{loading && (
				<div className='flex justify-center py-8'>
					<span className='loading loading-spinner loading-md' />
				</div>
			)}

			{!loading && passeios.length === 0 && !draft && (
				<p className='text-sm text-base-content/50'>
					Nenhum passeio cadastrado.
				</p>
			)}

			<PasseioForm
				draft={draft}
				setDraft={setDraft}
				handleAdd={handleAdd}
				saving={saving}
			/>

			<PasseioList
				passeios={passeios}
				reservations={reservations}
				handleFieldUpdate={handleFieldUpdate}
				handleDelete={handleDelete}
				setPasseios={setPasseios}
			/>
		</div>
	);
};

export default PasseiosScreen;
