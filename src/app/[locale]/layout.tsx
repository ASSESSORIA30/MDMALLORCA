import { notFound } from "next/navigation";
import { Header, Footer, Reveal } from "@/components/site";
import { isLocale, locales, copy } from "@/lib/content";
import type { Metadata } from "next";
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title:
      locale === "en"
        ? "Mallorca Private Residences"
        : locale === "es"
          ? "Residencias privadas en Mallorca"
          : "Residències privades a Mallorca",
    description: copy[locale].intro,
    openGraph: {
      locale: locale === "en" ? "en_GB" : locale === "es" ? "es_ES" : "ca_ES",
      images: [
        {
          url: "/images/villa.jpg",
          width: 1672,
          height: 941,
          alt: copy[locale].demo,
        },
      ],
    },
  };
}
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <div lang={locale}>
      <a className="skip-link" href="#main">
        {locale === "en"
          ? "Skip to content"
          : locale === "es"
            ? "Saltar al contenido"
            : "Vés al contingut"}
      </a>
      <Header locale={locale} />
      <main id="main">{children}</main>
      <Footer locale={locale} />
      <Reveal />
    </div>
  );
}
