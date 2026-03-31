/// <reference types="vite/client" />

import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import {
	GoogleAuthProvider,
	signInWithPopup,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
	messagingSenderId: import.meta.env
		.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
	appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
};

const app = initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export default app;

const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
	try {
		const result = await signInWithPopup(auth, googleProvider);
		return result.user;
	} catch (error) {
		console.error("Erro ao fazer login com Google:", error);
		throw error;
	}
};

export const loginWithEmail = async (email: string, password: string) => {
	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password,
		);
		return userCredential.user;
	} catch (error) {
		if (error instanceof FirebaseError) {
			switch (error.code) {
				case "auth/user-not-found":
					throw new Error(
						"Usuário não encontrado. Verifique o email ou registre-se.",
					);
				case "auth/wrong-password":
					throw new Error("Senha incorreta. Tente novamente.");
				case "auth/invalid-email":
					throw new Error(
						"O email fornecido é inválido. Verifique e tente novamente.",
					);
				default:
					throw new Error(
						"Erro desconhecido ao fazer login. Tente novamente mais tarde.",
					);
			}
		}
		throw error;
	}
};

export const registerWithEmail = async (email: string, password: string) => {
	try {
		if (password.length < 6) {
			throw new Error("A senha deve ter pelo menos 6 caracteres.");
		}
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password,
		);
		return userCredential.user;
	} catch (error) {
		if (error instanceof FirebaseError) {
			switch (error.code) {
				case "auth/email-already-in-use":
					throw new Error(
						"Este email já está em uso. Tente outro ou faça login.",
					);
				case "auth/invalid-email":
					throw new Error(
						"O email fornecido é inválido. Verifique e tente novamente.",
					);
				case "auth/weak-password":
					throw new Error(
						"A senha deve ter pelo menos 6 caracteres.",
					);
				default:
					throw new Error(
						"Erro desconhecido ao registrar. Tente novamente mais tarde.",
					);
			}
		}
		throw error;
	}
};
