import {
	addDoc,
	arrayRemove,
	arrayUnion,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	query,
	setDoc,
	updateDoc,
	where,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Trip, TripInvite } from "../types";

const TRIPS_COL = "trips";
const INVITES_COL = "invites";
const TRIP_CODES_COL = "tripCodes";

function randomSixDigitCode(): string {
	return String(Math.floor(100000 + Math.random() * 900000));
}

async function setTripCodeMapping(code: string, tripId: string): Promise<void> {
	await setDoc(doc(db, TRIP_CODES_COL, code), { tripId });
}

async function isAccessCodeInUse(code: string): Promise<boolean> {
	const snap = await getDoc(doc(db, TRIP_CODES_COL, code));
	return snap.exists();
}

async function generateUniqueAccessCode(maxAttempts = 25): Promise<string> {
	for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
		const code = randomSixDigitCode();
		if (!(await isAccessCodeInUse(code))) {
			return code;
		}
	}
	throw new Error("Nao foi possivel gerar um codigo unico de acesso");
}

export async function createTripRecord(
	trip: Omit<Trip, "id" | "createdAt">,
): Promise<Trip> {
	const data = {
		...trip,
		accessCode: trip.accessCode || (await generateUniqueAccessCode()),
		createdAt: new Date().toISOString(),
	};
	const ref = await addDoc(collection(db, TRIPS_COL), data);
	await setTripCodeMapping(data.accessCode, ref.id);
	return { id: ref.id, ...data };
}

export async function updateTripRecord(
	tripId: string,
	data: Partial<Omit<Trip, "id">>,
): Promise<void> {
	await updateDoc(doc(db, TRIPS_COL, tripId), data);
}

export async function deleteTripRecord(tripId: string): Promise<void> {
	await deleteDoc(doc(db, TRIPS_COL, tripId));
}

export async function getTripRecordById(tripId: string): Promise<Trip | null> {
	const snap = await getDoc(doc(db, TRIPS_COL, tripId));
	if (!snap.exists()) return null;
	return { id: snap.id, ...snap.data() } as Trip;
}

export async function getTripRecordsByUserEmail(
	email: string,
): Promise<Trip[]> {
	const tripsQuery = query(
		collection(db, TRIPS_COL),
		where("whitelistedEmails", "array-contains", email),
	);
	const snap = await getDocs(tripsQuery);
	return snap.docs.map((item) => ({ id: item.id, ...item.data() }) as Trip);
}

export async function getTripRecordsByOwnerId(
	ownerId: string,
): Promise<Trip[]> {
	const tripsQuery = query(
		collection(db, TRIPS_COL),
		where("ownerId", "==", ownerId),
	);
	const snap = await getDocs(tripsQuery);
	return snap.docs.map((item) => ({ id: item.id, ...item.data() }) as Trip);
}

export async function addTripWhitelistEmail(
	tripId: string,
	email: string,
): Promise<void> {
	await updateDoc(doc(db, TRIPS_COL, tripId), {
		whitelistedEmails: arrayUnion(email),
	});
}

export async function removeTripWhitelistEmail(
	tripId: string,
	email: string,
): Promise<void> {
	await updateDoc(doc(db, TRIPS_COL, tripId), {
		whitelistedEmails: arrayRemove(email),
	});
}

export async function createInviteRecord(
	tripId: string,
	email: string,
): Promise<TripInvite> {
	const data = {
		tripId,
		email,
		createdAt: new Date().toISOString(),
		accepted: false,
	};
	const ref = await addDoc(collection(db, INVITES_COL), data);
	return { id: ref.id, ...data };
}

export async function getInviteRecordById(
	inviteId: string,
): Promise<TripInvite | null> {
	const snap = await getDoc(doc(db, INVITES_COL, inviteId));
	if (!snap.exists()) return null;
	return { id: snap.id, ...snap.data() } as TripInvite;
}

export async function markInviteAsAccepted(inviteId: string): Promise<void> {
	await updateDoc(doc(db, INVITES_COL, inviteId), { accepted: true });
}

export async function ensureTripAccessCode(tripId: string): Promise<string> {
	const trip = await getTripRecordById(tripId);
	if (!trip) throw new Error("Viagem nao encontrada");

	const existingCode = String(trip.accessCode ?? "").trim();
	if (/^\d{6}$/.test(existingCode)) {
		await setTripCodeMapping(existingCode, tripId);
		return existingCode;
	}

	const accessCode = await generateUniqueAccessCode();
	await updateDoc(doc(db, TRIPS_COL, tripId), { accessCode });
	await setTripCodeMapping(accessCode, tripId);
	return accessCode;
}

export async function joinTripByAccessCode(
	accessCode: string,
	userEmail: string,
): Promise<Trip | null> {
	const normalizedCode = accessCode.replace(/\D/g, "").slice(0, 6);
	if (!/^\d{6}$/.test(normalizedCode)) return null;

	const codeSnap = await getDoc(doc(db, TRIP_CODES_COL, normalizedCode));
	if (!codeSnap.exists()) return null;

	const { tripId } = codeSnap.data() as { tripId: string };
	await addTripWhitelistEmail(tripId, userEmail.toLowerCase());

	return getTripRecordById(tripId);
}

export async function createTrip(
	trip: Omit<Trip, "id" | "createdAt">,
): Promise<Trip> {
	return createTripRecord(trip);
}

export async function updateTrip(
	tripId: string,
	data: Partial<Omit<Trip, "id">>,
): Promise<void> {
	await updateTripRecord(tripId, data);
}

export async function deleteTrip(tripId: string): Promise<void> {
	await deleteTripRecord(tripId);
}

export async function getTripById(tripId: string): Promise<Trip | null> {
	return getTripRecordById(tripId);
}

export async function getTripsForUser(email: string): Promise<Trip[]> {
	return getTripRecordsByUserEmail(email);
}

export async function getOwnedTrips(ownerId: string): Promise<Trip[]> {
	return getTripRecordsByOwnerId(ownerId);
}

export async function getUserTrips(
	email: string,
	ownerId: string,
): Promise<Trip[]> {
	const [shared, owned] = await Promise.all([
		getTripRecordsByUserEmail(email),
		getTripRecordsByOwnerId(ownerId),
	]);

	const tripMap = new Map<string, Trip>();
	[...owned, ...shared].forEach((trip) => tripMap.set(trip.id, trip));

	return Array.from(tripMap.values()).sort(
		(a, b) =>
			new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
	);
}

export async function addEmailToWhitelist(
	tripId: string,
	email: string,
): Promise<void> {
	await addTripWhitelistEmail(tripId, email);
}

export async function removeEmailFromWhitelist(
	tripId: string,
	email: string,
): Promise<void> {
	await removeTripWhitelistEmail(tripId, email);
}

export async function createInvite(
	tripId: string,
	email: string,
): Promise<TripInvite> {
	return createInviteRecord(tripId, email);
}

export async function getInviteById(
	inviteId: string,
): Promise<TripInvite | null> {
	return getInviteRecordById(inviteId);
}

export async function acceptInvite(inviteId: string): Promise<Trip | null> {
	const invite = await getInviteRecordById(inviteId);
	if (!invite) return null;

	await markInviteAsAccepted(inviteId);
	await addTripWhitelistEmail(invite.tripId, invite.email);

	return getTripRecordById(invite.tripId);
}
