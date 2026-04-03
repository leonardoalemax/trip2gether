import React, { useCallback, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { useTripContext } from "../../context/TripContext";
import {
	createReservation,
	deleteReservation,
	getReservations,
	updateReservation,
} from "../../services/reservationService";
import type { Reservation, DraftReservation } from "../../types";
import ReservationForm from "./ReservationForm";
import ReservationList from "./ReservationList";

const emptyDraft = (): DraftReservation => ({
	city: "",
	hotelName: "",
	hotelAddress: "",
	reservationValue: "",
	signalAmount: "",
	reservedByEmail: "",
	paymentType: "",
	color: "#bfdbfe",
	timezone: "",
	checkInDate: "",
	checkInTime: "",
	checkOutDate: "",
	checkOutTime: "",
});

const ReservationsScreen: React.FC = () => {
	const { activeTrip } = useTripContext();
	const [user] = useAuthState(auth);
	const [reservations, setReservations] = useState<Reservation[]>([]);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [draft, setDraft] = useState<DraftReservation | null>(null);

	const fetchReservations = useCallback(async () => {
		if (!activeTrip) return;
		setLoading(true);
		try {
			const data = await getReservations(activeTrip.id);
			setReservations(data);
		} finally {
			setLoading(false);
		}
	}, [activeTrip]);

	useEffect(() => {
		fetchReservations();
	}, [fetchReservations]);

	const handleAdd = async () => {
		if (!activeTrip || !draft || !user) return;
		setSaving(true);
		try {
			const reservationData = {
				...draft,
				createdByUserId: user.uid,
				createdByEmail: user.email || "",
			};
			const reservation = await createReservation(
				activeTrip.id,
				reservationData as Reservation,
			);
			setReservations((prev) => [...prev, reservation]);
			setDraft(null);
		} finally {
			setSaving(false);
		}
	};

	const handleFieldUpdate = async (
		reservation: Reservation,
		field: keyof DraftReservation,
		value: string,
	) => {
		if (!activeTrip) return;
		setReservations((prev) =>
			prev.map((r) =>
				r.id === reservation.id ? { ...r, [field]: value } : r,
			),
		);
		await updateReservation(activeTrip.id, reservation.id, {
			[field]: value,
		});
	};

	const handleDelete = async (reservationId: string) => {
		if (!activeTrip) return;
		setReservations((prev) => prev.filter((r) => r.id !== reservationId));
		await deleteReservation(activeTrip.id, reservationId);
	};

	if (!activeTrip) {
		return (
			<div className='p-6 text-base-content/50 text-sm'>
				Selecione uma viagem para ver as reservas.
			</div>
		);
	}

	const tripMembers = [
		activeTrip.ownerEmail,
		...activeTrip.whitelistedEmails,
	].filter((email) => email);

	return (
		<div className='p-4 space-y-4 max-w-2xl mx-auto'>
			<div className='flex items-center justify-between'>
				<h2 className='text-xl font-bold'>Reservas</h2>
				{!draft && (
					<button
						className='btn btn-primary btn-sm'
						onClick={() => setDraft(emptyDraft())}>
						+ Nova reserva
					</button>
				)}
			</div>

			{loading && (
				<div className='flex justify-center py-8'>
					<span className='loading loading-spinner loading-md' />
				</div>
			)}

			{!loading && reservations.length === 0 && !draft && (
				<p className='text-sm text-base-content/50'>
					Nenhuma reserva cadastrada.
				</p>
			)}

			<ReservationForm
				draft={draft}
				setDraft={setDraft}
				handleAdd={handleAdd}
				saving={saving}
				tripMembers={tripMembers}
			/>

			<ReservationList
				reservations={reservations}
				handleFieldUpdate={handleFieldUpdate}
				handleDelete={handleDelete}
				setReservations={setReservations}
				tripMembers={tripMembers}
			/>
		</div>
	);
};

export default ReservationsScreen;
