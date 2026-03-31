export interface CountryOption {
	value: string;
	label: string;
	flag: string;
}

export const COUNTRY_OPTIONS: CountryOption[] = [
	{ value: "Brasil", label: "Brasil", flag: "🇧🇷" },
	{ value: "Estados Unidos", label: "Estados Unidos", flag: "🇺🇸" },
	{ value: "Canadá", label: "Canadá", flag: "🇨🇦" },
	{ value: "México", label: "México", flag: "🇲🇽" },
	{ value: "Argentina", label: "Argentina", flag: "🇦🇷" },
	{ value: "Chile", label: "Chile", flag: "🇨🇱" },
	{ value: "Uruguai", label: "Uruguai", flag: "🇺🇾" },
	{ value: "Colômbia", label: "Colômbia", flag: "🇨🇴" },
	{ value: "Peru", label: "Peru", flag: "🇵🇪" },
	{ value: "Reino Unido", label: "Reino Unido", flag: "🇬🇧" },
	{ value: "França", label: "França", flag: "🇫🇷" },
	{ value: "Alemanha", label: "Alemanha", flag: "🇩🇪" },
	{ value: "Itália", label: "Itália", flag: "🇮🇹" },
	{ value: "Espanha", label: "Espanha", flag: "🇪🇸" },
	{ value: "Portugal", label: "Portugal", flag: "🇵🇹" },
	{ value: "Holanda", label: "Holanda", flag: "🇳🇱" },
	{ value: "Bélgica", label: "Bélgica", flag: "🇧🇪" },
	{ value: "Suíça", label: "Suíça", flag: "🇨🇭" },
	{ value: "Irlanda", label: "Irlanda", flag: "🇮🇪" },
	{ value: "Japão", label: "Japão", flag: "🇯🇵" },
	{ value: "China", label: "China", flag: "🇨🇳" },
	{ value: "Coreia do Sul", label: "Coreia do Sul", flag: "🇰🇷" },
	{ value: "Índia", label: "Índia", flag: "🇮🇳" },
	{ value: "Austrália", label: "Austrália", flag: "🇦🇺" },
	{ value: "Nova Zelândia", label: "Nova Zelândia", flag: "🇳🇿" },
	{ value: "África do Sul", label: "África do Sul", flag: "🇿🇦" },
	{ value: "Egito", label: "Egito", flag: "🇪🇬" },
	{ value: "Marrocos", label: "Marrocos", flag: "🇲🇦" },
	{
		value: "Emirados Árabes Unidos",
		label: "Emirados Árabes Unidos",
		flag: "🇦🇪",
	},
	{ value: "Turquia", label: "Turquia", flag: "🇹🇷" },
];

export function isCountryInOptions(country: string) {
	return COUNTRY_OPTIONS.some((option) => option.value === country);
}
