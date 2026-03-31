import "./index.css";
import {
	HashRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import Login from "./Login";
import Dashboard from "./Dashboard";
import InvitePage from "./components/trips/InvitePage";
import TripSelectPage from "./components/trips/TripSelectPage";
import NewTripPage from "./components/trips/NewTripModal";
import { TripProvider } from "./context/TripContext";
import { getDefaultTripId } from "./utils/tripCookie";

function App() {
	const [user, loading] = useAuthState(auth);

	if (loading) {
		return <div>Carregando...</div>;
	}

	return (
		<Router>
			<Routes>
				<Route
					path='/'
					element={
						user ? (
							getDefaultTripId() ? (
								<Navigate to='/dashboard' />
							) : (
								<Navigate to='/select-trip' />
							)
						) : (
							<Login />
						)
					}
				/>
				<Route
					path='/select-trip'
					element={user ? <TripSelectPage /> : <Navigate to='/' />}
				/>
				<Route
					path='/new-trip'
					element={
						user ? (
							<TripProvider>
								<NewTripPage />
							</TripProvider>
						) : (
							<Navigate to='/' />
						)
					}
				/>
				<Route
					path='/dashboard'
					element={user ? <Dashboard /> : <Navigate to='/' />}
				/>
				<Route path='/invite/:inviteId' element={<InvitePage />} />
			</Routes>
		</Router>
	);
}

export default App;
