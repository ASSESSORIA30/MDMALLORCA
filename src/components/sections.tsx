import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { copy, residences, type Locale } from "@/lib/content";
import { ArrowLink, ConceptImage } from "./site";
export function Collection({
  locale,
  full = false,
}: {
  locale: Locale;
  full?: boolean;
}) {
  const t = copy[locale];
  return (
    <section className="collection section" id="collection">
      <div className="section-heading reveal">
        <div>
          <p className="eyebrow">{t.selected}</p>
          <h2>{t.selectedTitle}</h2>
        </div>
        <p>{t.selectedBody}</p>
      </div>
      {residences.map((r, i) => (
        <article key={r.slug} className={`residence-row reveal row-${i}`}>
          <Link
            href={`/${locale}/residences/${r.slug}`}
            className="residence-picture"
          >
            <ConceptImage
              src={r.image}
              alt={r.verified ? r.name : `${r.name} — ${t.demo}`}
            />
            <span className="picture-tag">
              {r.verified ? r.status?.[locale] || r.area : t.concept}
            </span>
            <span className="picture-arrow">
              <ArrowUpRight size={24} />
            </span>
          </Link>
          <div className="residence-info">
            <span className="residence-index">0{i + 1} / MALLORCA</span>
            <h3>{r.name}</h3>
            <p>{r.description[locale]}</p>
            <div className="residence-facts">
              <span>{r.verified ? r.area : t.pending}</span>
              <span>
                {locale === "en"
                  ? "Private presentation"
                  : locale === "es"
                    ? "Presentación privada"
                    : "Presentació privada"}
              </span>
            </div>
            <ArrowLink href={`/${locale}/residences/${r.slug}`}>
              {t.view}
            </ArrowLink>
          </div>
        </article>
      ))}
      {!full && (
        <div className="collection-end">
          <ArrowLink href={`/${locale}/residences`}>{t.all}</ArrowLink>
        </div>
      )}
    </section>
  );
}
export function Lifestyle({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <section className="lifestyle">
      <ConceptImage src="/images/mallorca.jpg" alt={t.demo} />
      <div className="lifestyle-overlay" />
      <div className="lifestyle-copy reveal">
        <p className="eyebrow">THE MALLORCA EXPERIENCE</p>
        <h2>{t.lifestyle}</h2>
        <p>{t.lifeBody}</p>
        <ArrowLink href={`/${locale}/experience`} light>
          {t.explore}
        </ArrowLink>
      </div>
      <span className="lifestyle-caption">{t.demo}</span>
    </section>
  );
}
export function Invitation({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <section className="invitation section">
      <div className="invitation-ornament">
        M<span>D</span>
      </div>
      <p className="eyebrow">A CONVERSATION, PRIVATELY</p>
      <h2>{t.cta}</h2>
      <p>{t.ctaBody}</p>
      <ArrowLink href={`/${locale}/contact`}>{t.arrange}</ArrowLink>
    </section>
  );
}
