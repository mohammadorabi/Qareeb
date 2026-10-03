"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonClass } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { submitWaitlist } from "@/lib/waitlist-client";
import {
  waitlistSchema,
  type WaitlistFieldError,
  type WaitlistSubmitError,
} from "@/lib/waitlist/schema";

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; email: string }
  | { kind: "error"; error: WaitlistSubmitError };

type FieldErrors = Partial<Record<"email" | "consent", WaitlistFieldError>>;

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign"] as const;

function readAttribution() {
  const params = new URLSearchParams(window.location.search);
  const utm = Object.fromEntries(
    UTM_KEYS.flatMap((k) => {
      const v = params.get(k)?.slice(0, 100);
      return v ? [[k, v]] : [];
    }),
  );
  const referrer = document.referrer ? document.referrer.slice(0, 500) : undefined;
  return { ...utm, referrer };
}

type Props = {
  /** "inline": email + button on one row (hero). "stacked": roomier layout (final CTA). */
  variant?: "inline" | "stacked";
};

export function WaitlistForm({ variant = "inline" }: Props) {
  const t = useTranslations("waitlist");
  const locale = useLocale();
  const uid = useId();
  const ids = {
    email: `${uid}-email`,
    emailError: `${uid}-email-error`,
    consent: `${uid}-consent`,
    consentError: `${uid}-consent-error`,
    note: `${uid}-note`,
  };

  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const startedAt = useRef(0);
  const emailRef = useRef<HTMLInputElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);
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

    const parsed = waitlistSchema.safeParse({
      email: String(data.get("email") ?? ""),
      consent: data.get("consent") === "on",
      locale,
      company: String(data.get("company") ?? ""),
      startedAt: startedAt.current || Date.now(),
      ...readAttribution(),
    });

    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if ((field === "email" || field === "consent") && !next[field]) {
          next[field] = issue.message as WaitlistFieldError;
        }
      }
      setErrors(next);
      // Honeypot or other hidden-field failures: pretend success, reveal nothing.
      if (!next.email && !next.consent) {
        setStatus({ kind: "success", email: String(data.get("email") ?? "") });
        return;
      }
      (next.email ? emailRef : consentRef).current?.focus();
      return;
    }

    setErrors({});
    setStatus({ kind: "loading" });
    const result = await submitWaitlist(parsed.data);
    setStatus(
      result.ok
        ? { kind: "success", email: parsed.data.email }
        : { kind: "error", error: result.error },
    );
  }

  const clearError = (field: keyof FieldErrors) =>
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
        <div>
          <p className="text-lg font-bold text-text">{t("success")}</p>
          <p className="mt-0.5 text-[15px] text-text-2">
            {t.rich("successHint", {
              email: status.email,
              mail: (chunks) => (
                <bdi dir="ltr" className="font-mono text-[14px] text-text">
                  {chunks}
                </bdi>
              ),
            })}
          </p>
        </div>
      </div>
    );
  }

  const loading = status.kind === "loading";
  const inputBase =
    "h-14 w-full min-w-0 rounded-btn border bg-card px-4 text-[16px] text-text shadow-[0_1px_0_rgb(31_29_27/0.03)] transition-colors placeholder:text-muted-deco focus:border-orange-dark focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2";

  return (
    <form
      noValidate
      method="post"
      action="/api/waitlist"
      onSubmit={onSubmit}
      aria-busy={loading}
      className="flex w-full flex-col gap-3"
    >
      <div
        className={
          variant === "inline" ? "flex flex-col gap-2.5 sm:flex-row" : "flex flex-col gap-3"
        }
      >
        <div className="flex min-w-0 flex-1 flex-col">
          <label htmlFor={ids.email} className="sr-only">
            {t("emailLabel")}
          </label>
          <input
            ref={emailRef}
            id={ids.email}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            dir="ltr"
            required
            placeholder={t("emailPlaceholder")}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? ids.emailError : ids.note}
            onInput={() => clearError("email")}
            className={`${inputBase} ${errors.email ? "border-orange-ink" : "border-border"} rtl:text-right rtl:placeholder:text-right`}
          />
          {errors.email && (
            <p id={ids.emailError} className="mt-1.5 text-[14px] font-medium text-orange-ink">
              {t(`errors.${errors.email}`)}
            </p>
          )}
        </div>

        <MagneticButton
          type="submit"
          disabled={loading}
          className={buttonClass("primary", "lg", "shrink-0 sm:self-start")}
        >
          {loading && <Spinner />}
          {loading ? t("submitting") : t("submit")}
        </MagneticButton>
      </div>

      {/* Honeypot: invisible to people, tempting to bots. */}
      <div aria-hidden="true" className="sr-only">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor={ids.consent} className="flex cursor-pointer items-start gap-2.5">
          <input
            ref={consentRef}
            id={ids.consent}
            name="consent"
            type="checkbox"
            required
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? ids.consentError : undefined}
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
        {errors.consent && (
          <p id={ids.consentError} className="mt-1.5 text-[14px] font-medium text-orange-ink">
            {t(`errors.${errors.consent}`)}
          </p>
        )}
      </div>

      <p id={ids.note} className="text-[13px] text-muted">
        {t("note")}
      </p>

      <div aria-live="polite" className="empty:hidden">
        {status.kind === "error" && (
          <p className="rounded-btn bg-orange-soft px-4 py-3 text-[14px] text-text">
            {t(`errors.${status.error}`)} <span className="font-semibold">{t("retry")}</span>
          </p>
        )}
      </div>
    </form>
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
