"use client";

import PhoneInput, { type Country, type Value } from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import ar from "react-phone-number-input/locale/ar.json";
import en from "react-phone-number-input/locale/en.json";
import { PhoneIcon } from "@/components/ui/icons";

/** Shown before a country is chosen, instead of the library's globe + phone. */
const NoCountryIcon = () => <PhoneIcon className="size-full" />;

type Props = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  /** Follows the country of residence until the user picks a code by hand. */
  defaultCountry?: string;
  locale: "ar" | "en";
  placeholder: string;
  invalid: boolean;
  describedBy?: string;
};

/**
 * Phone number with a country-code dropdown (libphonenumber-js under the hood).
 * Emits E.164 (e.g. "+491234567890"). The form wraps it in an LTR input box;
 * the inner parts are styled in globals.css (.PhoneInput*), without the
 * library's CSS.
 */
export function PhoneField({
  id,
  value,
  onChange,
  defaultCountry,
  locale,
  placeholder,
  invalid,
  describedBy,
}: Props) {
  return (
    <PhoneInput
      id={id}
      name="phone"
      value={value as Value}
      onChange={(v) => onChange(v ?? "")}
      defaultCountry={defaultCountry as Country | undefined}
      labels={locale === "ar" ? ar : en}
      flags={flags}
      internationalIcon={NoCountryIcon}
      placeholder={placeholder}
      autoComplete="tel"
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
    />
  );
}
