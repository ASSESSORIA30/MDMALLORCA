import { isLocale } from "@/lib/content";
import { notFound } from "next/navigation";
import { Hero, ArrowLink } from "@/components/site";
import { Collection, Lifestyle, Invitation } from "@/components/sections";
import { Comparison } from "@/components/showroom";
import { copy, residences, type Locale } from "@/lib/content";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return {
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", es: "/es", ca: "/ca", "x-default": "/en" },
    },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = copy[locale];
  return (
    <>
      <Hero locale={locale} />
      <section className="philosophy section" id="philosophy">
        <div className="philosophy-label">
          <span className="eyebrow">01 / {t.chapter}</span>
          <span className="small-wordmark">
            MODULAR<span>DOM</span>
          </span>
        </div>
        <div className="philosophy-content reveal">
          <h2>{t.title}</h2>
          <div className="philosophy-bottom">
            <p>{t.body}</p>
            <span className="line-drawing" aria-hidden="true">
              ⌒
            </span>
          </div>
        </div>
      </section>
      <Collection locale={locale} />
      <section className="transformation section">
        <div className="section-heading reveal">
          <div>
            <p className="eyebrow">THE ART OF POSSIBILITY</p>
            <h2>{t.transform}</h2>
          </div>
          <div>
            <p>{t.transformBody}</p>
            <ArrowLink href={`/${locale}/residences/son-oliva#showroom`}>
              {t.showroom}
            </ArrowLink>
          </div>
        </div>
        <Comparison residence={residences[0]} locale={locale} />
      </section>
      <Lifestyle locale={locale} />
      <Invitation locale={locale} />
    </>
  );
}
