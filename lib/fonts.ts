import { Aref_Ruqaa, Cairo, Caveat, JetBrains_Mono, Outfit } from "next/font/google";

export const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

// Handwriting for the receipt's love note («مع حبّي — من …»). Ruqʿa is the
// everyday handwriting of the Levant. Not preloaded: only used below the fold.
export const arefRuqaa = Aref_Ruqaa({
  subsets: ["arabic"],
  weight: "400",
  variable: "--font-aref-ruqaa",
  display: "swap",
  preload: false,
});

export const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
  preload: false,
});

export const fontVariables = [cairo, outfit, jetbrains, arefRuqaa, caveat]
  .map((f) => f.variable)
  .join(" ");
