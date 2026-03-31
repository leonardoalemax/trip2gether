import {
	collection,
	doc,
	addDoc,
	updateDoc,
	deleteDoc,
	getDocs,
	query,
	orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Reservation } from "../types";

const reservationsCol = (tripId: string) =>
	collection(db, "trips", tripId, "reservations");

export async function getReservations(tripId: string): Promise<Reservation[]> {
	const q = query(reservationsCol(tripId), orderBy("createdAt", "asc"));
	const snap = await getDocs(q);
	return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Reservation);
}

export async function createReservation(
	tripId: string,
	data: Omit<Reservation, "id" | "tripId" | "createdAt">,
): Promise<Reservation> {
	const payload = { ...data, tripId, createdAt: new Date().toISOString() };
	const ref = await addDoc(reservationsCol(tripId), payload);
	return { id: ref.id, ...payload };
}

export async function updateReservation(
	tripId: string,
	reservationId: string,
	data: Partial<Omit<Reservation, "id" | "tripId" | "createdAt">>,
): Promise<void> {
	await updateDoc(
		doc(db, "trips", tripId, "reservations", reservationId),
		data,
	);
}

export async function deleteReservation(
	tripId: string,
	reservationId: string,
): Promise<void> {
	await deleteDoc(doc(db, "trips", tripId, "reservations", reservationId));
}
