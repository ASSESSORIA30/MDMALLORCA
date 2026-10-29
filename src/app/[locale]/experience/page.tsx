import { isLocale } from "@/lib/content";
import { notFound } from "next/navigation";
import { ConceptImage } from "@/components/site";
import { Invitation } from "@/components/sections";
import { copy, type Locale } from "@/lib/content";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return {
    title: copy[locale].experience,
    alternates: {
      canonical: `/${locale}/experience`,
      languages: {
        en: "/en/experience",
        es: "/es/experience",
        ca: "/ca/experience",
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
  const t = copy[locale];
  const stories =
    locale === "en"
      ? [
          [
            "01 / THE LANDSCAPE",
            "An island of possibilities.",
            "From the Serra de Tramuntana to the Mediterranean coastline, Mallorca offers a landscape with many different rhythms. Each future residence will tell its own story within it.",
          ],
          [
            "02 / THE EVERYDAY",
            "The luxury of time.",
            "Market mornings. Mediterranean food. A quiet afternoon in the shade. An invitation to explore a different way of living.",
          ],
          [
            "03 / YOUR SURROUNDINGS",
            "Your own Mallorca.",
            "Beaches, marinas, golf, gastronomy and connections will be documented for each verified location. No proximity or journey times are assumed.",
          ],
        ]
      : locale === "es"
        ? [
            [
              "01 / EL PAISAJE",
              "Una isla de posibilidades.",
              "Desde la Serra de Tramuntana a la costa mediterránea, Mallorca ofrece un paisaje de ritmos distintos. Cada futura residencia contará su propia historia.",
            ],
            [
              "02 / EL DÍA A DÍA",
              "El lujo del tiempo.",
              "Mañanas de mercado. Gastronomía mediterránea. Una tarde tranquila a la sombra. Una invitación a explorar otra forma de vivir.",
            ],
            [
              "03 / TU ENTORNO",
              "Tu propia Mallorca.",
              "Playas, puertos, golf, gastronomía y comunicaciones se documentarán para cada ubicación verificada. No se presuponen cercanías ni tiempos de trayecto.",
            ],
          ]
        : [
            [
              "01 / EL PAISATGE",
              "Una illa de possibilitats.",
              "De la Serra de Tramuntana a la costa mediterrània, Mallorca ofereix un paisatge de ritmes diferents. Cada futura residència explicarà la seva història.",
            ],
            [
              "02 / EL DIA A DIA",
              "El luxe del temps.",
              "Matins de mercat. Gastronomia mediterrània. Una tarda tranquil·la a l’ombra. Una invitació a explorar una altra manera de viure.",
            ],
            [
              "03 / EL TEU ENTORN",
              "La teva Mallorca.",
              "Platges, ports, golf, gastronomia i comunicacions es documentaran per a cada ubicació verificada. No es pressuposen proximitats ni temps de trajecte.",
            ],
          ];
  return (
    <>
      <section className="experience-hero">
        <ConceptImage src="/images/mallorca.jpg" alt={t.demo} priority />
        <div className="hero-shade" />
        <div>
          <p className="eyebrow">THE MALLORCA EXPERIENCE</p>
          <h1>{t.lifestyle}</h1>
          <p>{t.lifeBody}</p>
        </div>
      </section>
      <section className="editorial section">
        {stories.map(([label, title, body]) => (
          <article key={label} className="reveal">
            <p className="eyebrow">{label}</p>
            <h2>{title}</h2>
            <p>{body}</p>
          </article>
        ))}
      </section>
      <Invitation locale={locale} />
    </>
  );
}
