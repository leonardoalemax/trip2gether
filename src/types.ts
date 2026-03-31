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

export interface Reservation {
	id: string;
	tripId: string;
	city: string;
	hotelName: string;
	color: string;
	timezone: string;
	checkInDate: string;
	checkInTime: string;
	checkOutDate: string;
	checkOutTime: string;
	createdAt: string;
}

export type DraftReservation = Omit<Reservation, "id" | "tripId" | "createdAt">;

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
	ownerId: string;
	ownerEmail: string;
	whitelistedEmails: string[];
	createdAt: string;
}

export type ScreenType = "calendar" | "tickets" | "reservations";
