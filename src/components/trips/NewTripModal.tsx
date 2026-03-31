import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTripContext } from "../../context/TripContext";
import { TIMEZONE_OPTIONS } from "../tickets/timezoneOptions";

export default function NewTripPage() {
	const { addTrip } = useTripContext();
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [country, setCountry] = useState("");
	const [defaultTimezone, setDefaultTimezone] = useState("");
	const [saving, setSaving] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim() || !country.trim()) return;
		setSaving(true);
		try {
			await addTrip(
				name.trim(),
				country.trim(),
				defaultTimezone || undefined,
			);
			navigate("/dashboard");
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className='min-h-screen bg-base-200 flex flex-col items-center justify-center p-4'>
			<div className='card bg-base-100 shadow-sm border border-base-200 w-full max-w-md'>
				<div className='card-body'>
					<div className='flex items-center gap-2 mb-2'>
						<button
							type='button'
							className='btn btn-ghost btn-sm btn-circle'
							onClick={() => navigate(-1)}>
							←
						</button>
						<h2 className='card-title text-lg'>Nova Viagem</h2>
					</div>
					<form onSubmit={handleSubmit} className='space-y-4 mt-2'>
						<div className='form-control'>
							<label className='label'>
								<span className='label-text'>
									Nome da viagem
								</span>
							</label>
							<input
								type='text'
								placeholder='Ex: Japão Set 2025'
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
							<input
								type='text'
								placeholder='Ex: Japão'
								value={country}
								onChange={(e) => setCountry(e.target.value)}
								className='input input-bordered w-full'
								required
							/>
						</div>
						<div className='form-control'>
							<label className='label'>
								<span className='label-text'>
									Timezone padrão
								</span>
							</label>
							<select
								value={defaultTimezone}
								onChange={(e) =>
									setDefaultTimezone(e.target.value)
								}
								className='select select-bordered w-full'>
								<option value=''>Não definido</option>
								{TIMEZONE_OPTIONS.map((tz) => (
									<option key={tz.value} value={tz.value}>
										{tz.label}
									</option>
								))}
							</select>
						</div>
						<button
							type='submit'
							className='btn btn-primary w-full'
							disabled={saving}>
							{saving ? (
								<span className='loading loading-spinner loading-sm' />
							) : (
								"Criar viagem"
							)}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
