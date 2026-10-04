import {
  CalendarHeart,
  Droplet,
  Gift,
  Lock,
  Phone,
  Smartphone,
  Wifi,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { TiltTile } from "@/components/services/TiltTile";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { messages } from "@/i18n/messages";
import { SECTION_IDS } from "@/lib/site";

type TileId = "phone" | "internet" | "electricity" | "water" | "syriatel" | "mtn";
type LockedId = "gifts" | "occasions";

const TILES: Record<TileId, { icon: LucideIcon; tint: string }> = {
  phone: { icon: Phone, tint: "bg-rose" },
  internet: { icon: Wifi, tint: "bg-sky" },
  electricity: { icon: Zap, tint: "bg-sand" },
  water: { icon: Droplet, tint: "bg-water" },
  syriatel: { icon: Smartphone, tint: "bg-lilac" },
  mtn: { icon: Smartphone, tint: "bg-olive" },
};

const LOCKED: Record<LockedId, LucideIcon> = { gifts: Gift, occasions: CalendarHeart };

const BILLS: TileId[] = ["phone", "internet", "electricity", "water"];
const TRANSFER: TileId[] = ["syriatel", "mtn"];

function GroupLabel({ children }: { children: string }) {
  return <h3 className="mb-3 text-[15px] font-bold text-text-2">{children}</h3>;
}

export async function Services() {
  const t = await getTranslations("services");
  const locale = await getLocale();
  // The secondary label is the other language: English (mono) on /ar, Arabic on /en.
  const other = messages[locale === "ar" ? "en" : "ar"].services.tiles;

  const tile = (id: TileId, tall = false) => {
    const { icon: Icon, tint } = TILES[id];
    return (
      <li key={id} className="h-full">
        <TiltTile className="h-full">
          <div
            className={`flex h-full flex-col justify-between gap-8 rounded-card p-6 ${tint} ${tall ? "lg:min-h-[260px]" : "min-h-[200px]"}`}
          >
            <span className="grid size-12 place-items-center rounded-pill bg-card/80 text-text">
              <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <div>
              <p
                lang={locale === "ar" ? "en" : "ar"}
                className={
                  locale === "ar"
                    ? "font-mono text-[11px] tracking-[0.12em] text-text/70 uppercase"
                    : "text-[13px] font-semibold text-text/70"
                }
              >
                {other[id].name}
              </p>
              <p className="mt-1 text-[22px] leading-tight font-extrabold text-text">
                {t(`tiles.${id}.name`)}
              </p>
              <p className="mt-2 text-[15px] leading-snug text-text/80">{t(`tiles.${id}.line`)}</p>
            </div>
          </div>
        </TiltTile>
      </li>
    );
  };

  return (
    <section
      id={SECTION_IDS.services}
      aria-labelledby="services-title"
      className="py-[72px] lg:py-[120px]"
    >
      <div className="container-site">
        <SectionHeader
          id="services-title"
          eyebrow={t("eyebrow")}
          title={t("title")}
          lead={t("lead")}
        />

        <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-12 lg:gap-5">
          <div className="lg:col-span-7">
            <GroupLabel>{t("bills")}</GroupLabel>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
              {BILLS.map((id) => tile(id))}
            </ul>
          </div>

          <div className="flex flex-col lg:col-span-5">
            <GroupLabel>{t("transfer")}</GroupLabel>
            <ul className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:gap-5">
              {TRANSFER.map((id) => tile(id, true))}
            </ul>
          </div>

          <div className="lg:col-span-12">
            <GroupLabel>{t("locked")}</GroupLabel>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
              {(Object.keys(LOCKED) as LockedId[]).map((id) => {
                const Icon = LOCKED[id];
                return (
                  <li
                    key={id}
                    className="flex items-center gap-4 rounded-card border border-dashed border-text/15 bg-card/60 p-5"
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-pill bg-border/70 text-text-2">
                      <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 text-[19px] font-extrabold text-text">
                        {t(`tiles.${id}.name`)}
                        <Lock
                          className="size-4 text-text-2"
                          strokeWidth={1.75}
                          aria-hidden="true"
                        />
                      </p>
                      <p className="mt-0.5 text-[15px] text-text-2">{t(`tiles.${id}.line`)}</p>
                    </div>
                    <span className="shrink-0 rounded-pill bg-mustard px-3 py-1 text-[13px] font-bold text-text">
                      {t("soon")}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
