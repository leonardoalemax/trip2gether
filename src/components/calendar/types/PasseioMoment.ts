import { SlotType } from "@/types";

/**
 * Posicao do slot dentro do bloco do passeio. Serve para o calendario desenhar
 * um bloco continuo (so a ponta inicial mostra a hora de saida, so a final
 * mostra a de retorno) em vez de repetir a mesma etiqueta em todo slot.
 */
export type PasseioBlockPosition = "start" | "middle" | "end" | "single";

export interface PasseioMoment {
	id: string;
	iso: string;
	/** Vazio nos slots do meio do bloco, que nao tem horario proprio. */
	time: string;
	slot: SlotType;
	label: string;
	/**
	 * `bloco` cobre cada slot da duracao do passeio; `checkpoint` marca uma
	 * atracao no horario de entrada dela.
	 */
	kind: "bloco" | "checkpoint";
	position?: PasseioBlockPosition;
	city: string;
}
