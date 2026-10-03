import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Pin the root: a stray package-lock.json in the home folder confuses detection.
  turbopack: { root: import.meta.dirname },
  outputFileTracingRoot: import.meta.dirname,
};

export default withNextIntl(nextConfig);
