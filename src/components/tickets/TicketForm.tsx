import React from "react";
import type { DraftTicket } from "@/types";
import TicketFields from "./TicketFields";

interface TicketFormProps {
	draft: DraftTicket | null;
	setDraft: (draft: DraftTicket | null) => void;
	handleAdd: () => void;
	saving: boolean;
}

const TicketForm: React.FC<TicketFormProps> = ({
	draft,
	setDraft,
	handleAdd,
	saving,
}) => {
	if (!draft) return null;

	return (
		<div className='p-4 border border-primary/30 bg-primary/5 rounded-xl space-y-3'>
			<p className='text-sm font-semibold'>Novo trecho</p>
			<div className='grid grid-cols-2 gap-2'>
				<TicketFields
					values={draft}
					onChange={(field, value) =>
						setDraft({ ...draft, [field]: value } as DraftTicket)
					}
				/>
			</div>
			<div className='flex gap-2 justify-end'>
				<button
					className='btn btn-ghost btn-sm'
					onClick={() => setDraft(null)}>
					Cancelar
				</button>
				<button
					className='btn btn-primary btn-sm'
					onClick={handleAdd}
					disabled={
						saving ||
						!draft.departureAirport ||
						!draft.arrivalAirport ||
						!draft.departureDate
					}>
					{saving && (
						<span className='loading loading-spinner loading-xs' />
					)}
					Salvar trecho
				</button>
			</div>
		</div>
	);
};

export default TicketForm;
