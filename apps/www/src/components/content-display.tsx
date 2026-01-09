import {
	Bodoni_Moda,
	Cormorant_Garamond,
	Crimson_Text,
	Libre_Caslon_Display,
} from "next/font/google";
import { cn } from "@/lib/utils";

const crimsonTextFont = Crimson_Text({
	subsets: ["latin"],
	weight: ["400", "600", "700"],
});

const cormorantGaramondFont = Cormorant_Garamond({
	subsets: ["latin"],
	weight: ["400", "600", "700"],
});

const libreCaslonDisplayFont = Libre_Caslon_Display({
	subsets: ["latin-ext"],
	weight: ["400"],
});

const bodoniModaFont = Bodoni_Moda({
	subsets: ["latin"],
	weight: ["400", "600", "700"],
});

const fonts = [
	{
		name: "Crimson Text",
		key: "crimson-text",
		font: crimsonTextFont,
	},
	{
		name: "Cormorant Garamond",
		key: "cormorant-garamond",
		font: cormorantGaramondFont,
	},
	{
		name: "Libre Caslon Display",
		key: "libre-caslon-display",
		font: libreCaslonDisplayFont,
	},
	{
		name: "Bodoni Moda",
		key: "bodoni-moda",
		font: bodoniModaFont,
	},
] as const;

type FontKey = (typeof fonts)[number]["key"];

interface ContentDisplayProps {
	content: string | null | undefined;
	emptyText?: string;
	fontKey?: FontKey;
	fontSize?:
		| "xs"
		| "sm"
		| "md"
		| "lg"
		| "xl"
		| "2xl"
		| "3xl"
		| "4xl"
		| "5xl"
		| "6xl"
		| "7xl"
		| "8xl"
		| "9xl";
	fontWeight?: "normal" | "bold";
	fontStyle?: "normal" | "italic";
}

export function ContentDisplay({
	content,
	emptyText = "",
	fontKey = "crimson-text",
	fontSize = "lg",
	fontWeight = "normal",
	fontStyle = "normal",
}: ContentDisplayProps) {
	const font =
		fonts.find((font) => font.key === fontKey)?.font ?? fonts[0].font;

	return (
		<div
			className={cn(
				font.className,
				`text-${fontSize} font-${fontWeight} font-${fontStyle}`,
			)}
		>
			{content || emptyText}
		</div>
	);
}
