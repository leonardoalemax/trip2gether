import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "node:fs";

const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!credentialsPath) {
	console.error(
		"Defina GOOGLE_APPLICATION_CREDENTIALS apontando para o JSON da service account " +
			"(Firebase Console -> Configuracoes do projeto -> Contas de servico -> Gerar nova chave privada).",
	);
	process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(credentialsPath, "utf8"));
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function backfill() {
	const tripsSnap = await db.collection("trips").get();

	let written = 0;
	let skipped = 0;

	for (const tripDoc of tripsSnap.docs) {
		const accessCode = String(tripDoc.data().accessCode ?? "").trim();
		if (!/^\d{6}$/.test(accessCode)) {
			skipped += 1;
			continue;
		}

		await db
			.collection("tripCodes")
			.doc(accessCode)
			.set({ tripId: tripDoc.id });
		written += 1;
		console.log(`tripCodes/${accessCode} -> trips/${tripDoc.id}`);
	}

	console.log(`\nConcluido: ${written} mapeamentos criados/atualizados, ${skipped} viagens sem accessCode valido ignoradas.`);
}

backfill().catch((error) => {
	console.error(error);
	process.exit(1);
});
