import React, { useState } from "react";
import { ScreenType } from "./types";
import { TripProvider } from "./context/TripContext";
import Layout from "./components/layout/Layout";
import CalendarViewScreen from "./components/calendar/CalendarViewScreen";
import TripItineraryScreen from "./components/itinerary/TripItineraryScreen";
import TicketsScreen from "./components/tickets/TicketsScreen";
import ReservationsScreen from "./components/reservations/ReservationsScreen";
import PasseiosScreen from "./components/passeios/PasseiosScreen";
import PaymentsScreen from "./components/payments/PaymentsScreen";
import EditTripModal from "./components/trips/EditTripModal";

function Dashboard() {
	const [activeScreen, setActiveScreen] = useState<ScreenType>("calendar");

	const handlePrimary = () => {
		// No-op while each screen handles creation actions internally.
	};

	return (
		<TripProvider>
			<Layout
				activeScreen={activeScreen}
				onScreenChange={setActiveScreen}
				onPrimary={handlePrimary}>
				{activeScreen === "calendar" && <CalendarViewScreen />}
				{activeScreen === "itinerary" && <TripItineraryScreen />}
				{activeScreen === "tickets" && <TicketsScreen />}
				{activeScreen === "reservations" && <ReservationsScreen />}
				{activeScreen === "passeios" && <PasseiosScreen />}
				{activeScreen === "payments" && <PaymentsScreen />}
			</Layout>
			<EditTripModal id='modal-edit-trip' />
		</TripProvider>
	);
}

export default Dashboard;
