export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);

// TODO(owner): replace with the real contact address before launch.
export const CONTACT_EMAIL = "hello@example.com";

/** Section anchors shared by the nav and the page. */
export const SECTION_IDS = {
  how: "how-it-works",
  services: "services",
  trust: "trust",
  faq: "faq",
  join: "join",
} as const;
