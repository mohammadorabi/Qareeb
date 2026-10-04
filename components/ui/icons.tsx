import type { SVGProps } from "react";

/**
 * Line icons in one style: 24×24, 1.75 stroke, round caps/joins, currentColor.
 * Decorative by default (aria-hidden); label the surrounding control instead.
 * Directional icons (ArrowIcon) must be mirrored in RTL: `rtl:-scale-x-100`.
 */
type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className ?? "size-5"}
      {...props}
    >
      {children}
    </svg>
  );
}

export const ArrowIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);

export const CheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Icon>
);

export const LockIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="5" y="10.5" width="14" height="9.5" rx="2.5" />
    <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
  </Icon>
);

/** Landline / phone bill. */
export const PhoneIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2Z" />
  </Icon>
);

/** Internet bill. */
export const WifiIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 9.5a13 13 0 0 1 18 0M6 12.8a8.5 8.5 0 0 1 12 0M9 16a4 4 0 0 1 6 0" />
    <circle cx="12" cy="19" r="0.9" fill="currentColor" stroke="none" />
  </Icon>
);

/** Electricity bill. */
export const BoltIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M13 3 5.5 13.5H12L11 21l7.5-10.5H12L13 3Z" />
  </Icon>
);

/** Water bill. */
export const DropIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3.5s6 6.4 6 10.5a6 6 0 0 1-12 0c0-4.1 6-10.5 6-10.5Z" />
    <path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5" />
  </Icon>
);

/** Mobile credit (Syriatel / MTN). */
export const SimIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M8 3.5h6.5L18.5 7.5v11a2 2 0 0 1-2 2h-8.5a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z" />
    <rect x="9" y="11" width="6" height="6" rx="1" />
  </Icon>
);

export const GiftIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="4" y="9" width="16" height="11" rx="2" />
    <path d="M3.5 9h17M12 9v11M12 9S10.5 4.5 8 5s-1 4 4 4Zm0 0s1.5-4.5 4-4 1 4-4 4Z" />
  </Icon>
);

export const CalendarIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="4" y="5.5" width="16" height="14.5" rx="2.5" />
    <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
  </Icon>
);

export const CardIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
    <path d="M3 10h18M7 15h4" />
  </Icon>
);

/** Card details not stored. */
export const CardOffIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 5.5h9.5A2.5 2.5 0 0 1 21 8v8.5M18.5 18.5h-13A2.5 2.5 0 0 1 3 16V8a2.5 2.5 0 0 1 2.5-2.5" />
    <path d="M3 10h4M14 10h7M3.5 3.5l17 17" />
  </Icon>
);

/** Account security (Trust: "super secure"). */
export const ShieldCheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3.5 19 6v5.5c0 4.4-3 7.8-7 9-4-1.2-7-4.6-7-9V6l7-2.5Z" />
    <path d="M8.8 12.2l2.2 2.2 4.2-4.4" />
  </Icon>
);

/** Automatic refund. */
export const RefundIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3L4.5 9" />
    <path d="M4.5 4.5V9H9" />
    <path d="M12 8.5v7M14 10.2c-.4-.7-1.1-1-2-1-1.2 0-2 .6-2 1.5 0 2 4 1 4 3 0 .9-.9 1.6-2 1.6-.9 0-1.7-.4-2.1-1.1" />
  </Icon>
);

export const GlobeIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.3 2.3 3.5 5.2 3.5 8.5s-1.2 6.2-3.5 8.5c-2.3-2.3-3.5-5.2-3.5-8.5S9.7 5.8 12 3.5Z" />
  </Icon>
);

/** Arabic-first / bilingual. */
export const LanguageIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.5 6h9M8 4v2M10.5 6c-.6 3.6-3 6.6-6.5 8M6 9.5c1 1.8 2.6 3.2 4.5 4" />
    <path d="M12.5 20l3.75-9 3.75 9M13.8 17h4.9" />
  </Icon>
);

export const HeartIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 20s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.6-7.5 10-7.5 10Z" />
  </Icon>
);

export const PlusIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const ClockIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Icon>
);
