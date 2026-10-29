import { isLocale } from "@/lib/content";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/contact";
import { copy, type Locale } from "@/lib/content";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return {
    title: copy[locale].contact,
    alternates: {
      canonical: `/${locale}/contact`,
      languages: { en: "/en/contact", es: "/es/contact", ca: "/ca/contact" },
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
    <section className="contact-page section">
      <div className="contact-heading">
        <p className="eyebrow">MALLORCA PRIVATE RESIDENCES</p>
        <h1>{t.cta}</h1>
        <p>{t.ctaBody}</p>
        <p className="contact-detail">{t.arrange}</p>
      </div>
      <ContactForm locale={locale} />
    </section>
  );
}
