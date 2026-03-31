import React from "react";
import type { DraftReservation } from "../../types";
import ReservationFields from "./ReservationFields";

interface ReservationFormProps {
	draft: DraftReservation | null;
	setDraft: (draft: DraftReservation | null) => void;
	handleAdd: () => void;
	saving: boolean;
}

const ReservationForm: React.FC<ReservationFormProps> = ({
	draft,
	setDraft,
	handleAdd,
	saving,
}) => {
	if (!draft) return null;

	return (
		<div className='w-full p-4 border border-primary/30 bg-primary/5 rounded-xl space-y-3 shadow-sm'>
			<p className='text-sm font-semibold'>Nova reserva</p>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
				<ReservationFields
					values={draft}
					onChange={(field, value) =>
						setDraft({
							...draft,
							[field]: value,
						} as DraftReservation)
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
						!draft.city ||
						!draft.hotelName ||
						!draft.timezone ||
						!draft.checkInDate ||
						!draft.checkOutDate
					}>
					{saving && (
						<span className='loading loading-spinner loading-xs' />
					)}
					Salvar reserva
				</button>
			</div>
		</div>
	);
};

export default ReservationForm;
