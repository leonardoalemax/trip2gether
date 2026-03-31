import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import {
	getUserTrips,
	joinTripByAccessCode,
} from "../../services/tripServices";
import { setDefaultTripId } from "../../utils/tripCookie";
import type { Trip } from "@/types";

export default function TripSelectPage() {
	const [user] = useAuthState(auth);
	const navigate = useNavigate();
	const [trips, setTrips] = useState<Trip[]>([]);
	const [loading, setLoading] = useState(true);
	const [joinCode, setJoinCode] = useState("");
	const [joining, setJoining] = useState(false);
	const [joinError, setJoinError] = useState<string | null>(null);

	const loadTrips = async () => {
		if (!user?.email || !user.uid) return;
		setLoading(true);
		try {
			setTrips(await getUserTrips(user.email, user.uid));
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!user?.email || !user.uid) return;
		loadTrips();
	}, [user]);

	const handleSelect = (trip: Trip) => {
		setDefaultTripId(trip.id);
		navigate("/dashboard");
	};

	const handleNewTrip = () => {
		navigate("/new-trip");
	};

	const handleJoinByCode = async () => {
		if (!user?.email) return;
		const normalizedCode = joinCode.replace(/\D/g, "").slice(0, 6);
		if (normalizedCode.length !== 6) {
			setJoinError("Informe um codigo valido com 6 digitos.");
			return;
		}

		setJoining(true);
		setJoinError(null);
		try {
			const trip = await joinTripByAccessCode(normalizedCode, user.email);
			if (!trip) {
				setJoinError("Codigo nao encontrado.");
				return;
			}

			setDefaultTripId(trip.id);
			navigate("/dashboard");
		} finally {
			setJoining(false);
		}
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center h-screen'>
				<span className='loading loading-spinner loading-lg text-primary' />
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-base-200 flex flex-col items-center justify-center p-4'>
			<div className='max-w-md w-full'>
				<h1 className='text-2xl font-bold text-center mb-2'>
					Selecione uma viagem
				</h1>
				<p className='text-base-content/60 text-center text-sm mb-6'>
					Escolha a viagem que deseja acessar
				</p>

				<div className='card bg-base-100 shadow-sm border border-base-200 p-4 mb-4'>
					<p className='text-sm font-medium mb-2'>
						Entrar com codigo
					</p>
					<div className='flex gap-2'>
						<input
							type='text'
							inputMode='numeric'
							maxLength={6}
							placeholder='000000'
							value={joinCode}
							onChange={(e) => {
								setJoinCode(
									e.target.value
										.replace(/\D/g, "")
										.slice(0, 6),
								);
								setJoinError(null);
							}}
							className='input input-bordered input-sm flex-1 font-mono tracking-widest'
						/>
						<button
							type='button'
							onClick={handleJoinByCode}
							disabled={joining || joinCode.length !== 6}
							className='btn btn-primary btn-sm'>
							{joining ? (
								<span className='loading loading-spinner loading-xs' />
							) : (
								"Entrar"
							)}
						</button>
					</div>
					{joinError ? (
						<p className='text-xs text-error mt-2'>{joinError}</p>
					) : null}
				</div>

				{trips.length === 0 ? (
					<div className='card bg-base-100 shadow-sm border border-base-200 p-8 text-center'>
						<div className='text-5xl mb-4'>✈️</div>
						<p className='text-base-content/60 mb-4'>
							Você ainda não tem viagens. Crie uma para começar!
						</p>
						<button
							className='btn btn-primary'
							onClick={handleNewTrip}>
							Criar viagem
						</button>
					</div>
				) : (
					<div className='space-y-3'>
						{trips.map((trip) => (
							<button
								key={trip.id}
								onClick={() => handleSelect(trip)}
								className='card bg-base-100 shadow-sm border border-base-200 hover:border-primary hover:shadow-md transition-all w-full text-left p-4 cursor-pointer'>
								<div className='flex items-center justify-between'>
									<div>
										<p className='font-semibold text-sm'>
											{trip.name}
										</p>
										<p className='text-xs text-base-content/50'>
											{trip.country}
										</p>
									</div>
									<div className='text-base-content/30'>
										→
									</div>
								</div>
								<p className='text-xs text-base-content/30 mt-1'>
									{trip.whitelistedEmails.length} membro
									{trip.whitelistedEmails.length !== 1 && "s"}
								</p>
							</button>
						))}
						<div className='text-center pt-2'>
							<button
								className='btn btn-ghost btn-sm text-primary'
								onClick={handleNewTrip}>
								+ Criar nova viagem
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
