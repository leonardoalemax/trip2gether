const FLAGS = {
	br: "🇧🇷",
	us: "🇺🇸",
	ca: "🇨🇦",
	mx: "🇲🇽",
	ar: "🇦🇷",
	cl: "🇨🇱",
	uy: "🇺🇾",
	co: "🇨🇴",
	pe: "🇵🇪",
	gb: "🇬🇧",
	fr: "🇫🇷",
	de: "🇩🇪",
	it: "🇮🇹",
	es: "🇪🇸",
	pt: "🇵🇹",
	nl: "🇳🇱",
	be: "🇧🇪",
	ch: "🇨🇭",
	ie: "🇮🇪",
	jp: "🇯🇵",
	cn: "🇨🇳",
	kr: "🇰🇷",
	in: "🇮🇳",
	au: "🇦🇺",
	nz: "🇳🇿",
	za: "🇿🇦",
	eg: "🇪🇬",
	ma: "🇲🇦",
	ae: "🇦🇪",
	tr: "🇹🇷",
} as const;

type CountryCode = keyof typeof FLAGS;

const COUNTRY_ALIASES: Record<string, CountryCode> = {
	brasil: "br",
	brazil: "br",
	"estados unidos": "us",
	"united states": "us",
	usa: "us",
	eua: "us",
	canada: "ca",
	mexico: "mx",
	argentina: "ar",
	chile: "cl",
	uruguai: "uy",
	uruguay: "uy",
	colombia: "co",
	peru: "pe",
	"reino unido": "gb",
	"united kingdom": "gb",
	uk: "gb",
	england: "gb",
	franca: "fr",
	france: "fr",
	alemanha: "de",
	germany: "de",
	italia: "it",
	italy: "it",
	espanha: "es",
	spain: "es",
	portugal: "pt",
	holanda: "nl",
	netherlands: "nl",
	belgica: "be",
	belgium: "be",
	suica: "ch",
	switzerland: "ch",
	irlanda: "ie",
	ireland: "ie",
	japao: "jp",
	japan: "jp",
	china: "cn",
	"coreia do sul": "kr",
	"south korea": "kr",
	india: "in",
	australia: "au",
	"nova zelandia": "nz",
	"new zealand": "nz",
	"africa do sul": "za",
	"south africa": "za",
	egypt: "eg",
	egito: "eg",
	morocco: "ma",
	marrocos: "ma",
	"emirados arabes unidos": "ae",
	"united arab emirates": "ae",
	turquia: "tr",
	turkey: "tr",
};

function normalizeCountryName(value: string) {
	return value
		.trim()
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "");
}

interface CountryFlagProps {
	country?: string | undefined;
	className?: string;
}

export default function CountryFlag({
	country,
	className = "text-sm leading-none",
}: CountryFlagProps) {
	if (!country) {
		return (
			<span
				className={className}
				role='img'
				aria-label='Bandeira não definida'>
				🌍
			</span>
		);
	}

	const normalizedCountry = normalizeCountryName(country);
	const code = COUNTRY_ALIASES[normalizedCountry];
	const flag = code ? FLAGS[code] : "🌍";

	return (
		<span
			className={className}
			role='img'
			aria-label={`Bandeira de ${country}`}>
			{flag}
		</span>
	);
}
