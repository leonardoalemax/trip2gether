import { useEffect, useState } from "react";
import { Passeio } from "../types";
import { getPasseios } from "../services/passeioService";

interface UsePasseiosParams {
	tripId: string | null | undefined;
	enabled?: boolean;
}

export function usePasseios({ tripId, enabled = true }: UsePasseiosParams) {
	const [passeios, setPasseios] = useState<Passeio[]>([]);
	const [passeiosLoading, setPasseiosLoading] = useState(true);

	useEffect(() => {
		let mounted = true;

		const loadPasseios = async () => {
			if (!enabled) return;

			setPasseiosLoading(true);
			if (!tripId) {
				setPasseios([]);
				setPasseiosLoading(false);
				return;
			}

			try {
				const data = await getPasseios(tripId);
				if (mounted) setPasseios(data);
			} finally {
				if (mounted) setPasseiosLoading(false);
			}
		};

		loadPasseios();
		return () => {
			mounted = false;
		};
	}, [tripId, enabled]);

	return { passeios, passeiosLoading };
}
