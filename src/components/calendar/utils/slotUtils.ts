import { SlotType } from "../../../types";

export const SLOTS: SlotType[] = ["manhã", "tarde", "noite"];

export const SLOT_MID: Record<SlotType, number> = {
	manhã: 6,
	tarde: 15,
	noite: 21,
};

export const SLOT_RANGE: Record<SlotType, [number, number]> = {
	manhã: [0, 11],
	tarde: [12, 17],
	noite: [18, 23],
};

export const DAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function getSlotFromHour(hour: number): SlotType {
	if (hour >= 0 && hour <= 11) return "manhã";
	if (hour >= 12 && hour <= 17) return "tarde";
	return "noite";
}
