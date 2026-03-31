import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { acceptInvite, getInviteById } from "../../services/tripServices";
import { Trip, TripInvite } from "@/types";

export default function InvitePage() {
	const { inviteId } = useParams<{ inviteId: string }>();
	const [user, loadingAuth] = useAuthState(auth);
	const navigate = useNavigate();

	const [invite, setInvite] = useState<TripInvite | null>(null);
	const [trip, setTrip] = useState<Trip | null>(null);
	const [status, setStatus] = useState<
		"loading" | "accepted" | "error" | "not-found"
	>("loading");

	useEffect(() => {
		if (loadingAuth) return;
		if (!inviteId) {
			setStatus("not-found");
			return;
		}

		(async () => {
			try {
				const inv = await getInviteById(inviteId);
				if (!inv) {
					setStatus("not-found");
					return;
				}
				setInvite(inv);

				if (inv.accepted) {
					setStatus("accepted");
					return;
				}

				const t = await acceptInvite(inviteId);
				setTrip(t);
				setStatus("accepted");
			} catch {
				setStatus("error");
			}
		})();
	}, [inviteId, loadingAuth]);

	if (status === "loading" || loadingAuth) {
		return (
			<div className='flex items-center justify-center h-screen'>
				<span className='loading loading-spinner loading-lg text-primary' />
			</div>
		);
	}

	if (status === "not-found") {
		return (
			<div className='flex flex-col items-center justify-center h-screen gap-4'>
				<div className='text-6xl'>🔍</div>
				<h1 className='text-2xl font-bold'>Convite não encontrado</h1>
				<p className='text-base-content/60'>
					Este link de convite é inválido ou já expirou.
				</p>
				<button
					className='btn btn-primary'
					onClick={() => navigate("/")}>
					Ir para o início
				</button>
			</div>
		);
	}

	if (status === "error") {
		return (
			<div className='flex flex-col items-center justify-center h-screen gap-4'>
				<div className='text-6xl'>⚠️</div>
				<h1 className='text-2xl font-bold'>
					Erro ao processar convite
				</h1>
				<p className='text-base-content/60'>
					Tente novamente mais tarde.
				</p>
				<button
					className='btn btn-primary'
					onClick={() => navigate("/")}>
					Ir para o início
				</button>
			</div>
		);
	}

	return (
		<div className='flex flex-col items-center justify-center h-screen gap-4'>
			<div className='text-6xl'>🎉</div>
			<h1 className='text-2xl font-bold'>
				Você foi adicionado à viagem!
			</h1>
			{trip && (
				<div className='text-center'>
					<p className='text-lg font-semibold'>{trip.name}</p>
					<p className='text-base-content/60'>
						Destino: {trip.country}
					</p>
				</div>
			)}
			{invite && !trip && (
				<p className='text-base-content/60'>
					Convite para <strong>{invite.email}</strong> aceito com
					sucesso.
				</p>
			)}
			{user ? (
				<button
					className='btn btn-primary'
					onClick={() => navigate("/dashboard")}>
					Ir para o dashboard
				</button>
			) : (
				<button
					className='btn btn-primary'
					onClick={() => navigate("/")}>
					Fazer login para acessar
				</button>
			)}
		</div>
	);
}
