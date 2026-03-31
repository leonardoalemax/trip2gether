import React from "react";
import { loginWithGoogle } from "./firebase";

function Login() {
	const handleGoogleLogin = async () => {
		try {
			await loginWithGoogle();
		} catch (error) {
			console.error("Erro ao fazer login com Google:", error);
		}
	};

	return (
		<div className='min-h-screen bg-base-200 flex items-center justify-center p-4'>
			<div className='w-full max-w-md rounded-2xl border border-base-300 bg-base-100 shadow-xl'>
				<div className='p-6 sm:p-8'>
					<div className='mb-6'>
						<p className='text-xs uppercase tracking-[0.16em] text-base-content/50'>
							Bem-vindo
						</p>
						<h1 className='mt-2 text-3xl font-bold'>Trip2Gether</h1>
						<p className='mt-3 text-sm text-base-content/70 leading-relaxed'>
							Organize viagens em grupo em um so lugar: passagens,
							reservas, calendario e compartilhamento com sua
							galera.
						</p>
					</div>

					<div className='rounded-xl border border-base-200 bg-base-200/50 p-4 text-sm text-base-content/70 mb-5'>
						Entre com sua conta Google para acessar suas viagens ou
						entrar em uma viagem usando codigo de acesso.
					</div>

					<button
						onClick={handleGoogleLogin}
						className='btn btn-primary w-full'>
						Continuar com Google
					</button>
				</div>
			</div>
		</div>
	);
}

export default Login;
