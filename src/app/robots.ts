import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const published = process.env.SITE_PUBLISHED === "true";
  return {
    rules: {
      userAgent: "*",
      allow: published ? "/" : undefined,
      disallow: published ? ["/admin", "/api/"] : "/",
    },
    sitemap: published
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`
      : undefined,
  };
}
