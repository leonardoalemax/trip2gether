export interface City {
	id: string;
	name: string;
	color: string;
}

export type EventType = "flight" | "res" | "prog";
export type SlotType = "manhã" | "tarde" | "noite";

export interface TripEvent {
	id: number;
	t: EventType;
	l: string;
	date: string;
	slot: SlotType;
}

export interface Ticket {
	id: string;
	tripId: string;
	airlineName: string;
	flightNumber: string;
	departureAirport: string;
	arrivalAirport: string;
	departureDate: string;
	departureTime: string;
	departureTimezone: string;
	arrivalDate: string;
	arrivalTime: string;
	arrivalTimezone: string;
	createdAt: string;
}

export type DraftTicket = Omit<Ticket, "id" | "tripId" | "createdAt">;

export type PaymentType = "pagar_na_hora" | "pago_pelo_reservante";

export interface Reservation {
	id: string;
	tripId: string;
	city: string;
	hotelName: string;
	hotelAddress: string;
	reservationValue: string;
	signalAmount?: string;
	reservedByEmail: string;
	paymentType: PaymentType;
	paymentDueDate?: string;
	reservationLink?: string;
	color: string;
	timezone: string;
	checkInDate: string;
	checkInTime: string;
	checkOutDate: string;
	checkOutTime: string;
	createdByUserId: string;
	createdByEmail: string;
	createdAt: string;
}

export type DraftReservation = Omit<
	Reservation,
	| "id"
	| "tripId"
	| "createdAt"
	| "createdByUserId"
	| "createdByEmail"
	| "paymentType"
> & {
	paymentType: PaymentType | "";
};

export type PasseioItemType = "ingresso" | "transporte" | "outros";

export interface PasseioItem {
	id: string;
	title: string;
	type: PasseioItemType;
	value?: string;
	purchased: boolean;
}

export interface PasseioCheckpoint {
	id: string;
	title: string;
	address?: string;
	entryTime: string;
	exitTime: string;
}

export interface Passeio {
	id: string;
	tripId: string;
	title: string;
	city: string;
	address?: string;
	timezone: string;
	departureDate: string;
	departureTime: string;
	returnDate: string;
	returnTime: string;
	items: PasseioItem[];
	checkpoints: PasseioCheckpoint[];
	descriptionMd?: string;
	color: string;
	createdByUserId: string;
	createdByEmail: string;
	createdAt: string;
}

export type DraftPasseio = Omit<
	Passeio,
	"id" | "tripId" | "createdAt" | "createdByUserId" | "createdByEmail"
>;

export interface TripInvite {
	id: string;
	tripId: string;
	email: string;
	createdAt: string;
	accepted: boolean;
}

export interface Trip {
	id: string;
	name: string;
	country: string;
	defaultTimezone?: string;
	accessCode?: string;
	travelers?: number;
	ownerId: string;
	ownerEmail: string;
	whitelistedEmails: string[];
	createdAt: string;
}

export type ScreenType =
	| "calendar"
	| "itinerary"
	| "tickets"
	| "reservations"
	| "passeios"
	| "payments";
