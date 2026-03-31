import { useNavigate } from "react-router-dom";
import { useTripContext } from "../../../context/TripContext";
import AppIcon from "../../Icons/AppIcon";
import CountryFlag from "../../Icons/CountryFlag";
import IconButton from "./children/IconButton";

interface TripSelectorProps {
	variant?: "desktop-inline" | "mobile-flag";
}

export default function TripSelector({
	variant = "desktop-inline",
}: TripSelectorProps) {
	const { trips, activeTrip, selectTrip, loading } = useTripContext();
	const navigate = useNavigate();

	const openNewTrip = () => navigate("/new-trip");

	const openEditTrip = () => {
		(
			document.getElementById("modal-edit-trip") as HTMLDialogElement
		)?.showModal();
	};

	if (variant === "mobile-flag") {
		return (
			<button
				type='button'
				onClick={() => navigate("/select-trip")}
				className='h-9 w-9 rounded-lg border border-base-300 bg-base-200/60 flex items-center justify-center'
				aria-label='Selecionar viagem'>
				{loading ? (
					<span className='loading loading-spinner loading-xs' />
				) : (
					<CountryFlag
						country={activeTrip?.country}
						className='text-base leading-none'
					/>
				)}
			</button>
		);
	}

	return (
		<div className='w-full'>
			{loading ? (
				<div className='flex items-center gap-2 text-xs text-base-content/50'>
					<span className='loading loading-spinner loading-xs' />
					<span>Carregando viagens...</span>
				</div>
			) : trips.length > 0 ? (
				<div className='flex items-center gap-2'>
					<div className='rounded-md border border-base-300 bg-base-200/40 px-2 py-1.5 min-w-0 flex-1'>
						<div className='flex items-center gap-2'>
							<div className='h-6 w-6 rounded-md bg-base-100 border border-base-300 flex items-center justify-center shrink-0'>
								<CountryFlag
									country={activeTrip?.country}
									className='text-sm leading-none'
								/>
							</div>
							<div className='flex-1 min-w-0 relative'>
								<select
									className='w-full bg-transparent border-0 text-sm font-medium leading-5 pr-6 pl-0 appearance-none focus:outline-none'
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
								<div className='pointer-events-none absolute inset-y-0 right-0 flex items-center'>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className='h-3.5 w-3.5 text-base-content/50'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
										aria-hidden='true'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											d='M19 9l-7 7-7-7'
										/>
									</svg>
								</div>
							</div>
						</div>
					</div>
					<div className='hidden lg:flex items-center justify-end gap-0.5'>
						<IconButton
							onClick={() => navigate("/select-trip")}
							label='Trocar viagem'
							className='text-base-content/50'
							icon='switch'
						/>
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
					</div>
				</div>
			) : (
				<div className='rounded-md border border-dashed border-base-300 bg-base-200/20 p-2 space-y-2'>
					<div className='flex items-center gap-2 text-xs text-base-content/60'>
						<AppIcon name='reservations' className='h-3.5 w-3.5' />
						<span>Nenhuma viagem selecionada</span>
					</div>
					<button
						type='button'
						className='btn btn-xs w-full'
						onClick={openNewTrip}>
						Nova viagem
					</button>
				</div>
			)}
		</div>
	);
}
