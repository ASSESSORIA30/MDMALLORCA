import { PropertyDetails } from "@/components/property-details";
import { isLocale } from "@/lib/content";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ConceptImage, ArrowLink } from "@/components/site";
import { Showroom, Comparison } from "@/components/showroom";
import { Invitation } from "@/components/sections";
import { copy, residences, locales, type Locale } from "@/lib/content";
export function generateStaticParams() {
  return locales.flatMap((locale) =>
    residences.map((r) => ({ locale, slug: r.slug })),
  );
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const r = residences.find((r) => r.slug === slug);
  return {
    title: r?.name,
    description: r?.description[locale],
    alternates: {
      canonical: `/${locale}/residences/${slug}`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `/${l}/residences/${slug}`]),
      ),
    },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const r = residences.find((r) => r.slug === slug);
  if (!r) notFound();
  const t = copy[locale];
  return (
    <>
      <section className="property-hero">
        <ConceptImage
          src={r.image}
          alt={r.verified ? r.name : t.demo}
          priority
        />
        <div className="hero-shade" />
        <div className="property-title">
          <Link href={`/${locale}/residences`}>← {t.back}</Link>
          <p className="eyebrow">{r.verified ? r.area : t.concept}</p>
          <h1>{r.name}</h1>
          <p>{r.description[locale]}</p>
        </div>
        {!r.verified && <span className="property-disclaimer">{t.demo}</span>}
      </section>
      <section className="property-intro section">
        <div>
          <p className="eyebrow">MALLORCA PRIVATE RESIDENCES</p>
          <h2>
            {locale === "en"
              ? "A vision. Uniquely yours."
              : locale === "es"
                ? "Una visión. Solo tuya."
                : "Una visió. Només teva."}
          </h2>
        </div>
        <div>
          {r.verified ? (
            <p>{r.description[locale]}</p>
          ) : (
            <p>
              {t.pending}.{" "}
              {locale === "en"
                ? "Names and visuals are illustrative. No property is offered for sale through this preview. Architectural specifications, availability and location will be published once confirmed."
                : locale === "es"
                  ? "Los nombres e imágenes son ilustrativos. Esta previsualización no ofrece propiedades a la venta. Las especificaciones, disponibilidad y ubicación se publicarán tras su confirmación."
                  : "Els noms i les imatges són il·lustratius. Aquesta previsualització no ofereix propietats a la venda. Les especificacions, disponibilitat i ubicació es publicaran quan es confirmin."}
            </p>
          )}
          <ArrowLink href={`/${locale}/contact`}>{t.arrange}</ArrowLink>
        </div>
      </section>
      <PropertyDetails residence={r} locale={locale} />
      <Showroom residence={r} locale={locale} />
      <section className="transformation section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE ART OF POSSIBILITY</p>
            <h2>{t.transform}</h2>
          </div>
          <p>{t.transformBody}</p>
        </div>
        <Comparison residence={r} locale={locale} />
      </section>
      <Invitation locale={locale} />
    </>
  );
}
