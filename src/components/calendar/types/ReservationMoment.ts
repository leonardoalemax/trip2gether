import { SlotType } from "@/types";

export interface ReservationMoment {
	id: string;
	iso: string;
	time: string;
	slot: SlotType;
	label: string;
	kind: "checkin" | "checkout";
	city: string;
}
