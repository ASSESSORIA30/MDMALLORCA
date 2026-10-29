import type { MetadataRoute } from "next";
import { locales, residences } from "@/lib/content";
export default function sitemap(): MetadataRoute.Sitemap {
  if (process.env.SITE_PUBLISHED !== "true") return [];
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  if (!base) return [];
  const paths = [
    "",
    "/residences",
    "/experience",
    "/contact",
    ...residences.filter((r) => r.verified).map((r) => `/residences/${r.slug}`),
  ];
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${base}/${locale}${path}`,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${base}/${l}${path}`]),
        ),
      },
    })),
  );
}
