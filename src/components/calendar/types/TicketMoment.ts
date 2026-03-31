import { SlotType } from "../../../types";

export interface TicketMoment {
	id: string;
	iso: string;
	time: string;
	slot: SlotType;
	label: string;
	kind: "departure" | "arrival";
}
