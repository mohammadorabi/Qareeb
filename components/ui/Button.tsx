type Variant = "primary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-btn whitespace-nowrap transition-[background-color,border-color,translate,box-shadow] duration-200 disabled:pointer-events-none disabled:opacity-70";

// White on --orange is 3.18:1 — AA only as "large text" (≥18.66px bold),
// so primary labels are always 19px bold.
const variants: Record<Variant, string> = {
  primary:
    "bg-orange text-[19px] font-bold text-white hover:-translate-y-px hover:bg-orange-dark hover:shadow-[0_8px_20px_-8px_rgb(216_80_11/0.6)] active:translate-y-0 active:bg-orange-dark",
  ghost: "border border-border bg-card font-semibold text-text hover:border-text-2",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5",
  lg: "h-14 px-7",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`;
}
