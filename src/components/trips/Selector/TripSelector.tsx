import { useNavigate } from "react-router-dom";
import { useTripContext } from "../../../context/TripContext";
import IconButton from "./children/IconButton";

export default function TripSelector() {
	const { trips, activeTrip, selectTrip, loading } = useTripContext();
	const navigate = useNavigate();

	const openNewTrip = () => navigate("/new-trip");

	const openEditTrip = () => {
		(
			document.getElementById("modal-edit-trip") as HTMLDialogElement
		)?.showModal();
	};

	return (
		<div className='p-3 border-b border-base-200'>
			{loading ? (
				<span className='loading loading-spinner loading-xs' />
			) : trips.length > 0 ? (
				<>
					<div className='flex items-center gap-1'>
						<select
							className='select select-xs select-bordered flex-1 font-semibold text-sm min-w-0'
							value={activeTrip?.id ?? ""}
							onChange={(e) => {
								const trip = trips.find(
									(t) => t.id === e.target.value,
								);
								if (trip) selectTrip(trip);
							}}>
							{trips.map((trip) => (
								<option key={trip.id} value={trip.id}>
									{trip.name}
								</option>
							))}
						</select>
					</div>
					<div className='flex items-center gap-1'>
						<IconButton
							onClick={openEditTrip}
							label='Editar viagem'
							icon='edit'
						/>
						<IconButton
							onClick={openNewTrip}
							label='Nova viagem'
							className='text-primary'
							icon='add'
						/>
						<IconButton
							onClick={() => navigate("/select-trip")}
							label='Trocar viagem'
							className='text-base-content/50'
							icon='switch'
						/>
					</div>
				</>
			) : (
				<div className='flex items-center justify-between'>
					<p className='text-xs text-base-content/50'>
						Nenhuma viagem
					</p>
					<IconButton
						onClick={openNewTrip}
						label='Nova viagem'
						className='text-primary'
						icon='add'
					/>
				</div>
			)}
		</div>
	);
}
