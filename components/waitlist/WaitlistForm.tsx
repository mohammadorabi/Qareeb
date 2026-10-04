"use client";

import dynamic from "next/dynamic";
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonClass } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import type { CountryOptions } from "@/lib/countries";
import { submitWaitlist } from "@/lib/waitlist-client";
import {
  WAITLIST_FIELDS,
  waitlistSchema,
  type WaitlistField,
  type WaitlistFieldError,
  type WaitlistInput,
  type WaitlistSubmitError,
} from "@/lib/waitlist/schema";

// The phone input ships every flag (~250 KB gz), so it loads on its own after
// the page. Its bordered box is rendered here, so nothing shifts when it lands.
const PhoneField = dynamic(() => import("./PhoneField").then((m) => m.PhoneField), {
  ssr: false,
});

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success" }
  | { kind: "error"; error: WaitlistSubmitError };

type FieldErrors = Partial<Record<WaitlistField, WaitlistFieldError>>;

type Props = {
  /** Country-of-residence options, built on the server. */
  countries: CountryOptions;
};

/** The waitlist sign-up form (#join): every field at once. */
export function WaitlistForm({ countries }: Props) {
  const t = useTranslations("waitlist");
  const locale = useLocale() as "ar" | "en";
  const uid = useId();
  const id = (field: string) => `${uid}-${field}`;
  const errorId = (field: WaitlistField) => `${uid}-${field}-error`;

  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const startedAt = useRef(0);
  // Last valid submission, re-sent by the retry button.
  const lastPayload = useRef<WaitlistInput | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (status.kind === "success") successRef.current?.focus();
  }, [status.kind]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "loading") return;
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "");

    const payload = {
      name: String(data.get("name") ?? ""),
      email,
      country,
      phone,
      consent: data.get("consent") === "on",
      locale,
      company: String(data.get("company") ?? ""),
      elapsedMs: startedAt.current ? Date.now() - startedAt.current : 0,
    };
    const parsed = waitlistSchema.safeParse(payload);

    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as WaitlistField;
        if (WAITLIST_FIELDS.includes(field) && !next[field]) {
          next[field] = issue.message as WaitlistFieldError;
        }
      }
      setErrors(next);
      const first = WAITLIST_FIELDS.find((f) => next[f]);
      // Honeypot or other hidden-field failures: pretend success, reveal nothing.
      if (!first) {
        setStatus({ kind: "success" });
        return;
      }
      document.getElementById(id(first))?.focus();
      return;
    }

    setErrors({});
    // Send the raw input: the server validates and normalizes it again.
    lastPayload.current = payload as WaitlistInput;
    await send(lastPayload.current);
  }

  async function send(payload: WaitlistInput) {
    setStatus({ kind: "loading" });
    const result = await submitWaitlist(payload);
    setStatus(result.ok ? { kind: "success" } : { kind: "error", error: result.error });
  }

  const clearError = (field: WaitlistField) =>
    errors[field] && setErrors((prev) => ({ ...prev, [field]: undefined }));

  if (status.kind === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="flex items-start gap-3 rounded-card border border-green/30 bg-green-soft px-5 py-4 outline-none"
      >
        <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-pill bg-green text-white">
          <CheckIcon />
        </span>
        <p className="text-lg leading-snug font-bold text-text">{t("success")}</p>
      </div>
    );
  }

  const loading = status.kind === "loading";
  const box = (field: WaitlistField) =>
    `h-16 w-full min-w-0 rounded-btn border bg-card px-4 text-[17px] text-text shadow-[0_1px_0_rgb(31_29_27/0.03)] transition-colors ${
      errors[field] ? "border-orange-ink" : "border-border"
    }`;
  // Native inputs: border turns orange on focus, plus the global focus ring.
  const input = (field: WaitlistField) =>
    `${box(field)} placeholder:text-muted-deco focus:border-orange-dark focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2`;
  const a11y = (field: WaitlistField, describedBy?: string) => ({
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? errorId(field) : describedBy,
  });

  const submit = (
    <MagneticButton
      type="submit"
      disabled={loading}
      className={buttonClass("primary", "lg", "h-16 w-full text-[20px]")}
    >
      {loading && <Spinner />}
      {loading ? t("submitting") : t("submit")}
    </MagneticButton>
  );

  const emailField = (
    <Field error={errors.email && t(`errors.${errors.email}`)} errorId={errorId("email")}>
      <label htmlFor={id("email")} className="sr-only">
        {t("emailLabel")}
      </label>
      <input
        id={id("email")}
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
        spellCheck={false}
        dir="ltr"
        required
        placeholder={t("emailPlaceholder")}
        {...a11y("email", id("note"))}
        onInput={() => clearError("email")}
        className={`${input("email")} rtl:text-right rtl:placeholder:text-right`}
      />
    </Field>
  );

  const nameField = (
    <Field error={errors.name && t(`errors.${errors.name}`)} errorId={errorId("name")}>
      <label htmlFor={id("name")} className="sr-only">
        {t("nameLabel")}
      </label>
      <input
        id={id("name")}
        name="name"
        type="text"
        autoComplete="name"
        autoCapitalize="words"
        maxLength={80}
        required
        placeholder={t("namePlaceholder")}
        {...a11y("name")}
        onInput={() => clearError("name")}
        className={input("name")}
      />
    </Field>
  );

  const countryField = (
    <Field error={errors.country && t(`errors.${errors.country}`)} errorId={errorId("country")}>
      <label htmlFor={id("country")} className="sr-only">
        {t("countryLabel")}
      </label>
      <select
        id={id("country")}
        name="country"
        required
        value={country}
        autoComplete="country"
        {...a11y("country")}
        onChange={(e) => {
          setCountry(e.target.value);
          clearError("country");
        }}
        className={`${input("country")} cursor-pointer ${country ? "" : "text-muted-deco"}`}
      >
        <option value="" disabled>
          {t("countryLabel")}
        </option>
        <optgroup label={t("countryTop")} className="text-text">
          {countries.top.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </optgroup>
        <optgroup label={t("countryAll")} className="text-text">
          {countries.rest.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </optgroup>
      </select>
    </Field>
  );

  const phoneField = (
    <Field error={errors.phone && t(`errors.${errors.phone}`)} errorId={errorId("phone")}>
      <label htmlFor={id("phone")} className="sr-only">
        {t("phoneLabel")}
      </label>
      <div
        dir="ltr"
        className={`${box("phone")} pe-0 focus-within:border-orange-dark has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-orange-dark`}
      >
        <PhoneField
          id={id("phone")}
          value={phone}
          onChange={(v) => {
            setPhone(v);
            clearError("phone");
          }}
          defaultCountry={country || undefined}
          locale={locale}
          placeholder={t("phonePlaceholder")}
          invalid={!!errors.phone}
          describedBy={errors.phone ? errorId("phone") : undefined}
        />
      </div>
    </Field>
  );

  return (
    <form
      noValidate
      method="post"
      action="/api/waitlist"
      onSubmit={onSubmit}
      aria-busy={loading}
      className="flex w-full flex-col gap-3"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {nameField}
        {emailField}
        {countryField}
        {phoneField}
      </div>

      {/* Honeypot: invisible to people, tempting to bots. */}
      <div aria-hidden="true" className="sr-only">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Field error={errors.consent && t(`errors.${errors.consent}`)} errorId={errorId("consent")}>
        <label htmlFor={id("consent")} className="flex cursor-pointer items-start gap-2.5">
          <input
            id={id("consent")}
            name="consent"
            type="checkbox"
            required
            {...a11y("consent")}
            onChange={() => clearError("consent")}
            className="mt-[3px] size-[18px] shrink-0 cursor-pointer accent-orange-dark"
          />
          <span className="text-[14px] leading-relaxed text-text-2">
            {t.rich("consent", {
              privacy: (chunks) => (
                <Link
                  href="/privacy"
                  className="font-medium text-text underline decoration-border underline-offset-4 hover:decoration-text"
                >
                  {chunks}
                </Link>
              ),
            })}
          </span>
        </label>
      </Field>

      {submit}

      <p id={id("note")} className="text-center text-[13px] text-muted">
        {t("note")}
      </p>

      <div aria-live="polite" className="empty:hidden">
        {status.kind === "error" && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-btn bg-orange-soft px-4 py-3 text-[14px] text-text">
            <p>{t(`errors.${status.error}`)}</p>
            {lastPayload.current && (
              <button
                type="button"
                onClick={() => lastPayload.current && send(lastPayload.current)}
                className="rounded-pill bg-text px-4 py-1.5 font-semibold text-card hover:bg-text-2"
              >
                {t("retry")}
              </button>
            )}
          </div>
        )}
      </div>
    </form>
  );
}

/** A field plus its inline error (in the page language). */
function Field({
  children,
  error,
  errorId,
}: {
  children: ReactNode;
  error?: string;
  errorId: string;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      {children}
      {error && (
        <p id={errorId} className="mt-1.5 text-[14px] font-medium text-orange-ink">
          {error}
        </p>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 animate-spin" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeOpacity=".3"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true">
      <path
        d="M5 10.5l3.2 3.2L15 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
