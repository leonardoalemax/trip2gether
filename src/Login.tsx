import React from "react";
import { loginWithGoogle, loginWithEmail } from "./firebase";

function Login() {
	const handleGoogleLogin = async () => {
		try {
			await loginWithGoogle();
		} catch (error) {
			console.error("Erro ao fazer login com Google:", error);
		}
	};

	const handleEmailLogin = async () => {
		try {
			await loginWithEmail("email@example.com", "password123");
		} catch (error) {
			console.error("Erro ao fazer login com email:", error);
		}
	};

	return (
		<div className='flex flex-col items-center justify-center h-screen'>
			<h1 className='text-2xl font-bold mb-4'>Login</h1>
			<button
				onClick={handleGoogleLogin}
				className='bg-blue-500 text-white px-4 py-2 rounded mb-2'>
				Login com Google
			</button>
			<button
				onClick={handleEmailLogin}
				className='bg-green-500 text-white px-4 py-2 rounded'>
				Login com Email
			</button>
		</div>
	);
}

export default Login;
