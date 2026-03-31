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
import type { Ticket } from "../types";

const ticketsCol = (tripId: string) =>
	collection(db, "trips", tripId, "tickets");

export async function getTickets(tripId: string): Promise<Ticket[]> {
	const q = query(ticketsCol(tripId), orderBy("createdAt", "asc"));
	const snap = await getDocs(q);
	return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Ticket);
}

export async function createTicket(
	tripId: string,
	data: Omit<Ticket, "id" | "tripId" | "createdAt">,
): Promise<Ticket> {
	const payload = { ...data, tripId, createdAt: new Date().toISOString() };
	const ref = await addDoc(ticketsCol(tripId), payload);
	return { id: ref.id, ...payload };
}

export async function updateTicket(
	tripId: string,
	ticketId: string,
	data: Partial<Omit<Ticket, "id" | "tripId" | "createdAt">>,
): Promise<void> {
	await updateDoc(doc(db, "trips", tripId, "tickets", ticketId), data);
}

export async function deleteTicket(
	tripId: string,
	ticketId: string,
): Promise<void> {
	await deleteDoc(doc(db, "trips", tripId, "tickets", ticketId));
}
