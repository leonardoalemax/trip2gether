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
import type { Passeio } from "../types";

const passeiosCol = (tripId: string) =>
	collection(db, "trips", tripId, "passeios");

/**
 * Chave de ordenacao por data + hora de saida. Passeios sem data vao para o fim
 * (sao cadastros incompletos, nao o comeco da viagem).
 *
 * A ordenacao e feita no cliente de proposito: ordenar por dois campos no
 * Firestore exigiria um indice composto, e a lista de um passeio por dia de
 * viagem e pequena demais para justificar isso.
 */
function sortKey(passeio: Passeio): string {
	return `${passeio.departureDate || "9999-12-31"}T${
		passeio.departureTime || "99:99"
	}`;
}

export function sortPasseios(passeios: Passeio[]): Passeio[] {
	return [...passeios].sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
}

export async function getPasseios(tripId: string): Promise<Passeio[]> {
	const q = query(passeiosCol(tripId), orderBy("createdAt", "asc"));
	const snap = await getDocs(q);
	return sortPasseios(
		snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Passeio),
	);
}

export async function createPasseio(
	tripId: string,
	data: Omit<Passeio, "id" | "tripId" | "createdAt">,
): Promise<Passeio> {
	const payload = { ...data, tripId, createdAt: new Date().toISOString() };
	const ref = await addDoc(passeiosCol(tripId), payload);
	return { id: ref.id, ...payload };
}

export async function updatePasseio(
	tripId: string,
	passeioId: string,
	data: Partial<Omit<Passeio, "id" | "tripId" | "createdAt">>,
): Promise<void> {
	await updateDoc(doc(db, "trips", tripId, "passeios", passeioId), data);
}

export async function deletePasseio(
	tripId: string,
	passeioId: string,
): Promise<void> {
	await deleteDoc(doc(db, "trips", tripId, "passeios", passeioId));
}
