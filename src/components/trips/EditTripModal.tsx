import React, { useState } from "react";
import { useTripContext } from "../../context/TripContext";
import {
	ensureTripAccessCode,
	removeEmailFromWhitelist,
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
	const [travelers, setTravelers] = useState("");
	const [accessCode, setAccessCode] = useState("");
	const [saving, setSaving] = useState(false);
	const [copySuccess, setCopySuccess] = useState(false);

	React.useEffect(() => {
		if (activeTrip) {
			setName(activeTrip.name);
			setCountry(activeTrip.country);
			setDefaultTimezone(activeTrip.defaultTimezone || "");
			setTravelers(
				activeTrip.travelers ? String(activeTrip.travelers) : "",
			);
			setAccessCode(activeTrip.accessCode || "");
			setCopySuccess(false);
		}
	}, [activeTrip]);

	if (!activeTrip) return null;

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim() || !country.trim()) return;

		setSaving(true);
		try {
			const ensuredCode = await ensureTripAccessCode(activeTrip.id);

			await editTrip(activeTrip.id, {
				name: name.trim(),
				country: country.trim(),
				defaultTimezone: defaultTimezone || "",
				accessCode: ensuredCode,
				...(travelers ? { travelers: parseInt(travelers, 10) } : {}),
			});

			setAccessCode(ensuredCode);
			await refreshTrips();
		} catch (error: unknown) {
			console.error("Erro ao salvar viagem:", error);
			const message =
				error instanceof Error ? error.message : String(error);
			if (message.includes("Missing or insufficient permissions")) {
				alert(
					"Sem permissao no Firestore para gerar/atualizar a chave de acesso.",
				);
			} else {
				alert("Nao foi possivel salvar a viagem.");
			}
		} finally {
			setSaving(false);
		}
	};

	const handleRemoveEmail = async (email: string) => {
		if (email === activeTrip.ownerEmail) return;
		await removeEmailFromWhitelist(activeTrip.id, email);
		await refreshTrips();
	};

	const handleCopyCode = async () => {
		if (!accessCode) return;
		await navigator.clipboard.writeText(accessCode);
		setCopySuccess(true);
		setTimeout(() => setCopySuccess(false), 1600);
	};

	return (
		<dialog id={id} className='modal'>
			<div className='modal-box max-w-lg'>
				<form method='dialog'>
					<button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
						x
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
							<span className='label-text'>Pais destino</span>
						</label>
						<select
							value={country}
							onChange={(e) => setCountry(e.target.value)}
							className='select select-bordered w-full'
							required>
							<option value='' disabled>
								Selecione um pais
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
							<span className='label-text'>Timezone padrao</span>
						</label>
						<select
							value={defaultTimezone}
							onChange={(e) => setDefaultTimezone(e.target.value)}
							className='select select-bordered w-full'>
							<option value=''>Nao definido</option>
							{TIMEZONE_OPTIONS.map((tz) => (
								<option key={tz.value} value={tz.value}>
									{tz.label}
								</option>
							))}
						</select>
					</div>{" "}
					<div className='form-control'>
						<label className='label'>
							<span className='label-text'>
								Quantidade de viajantes
							</span>
						</label>
						<input
							type='number'
							placeholder='Ex: 4'
							min='1'
							value={travelers}
							onChange={(e) => setTravelers(e.target.value)}
							className='input input-bordered w-full'
						/>
					</div>{" "}
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

				<div className='mt-4 p-3 border border-base-200 rounded-lg bg-base-200/40'>
					<div className='flex items-center justify-between gap-2 mb-1'>
						<p className='text-sm font-semibold'>Chave de acesso</p>
						<span className='text-[11px] text-base-content/60'>
							6 digitos
						</span>
					</div>
					<p className='text-xs text-base-content/60 mb-2'>
						Use este codigo para outras pessoas entrarem na viagem
						em "Selecionar viagem".
					</p>
					<div className='flex items-center gap-2'>
						<input
							type='text'
							value={accessCode || "Salve a viagem para gerar"}
							readOnly
							disabled
							className='input input-bordered input-sm flex-1 font-mono tracking-widest'
						/>
						<button
							type='button'
							className='btn btn-sm btn-outline'
							onClick={handleCopyCode}
							disabled={!accessCode}>
							{copySuccess ? "Copiado" : "Copiar"}
						</button>
					</div>
				</div>

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
									x
								</button>
							)}
						</li>
					))}
				</ul>
			</div>
			<form method='dialog' className='modal-backdrop'>
				<button>close</button>
			</form>
		</dialog>
	);
}
