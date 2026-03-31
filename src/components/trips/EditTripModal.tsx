import React, { useState } from "react";
import { useTripContext } from "../../context/TripContext";
import {
	addEmailToWhitelist,
	removeEmailFromWhitelist,
	createInvite,
} from "../../services/tripServices";
import { TIMEZONE_OPTIONS } from "../tickets/timezoneOptions";
import { COUNTRY_OPTIONS, isCountryInOptions } from "./countryOptions";

interface Props {
	id: string;
}

export default function EditTripModal({ id }: Props) {
	const { activeTrip, editTrip, refreshTrips } = useTripContext();
	const [name, setName] = useState("");
	const [country, setCountry] = useState("");
	const [defaultTimezone, setDefaultTimezone] = useState("");
	const [newEmail, setNewEmail] = useState("");
	const [saving, setSaving] = useState(false);
	const [inviteLink, setInviteLink] = useState<string | null>(null);
	const [inviting, setInviting] = useState(false);

	React.useEffect(() => {
		if (activeTrip) {
			setName(activeTrip.name);
			setCountry(activeTrip.country);
			setDefaultTimezone(activeTrip.defaultTimezone || "");
			setInviteLink(null);
		}
	}, [activeTrip]);

	if (!activeTrip) return null;

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim() || !country.trim()) return;
		setSaving(true);
		try {
			await editTrip(activeTrip.id, {
				name: name.trim(),
				country: country.trim(),
				defaultTimezone: defaultTimezone || "",
			});
			(document.getElementById(id) as HTMLDialogElement)?.close();
		} finally {
			setSaving(false);
		}
	};

	const handleAddEmail = async () => {
		const email = newEmail.trim().toLowerCase();
		if (!email) return;
		await addEmailToWhitelist(activeTrip.id, email);
		setNewEmail("");
		await refreshTrips();
	};

	const handleRemoveEmail = async (email: string) => {
		if (email === activeTrip.ownerEmail) return;
		await removeEmailFromWhitelist(activeTrip.id, email);
		await refreshTrips();
	};

	const handleSendInvite = async () => {
		const email = newEmail.trim().toLowerCase();
		if (!email) return;
		setInviting(true);
		try {
			const invite = await createInvite(activeTrip.id, email);
			await addEmailToWhitelist(activeTrip.id, email);
			await refreshTrips();
			const link = `${window.location.origin}/invite/${invite.id}`;
			setInviteLink(link);
			setNewEmail("");
		} finally {
			setInviting(false);
		}
	};

	return (
		<dialog id={id} className='modal'>
			<div className='modal-box max-w-lg'>
				<form method='dialog'>
					<button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
						✕
					</button>
				</form>
				<h3 className='font-bold text-lg mb-4'>Editar Viagem</h3>

				<form onSubmit={handleSave} className='space-y-4'>
					<div className='form-control'>
						<label className='label'>
							<span className='label-text'>Nome</span>
						</label>
						<input
							type='text'
							value={name}
							onChange={(e) => setName(e.target.value)}
							className='input input-bordered w-full'
							required
						/>
					</div>
					<div className='form-control'>
						<label className='label'>
							<span className='label-text'>País destino</span>
						</label>
						<select
							value={country}
							onChange={(e) => setCountry(e.target.value)}
							className='select select-bordered w-full'
							required>
							<option value='' disabled>
								Selecione um país
							</option>
							{country && !isCountryInOptions(country) ? (
								<option value={country}>
									{country} (atual)
								</option>
							) : null}
							{COUNTRY_OPTIONS.map((option) => (
								<option key={option.value} value={option.value}>
									{option.flag} {option.label}
								</option>
							))}
						</select>
					</div>
					<div className='form-control'>
						<label className='label'>
							<span className='label-text'>Timezone padrão</span>
						</label>
						<select
							value={defaultTimezone}
							onChange={(e) => setDefaultTimezone(e.target.value)}
							className='select select-bordered w-full'>
							<option value=''>Não definido</option>
							{TIMEZONE_OPTIONS.map((tz) => (
								<option key={tz.value} value={tz.value}>
									{tz.label}
								</option>
							))}
						</select>
					</div>
					<div className='modal-action mt-2'>
						<button
							type='submit'
							className='btn btn-primary btn-sm'
							disabled={saving}>
							{saving ? (
								<span className='loading loading-spinner loading-sm' />
							) : (
								"Salvar"
							)}
						</button>
					</div>
				</form>

				<div className='divider'>Membros</div>

				<ul className='space-y-1 mb-3'>
					{activeTrip.whitelistedEmails.map((email) => (
						<li
							key={email}
							className='flex items-center justify-between text-sm bg-base-200 rounded-lg px-3 py-1.5'>
							<span>
								{email}
								{email === activeTrip.ownerEmail && (
									<span className='badge badge-xs badge-primary ml-2'>
										dono
									</span>
								)}
							</span>
							{email !== activeTrip.ownerEmail && (
								<button
									className='btn btn-ghost btn-xs text-error'
									onClick={() => handleRemoveEmail(email)}>
									✕
								</button>
							)}
						</li>
					))}
				</ul>

				<div className='divider'>Convidar usuário</div>

				<div className='flex gap-2'>
					<input
						type='email'
						placeholder='email@exemplo.com'
						value={newEmail}
						onChange={(e) => {
							setNewEmail(e.target.value);
							setInviteLink(null);
						}}
						className='input input-bordered input-sm flex-1'
					/>
					<button
						className='btn btn-sm btn-outline'
						onClick={handleAddEmail}
						disabled={!newEmail.trim()}>
						Adicionar
					</button>
					<button
						className='btn btn-sm btn-primary'
						onClick={handleSendInvite}
						disabled={!newEmail.trim() || inviting}>
						{inviting ? (
							<span className='loading loading-spinner loading-xs' />
						) : (
							"Gerar convite"
						)}
					</button>
				</div>

				{inviteLink && (
					<div className='mt-3 bg-success/10 border border-success/30 rounded-lg p-3'>
						<p className='text-xs text-success font-medium mb-1'>
							Link de convite gerado:
						</p>
						<div className='flex items-center gap-2'>
							<input
								type='text'
								readOnly
								value={inviteLink}
								className='input input-bordered input-xs flex-1 font-mono text-xs'
							/>
							<button
								className='btn btn-xs btn-ghost'
								onClick={() =>
									navigator.clipboard.writeText(inviteLink)
								}>
								Copiar
							</button>
						</div>
					</div>
				)}
			</div>
			<form method='dialog' className='modal-backdrop'>
				<button>close</button>
			</form>
		</dialog>
	);
}
