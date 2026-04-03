import React from "react";
import type { DraftReservation } from "../../types";
import ReservationFields from "./ReservationFields";

interface ReservationFormProps {
	draft: DraftReservation | null;
	setDraft: (draft: DraftReservation | null) => void;
	handleAdd: () => void;
	saving: boolean;
	tripMembers?: string[];
}

const ReservationForm: React.FC<ReservationFormProps> = ({
	draft,
	setDraft,
	handleAdd,
	saving,
	tripMembers = [],
}) => {
	if (!draft) return null;

	return (
		<div className='w-full p-6 border border-base-300 bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5 rounded-2xl space-y-6 shadow-md hover:shadow-lg transition-shadow'>
			<div className='space-y-2'>
				<p className='text-lg font-bold text-base-content'>
					Adicionar Nova Reserva
				</p>
				<div className='h-1 w-16 bg-gradient-to-r from-primary to-secondary rounded-full' />
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<ReservationFields
					values={draft}
					onChange={(field, value) =>
						setDraft({
							...draft,
							[field]: value,
						} as DraftReservation)
					}
					tripMembers={tripMembers}
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
						!draft.city ||
						!draft.hotelName ||
						!draft.hotelAddress ||
						!draft.reservationValue ||
						!draft.reservedByEmail ||
						!draft.paymentType ||
						(draft.paymentType === "pago_pelo_reservante" &&
							!draft.paymentDueDate) ||
						!draft.timezone ||
						!draft.checkInDate ||
						!draft.checkOutDate
					}>
					{saving && (
						<span className='loading loading-spinner loading-xs' />
					)}
					Salvar Reserva
				</button>
			</div>
		</div>
	);
};

export default ReservationForm;
