import React, { useCallback, useEffect, useState } from "react";
import { useTripContext } from "../../context/TripContext";
import { getReservations } from "../../services/reservationService";
import type { Reservation } from "../../types";

interface PaymentReport {
	reservationId: string;
	hotelName: string;
	city: string;
	reservedByEmail: string;
	payTo: string;
	paymentDueDate?: string;
	totalValue: number;
	numberOfTravelers: number;
	perTravelerAmount: number;
	paymentType: string;
}

const PaymentsScreen: React.FC = () => {
	const { activeTrip } = useTripContext();
	const [reservations, setReservations] = useState<Reservation[]>([]);
	const [loading, setLoading] = useState(false);
	const [paymentReports, setPaymentReports] = useState<PaymentReport[]>([]);

	const fetchReservations = useCallback(async () => {
		if (!activeTrip) return;
		setLoading(true);
		try {
			const data = await getReservations(activeTrip.id);
			setReservations(data);
		} finally {
			setLoading(false);
		}
	}, [activeTrip]);

	useEffect(() => {
		fetchReservations();
	}, [fetchReservations]);

	// Calcular relatório de pagamentos por reserva
	useEffect(() => {
		if (!activeTrip || !reservations.length) {
			setPaymentReports([]);
			return;
		}

		// Determinar número de viajantes da viagem
		const numberOfTravelers = activeTrip.travelers || 1;

		// Calcular relatório por reserva
		const reports: PaymentReport[] = reservations.map((r) => {
			const value =
				parseFloat(
					r.reservationValue
						.replace(/[^0-9.,]/g, "")
						.replace(",", "."),
				) || 0;
			const perTraveler = value / numberOfTravelers;
			const hotelName = r.hotelName || "Hotel não informado";
			const reservedByEmail =
				r.reservedByEmail || "Reservante não informado";
			const payTo =
				r.paymentType === "pago_pelo_reservante"
					? reservedByEmail
					: hotelName;

			return {
				reservationId: r.id,
				hotelName,
				city: r.city || "Cidade não informada",
				reservedByEmail,
				payTo,
				paymentDueDate: r.paymentDueDate,
				totalValue: value,
				numberOfTravelers,
				perTravelerAmount: perTraveler,
				paymentType: r.paymentType,
			};
		});

		setPaymentReports(reports);
	}, [activeTrip, reservations]);

	if (!activeTrip) {
		return (
			<div className='p-6 text-base-content/50 text-sm'>
				Selecione uma viagem para ver os pagamentos.
			</div>
		);
	}

	if (loading) {
		return (
			<div className='p-6 flex justify-center'>
				<span className='loading loading-spinner loading-lg' />
			</div>
		);
	}

	if (!paymentReports.length) {
		return (
			<div className='p-6 text-center'>
				<p className='text-base-content/50 text-sm mb-4'>
					Nenhuma reserva encontrada para esta viagem.
				</p>
			</div>
		);
	}

	// Calcular totais
	const totalValue = paymentReports.reduce((sum, r) => sum + r.totalValue, 0);
	const totalPerTraveler = paymentReports.reduce(
		(sum, r) => sum + r.perTravelerAmount,
		0,
	);

	return (
		<div className='p-4 space-y-6 max-w-4xl mx-auto'>
			<div className='space-y-2'>
				<h2 className='text-2xl font-bold'>
					💰 Relatório de Pagamentos
				</h2>
				<p className='text-sm text-base-content/60'>
					Divisão de custos entre {activeTrip.travelers} viajantes
				</p>
			</div>

			{/* Resumo Total */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
				<div className='card bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20'>
					<div className='card-body p-4'>
						<p className='text-sm text-base-content/70'>
							Total de Reservas
						</p>
						<p className='text-2xl font-bold text-primary'>
							{paymentReports.length}
						</p>
					</div>
				</div>

				<div className='card bg-gradient-to-br from-success/10 to-success/5 border border-success/20'>
					<div className='card-body p-4'>
						<p className='text-sm text-base-content/70'>
							Valor Total
						</p>
						<p className='text-2xl font-bold text-success'>
							R$ {totalValue.toFixed(2)}
						</p>
					</div>
				</div>

				<div className='card bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20'>
					<div className='card-body p-4'>
						<p className='text-sm text-base-content/70'>
							Por Viajante Total
						</p>
						<p className='text-2xl font-bold text-accent'>
							R$ {totalPerTraveler.toFixed(2)}
						</p>
					</div>
				</div>
			</div>

			{/* Detalhes - Por Reserva */}
			<div className='space-y-4'>
				<h3 className='text-lg font-semibold text-base-content/80 flex items-center gap-2'>
					<span className='text-2xl'>🏨</span> Reservas
				</h3>

				<div className='space-y-3'>
					{paymentReports.map((report, idx) => (
						<div
							key={report.reservationId}
							className='card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow'>
							<div className='card-body p-4'>
								<div className='flex items-start justify-between gap-4 mb-3'>
									<div className='flex-1'>
										<div className='flex items-center gap-2 mb-2'>
											<span className='badge badge-primary badge-outline'>
												#{idx + 1}
											</span>
											<h4 className='font-bold text-base'>
												{report.hotelName}
											</h4>
										</div>
										<p className='text-sm text-base-content/60 mb-2'>
											📍 {report.city}
										</p>
										<p className='text-xs text-base-content/70'>
											Reservado por:{" "}
											<span className='font-semibold'>
												{report.reservedByEmail}
											</span>
										</p>
										<p className='text-xs text-base-content/70 mt-1'>
											Pagar para:{" "}
											<span className='font-semibold'>
												{report.payTo}
											</span>
										</p>
										{report.paymentDueDate && (
											<p className='text-xs text-orange-600 font-semibold mt-1.5'>
												📅 Data de Vencimento:{" "}
												{new Date(
													report.paymentDueDate,
												).toLocaleDateString("pt-BR")}
											</p>
										)}
									</div>
								</div>

								<div className='divider my-2' />

								<div className='grid grid-cols-3 gap-3'>
									<div className='text-center p-2 bg-base-200/50 rounded-lg'>
										<p className='text-xs text-base-content/60 mb-1'>
											Valor Total
										</p>
										<p className='text-lg font-bold text-base-content'>
											R$ {report.totalValue.toFixed(2)}
										</p>
									</div>

									<div className='text-center p-2 bg-base-200/50 rounded-lg flex flex-col justify-center'>
										<p className='text-xs text-base-content/60'>
											÷
										</p>
										<p className='text-lg font-bold text-base-content'>
											{report.numberOfTravelers}
										</p>
									</div>

									<div className='text-center p-2 bg-primary/10 rounded-lg'>
										<p className='text-xs text-base-content/60 mb-1'>
											Por Viajante
										</p>
										<p className='text-lg font-bold text-primary'>
											R${" "}
											{report.perTravelerAmount.toFixed(
												2,
											)}
										</p>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default PaymentsScreen;
