import { Cairo, JetBrains_Mono, Outfit } from "next/font/google";

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

export const fontVariables = `${cairo.variable} ${outfit.variable} ${jetbrains.variable}`;
