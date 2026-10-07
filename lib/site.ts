export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);

export const CONTACT_EMAIL = "support@qareeb.info";

export const INSTAGRAM = {
  handle: "@qareeb.sy",
  url: "https://www.instagram.com/qareeb.sy/",
} as const;

export const FACEBOOK = {
  url: "https://www.facebook.com/share/19SF7nzK4j/",
} as const;

/** Section anchors shared by the nav and the page, in page order. */
export const SECTION_IDS = {
  why: "why",
  how: "how-it-works",
  services: "services",
  transparency: "transparency",
  trust: "trust",
  next: "next",
  faq: "faq",
  join: "join",
} as const;
