import "./index.css";
import { loginWithGoogle, loginWithEmail, registerWithEmail } from "./firebase";
import { useState } from "react";
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
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleGoogleLogin = async () => {
		try {
			const user = await loginWithGoogle();
			console.log("Usuário logado com Google:", user);
		} catch (error) {
			alert("Erro ao fazer login com Google");
		}
	};

	const handleEmailLogin = async () => {
		try {
			const user = await loginWithEmail(email, password);
			console.log("Usuário logado com email:", user);
		} catch (error) {
			alert("Erro ao fazer login com email e senha");
		}
	};

	const handleRegister = async () => {
		try {
			const user = await registerWithEmail(email, password);
			console.log("Usuário registrado:", user);
		} catch (error) {
			alert("Erro ao registrar usuário");
		}
	};

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
