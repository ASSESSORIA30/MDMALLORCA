import { isLocale } from "@/lib/content";
import { notFound } from "next/navigation";
import { Collection, Invitation } from "@/components/sections";
import { copy, type Locale } from "@/lib/content";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return {
    title: copy[locale].collection,
    alternates: {
      canonical: `/${locale}/residences`,
      languages: {
        en: "/en/residences",
        es: "/es/residences",
        ca: "/ca/residences",
      },
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
  return (
    <div className="inner-page">
      <Collection locale={locale} full />
      <Invitation locale={locale} />
    </div>
  );
}
