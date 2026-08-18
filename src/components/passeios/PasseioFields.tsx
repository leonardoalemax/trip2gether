import React from "react";
import MDEditor from "@uiw/react-md-editor";
import type {
	DraftPasseio,
	PasseioCheckpoint,
	PasseioItem,
	PasseioItemType,
} from "../../types";
import { TIMEZONE_OPTIONS } from "../tickets/timezoneOptions";

interface PasseioFieldsProps {
	values: Partial<DraftPasseio> | DraftPasseio;
	onChange: <K extends keyof DraftPasseio>(
		field: K,
		value: DraftPasseio[K],
	) => void;
	onBlur?: <K extends keyof DraftPasseio>(
		field: K,
		value: DraftPasseio[K],
	) => void;
}

export const PASSEIO_ITEM_TYPE_OPTIONS: {
	value: PasseioItemType;
	label: string;
}[] = [
	{ value: "ingresso", label: "Ingresso" },
	{ value: "transporte", label: "Transporte" },
	{ value: "outros", label: "Outros" },
];

function createEmptyPasseioItem(): PasseioItem {
	return {
		id: crypto.randomUUID(),
		title: "",
		type: "ingresso",
		value: "",
		purchased: false,
	};
}

function createEmptyPasseioCheckpoint(): PasseioCheckpoint {
	return {
		id: crypto.randomUUID(),
		title: "",
		address: "",
		entryTime: "",
		exitTime: "",
	};
}

const PasseioFields: React.FC<PasseioFieldsProps> = ({
	values,
	onChange,
	onBlur,
}) => {
	const items = values.items || [];

	const updateItems = (next: PasseioItem[], persist: boolean) => {
		onChange("items", next);
		if (persist) onBlur?.("items", next);
	};

	const updateItem = (
		index: number,
		patch: Partial<PasseioItem>,
		persist: boolean,
	) => {
		const next = items.map((item, i) =>
			i === index ? { ...item, ...patch } : item,
		);
		updateItems(next, persist);
	};

	const addItem = () => {
		updateItems([...items, createEmptyPasseioItem()], true);
	};

	const removeItem = (index: number) => {
		updateItems(
			items.filter((_, i) => i !== index),
			true,
		);
	};

	const checkpoints = values.checkpoints || [];

	const updateCheckpoints = (next: PasseioCheckpoint[], persist: boolean) => {
		onChange("checkpoints", next);
		if (persist) onBlur?.("checkpoints", next);
	};

	const updateCheckpoint = (
		index: number,
		patch: Partial<PasseioCheckpoint>,
		persist: boolean,
	) => {
		const next = checkpoints.map((checkpoint, i) =>
			i === index ? { ...checkpoint, ...patch } : checkpoint,
		);
		updateCheckpoints(next, persist);
	};

	const addCheckpoint = () => {
		updateCheckpoints([...checkpoints, createEmptyPasseioCheckpoint()], true);
	};

	const removeCheckpoint = (index: number) => {
		updateCheckpoints(
			checkpoints.filter((_, i) => i !== index),
			true,
		);
	};

	return (
		<>
			{/* Informações Section */}
			<div className='col-span-2 space-y-4'>
				<h3 className='text-sm font-semibold text-base-content/80 flex items-center gap-2'>
					<span className='text-lg'>🗺️</span> Informações
				</h3>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div className='form-control md:col-span-2'>
						<label className='label py-1 px-0'>
							<span className='label-text text-xs font-semibold text-base-content/70'>
								Título
							</span>
						</label>
						<input
							type='text'
							placeholder='Ex: Templo Fushimi Inari'
							value={values.title || ""}
							onBlur={(e) => onBlur?.("title", e.target.value)}
							onChange={(e) => onChange("title", e.target.value)}
							className='input input-bordered input-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30'
						/>
					</div>

					<div className='form-control'>
						<label className='label py-1 px-0'>
							<span className='label-text text-xs font-semibold text-base-content/70'>
								Cidade
							</span>
						</label>
						<input
							type='text'
							placeholder='Ex: Kyoto'
							value={values.city || ""}
							onBlur={(e) => onBlur?.("city", e.target.value)}
							onChange={(e) => onChange("city", e.target.value)}
							className='input input-bordered input-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30'
						/>
					</div>

					<div className='form-control'>
						<label className='label py-1 px-0'>
							<span className='label-text text-xs font-semibold text-base-content/70'>
								Endereço
							</span>
						</label>
						<input
							type='text'
							placeholder='Ex: Fushimi Inari-taisha, 68 Fukakusa'
							value={values.address || ""}
							onBlur={(e) => onBlur?.("address", e.target.value)}
							onChange={(e) => onChange("address", e.target.value)}
							className='input input-bordered input-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30'
						/>
					</div>
				</div>
			</div>

			{/* Horários Section */}
			<div className='col-span-2 space-y-4'>
				<h3 className='text-sm font-semibold text-base-content/80 flex items-center gap-2'>
					<span className='text-lg'>🕒</span> Ida e volta
				</h3>
				<div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
					<div className='form-control'>
						<label className='label py-1 px-0'>
							<span className='label-text text-xs font-semibold text-base-content/70'>
								Data de ida
							</span>
						</label>
						<input
							type='date'
							value={values.departureDate || ""}
							onBlur={(e) =>
								onBlur?.("departureDate", e.target.value)
							}
							onChange={(e) =>
								onChange("departureDate", e.target.value)
							}
							className='input input-bordered input-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30'
						/>
					</div>

					<div className='form-control'>
						<label className='label py-1 px-0'>
							<span className='label-text text-xs font-semibold text-base-content/70'>
								Hora de ida
							</span>
						</label>
						<input
							type='time'
							value={values.departureTime || ""}
							onBlur={(e) =>
								onBlur?.("departureTime", e.target.value)
							}
							onChange={(e) =>
								onChange("departureTime", e.target.value)
							}
							className='input input-bordered input-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30'
						/>
					</div>

					<div className='form-control'>
						<label className='label py-1 px-0'>
							<span className='label-text text-xs font-semibold text-base-content/70'>
								Data de volta
							</span>
						</label>
						<input
							type='date'
							value={values.returnDate || ""}
							onBlur={(e) => onBlur?.("returnDate", e.target.value)}
							onChange={(e) =>
								onChange("returnDate", e.target.value)
							}
							className='input input-bordered input-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30'
						/>
					</div>

					<div className='form-control'>
						<label className='label py-1 px-0'>
							<span className='label-text text-xs font-semibold text-base-content/70'>
								Hora de volta
							</span>
						</label>
						<input
							type='time'
							value={values.returnTime || ""}
							onBlur={(e) => onBlur?.("returnTime", e.target.value)}
							onChange={(e) =>
								onChange("returnTime", e.target.value)
							}
							className='input input-bordered input-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30'
						/>
					</div>
				</div>
			</div>

			{/* Settings Section */}
			<div className='col-span-2 space-y-4'>
				<h3 className='text-sm font-semibold text-base-content/80 flex items-center gap-2'>
					<span className='text-lg'>⚙️</span> Configurações
				</h3>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div className='form-control'>
						<label className='label py-1 px-0'>
							<span className='label-text text-xs font-semibold text-base-content/70'>
								Timezone
							</span>
						</label>
						<select
							value={values.timezone || ""}
							onChange={(e) =>
								onChange("timezone", e.target.value)
							}
							onBlur={(e) => onBlur?.("timezone", e.target.value)}
							className='select select-bordered select-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30'>
							<option value=''>Selecione</option>
							{TIMEZONE_OPTIONS.map((tz) => (
								<option key={tz.value} value={tz.value}>
									{tz.label}
								</option>
							))}
						</select>
					</div>

					<div className='form-control'>
						<label className='label py-1 px-0'>
							<span className='label-text text-xs font-semibold text-base-content/70'>
								Cor do Passeio
							</span>
						</label>
						<div className='flex items-center gap-2'>
							<input
								type='color'
								value={values.color || "#ddd6fe"}
								onChange={(e) =>
									onChange("color", e.target.value)
								}
								onBlur={(e) => onBlur?.("color", e.target.value)}
								className='input input-bordered input-sm h-10 w-16 p-1 rounded-lg cursor-pointer'
							/>
							<input
								type='text'
								value={values.color || "#ddd6fe"}
								onChange={(e) =>
									onChange("color", e.target.value)
								}
								onBlur={(e) => onBlur?.("color", e.target.value)}
								placeholder='#ddd6fe'
								className='input input-bordered input-sm rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-primary/30'
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Items Section */}
			<div className='col-span-2 space-y-3'>
				<div className='flex items-center justify-between'>
					<h3 className='text-sm font-semibold text-base-content/80 flex items-center gap-2'>
						<span className='text-lg'>🎟️</span> Ingressos, transporte
						e outros
					</h3>
					<button
						type='button'
						className='btn btn-ghost btn-xs'
						onClick={addItem}>
						+ Item
					</button>
				</div>

				{items.length === 0 && (
					<p className='text-xs text-base-content/40'>
						Nenhum item adicionado.
					</p>
				)}

				<div className='space-y-2'>
					{items.map((item, index) => (
						<div
							key={item.id}
							className='flex flex-wrap items-center gap-2 bg-base-200/40 rounded-lg p-2'>
							<input
								type='checkbox'
								checked={item.purchased}
								onChange={(e) =>
									updateItem(
										index,
										{ purchased: e.target.checked },
										true,
									)
								}
								className='checkbox checkbox-sm checkbox-primary'
								aria-label='Comprado'
							/>
							<input
								type='text'
								placeholder='Ex: Ingresso do templo'
								value={item.title}
								onChange={(e) =>
									updateItem(
										index,
										{ title: e.target.value },
										false,
									)
								}
								onBlur={() => updateItems(items, true)}
								className='input input-bordered input-sm rounded-lg flex-1 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-primary/30'
							/>
							<select
								value={item.type}
								onChange={(e) =>
									updateItem(
										index,
										{
											type: e.target
												.value as PasseioItemType,
										},
										true,
									)
								}
								className='select select-bordered select-sm rounded-lg'>
								{PASSEIO_ITEM_TYPE_OPTIONS.map((option) => (
									<option
										key={option.value}
										value={option.value}>
										{option.label}
									</option>
								))}
							</select>
							<input
								type='text'
								placeholder='R$ 0,00'
								value={item.value || ""}
								onChange={(e) =>
									updateItem(
										index,
										{ value: e.target.value },
										false,
									)
								}
								onBlur={() => updateItems(items, true)}
								className='input input-bordered input-sm rounded-lg w-24 focus:outline-none focus:ring-2 focus:ring-primary/30'
							/>
							<button
								type='button'
								aria-label='Remover item'
								className='btn btn-ghost btn-xs btn-square text-error'
								onClick={() => removeItem(index)}>
								✕
							</button>
						</div>
					))}
				</div>
			</div>

			{/* Checkpoints Section */}
			<div className='col-span-2 space-y-3'>
				<div className='flex items-center justify-between'>
					<h3 className='text-sm font-semibold text-base-content/80 flex items-center gap-2'>
						<span className='text-lg'>📍</span> Checkpoints de
						atrações
					</h3>
					<button
						type='button'
						className='btn btn-ghost btn-xs'
						onClick={addCheckpoint}>
						+ Checkpoint
					</button>
				</div>

				{checkpoints.length === 0 && (
					<p className='text-xs text-base-content/40'>
						Nenhum checkpoint adicionado.
					</p>
				)}

				<div className='space-y-2'>
					{checkpoints.map((checkpoint, index) => (
						<div
							key={checkpoint.id}
							className='flex flex-wrap items-center gap-2 bg-base-200/40 rounded-lg p-2'>
							<input
								type='text'
								placeholder='Ex: Templo Kiyomizu-dera'
								value={checkpoint.title}
								onChange={(e) =>
									updateCheckpoint(
										index,
										{ title: e.target.value },
										false,
									)
								}
								onBlur={() => updateCheckpoints(checkpoints, true)}
								className='input input-bordered input-sm rounded-lg flex-1 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-primary/30'
							/>
							<input
								type='text'
								placeholder='Endereço'
								value={checkpoint.address || ""}
								onChange={(e) =>
									updateCheckpoint(
										index,
										{ address: e.target.value },
										false,
									)
								}
								onBlur={() => updateCheckpoints(checkpoints, true)}
								className='input input-bordered input-sm rounded-lg flex-1 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-primary/30'
							/>
							<input
								type='time'
								aria-label='Hora de entrada'
								value={checkpoint.entryTime}
								onChange={(e) =>
									updateCheckpoint(
										index,
										{ entryTime: e.target.value },
										true,
									)
								}
								className='input input-bordered input-sm rounded-lg w-28'
							/>
							<input
								type='time'
								aria-label='Hora de saída'
								value={checkpoint.exitTime}
								onChange={(e) =>
									updateCheckpoint(
										index,
										{ exitTime: e.target.value },
										true,
									)
								}
								className='input input-bordered input-sm rounded-lg w-28'
							/>
							<button
								type='button'
								aria-label='Remover checkpoint'
								className='btn btn-ghost btn-xs btn-square text-error'
								onClick={() => removeCheckpoint(index)}>
								✕
							</button>
						</div>
					))}
				</div>
			</div>

			{/* Description Section */}
			<div className='col-span-2 space-y-2'>
				<h3 className='text-sm font-semibold text-base-content/80 flex items-center gap-2'>
					<span className='text-lg'>📝</span> Descrição
				</h3>
				<div data-color-mode='light'>
					<MDEditor
						value={values.descriptionMd || ""}
						onChange={(value) =>
							onChange("descriptionMd", value || "")
						}
						textareaProps={{
							onBlur: () =>
								onBlur?.("descriptionMd", values.descriptionMd || ""),
							placeholder: "Escreva os detalhes do passeio em Markdown...",
						}}
						height={220}
						preview='live'
					/>
				</div>
			</div>
		</>
	);
};

export default PasseioFields;
