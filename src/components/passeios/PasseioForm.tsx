import React from "react";
import type { DraftPasseio } from "../../types";
import PasseioFields from "./PasseioFields";

interface PasseioFormProps {
	draft: DraftPasseio | null;
	setDraft: (draft: DraftPasseio | null) => void;
	handleAdd: () => void;
	saving: boolean;
}

const PasseioForm: React.FC<PasseioFormProps> = ({
	draft,
	setDraft,
	handleAdd,
	saving,
}) => {
	if (!draft) return null;

	return (
		<div className='w-full p-6 border border-base-300 bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5 rounded-2xl space-y-6 shadow-md hover:shadow-lg transition-shadow'>
			<div className='space-y-2'>
				<p className='text-lg font-bold text-base-content'>
					Adicionar Novo Passeio
				</p>
				<div className='h-1 w-16 bg-gradient-to-r from-primary to-secondary rounded-full' />
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<PasseioFields
					values={draft}
					onChange={(field, value) =>
						setDraft({ ...draft, [field]: value })
					}
				/>
			</div>
			<div className='flex gap-3 justify-end pt-4 border-t border-base-200'>
				<button
					className='btn btn-ghost btn-sm rounded-lg'
					onClick={() => setDraft(null)}>
					Cancelar
				</button>
				<button
					className='btn btn-primary btn-sm rounded-lg font-semibold'
					onClick={handleAdd}
					disabled={
						saving ||
						!draft.title ||
						!draft.city ||
						!draft.timezone ||
						!draft.departureDate ||
						!draft.departureTime ||
						!draft.returnDate ||
						!draft.returnTime
					}>
					{saving && (
						<span className='loading loading-spinner loading-xs' />
					)}
					Salvar Passeio
				</button>
			</div>
		</div>
	);
};

export default PasseioForm;
