import { type Residence, type Locale, copy } from "@/lib/content";
export function PropertyDetails({
  residence: r,
  locale,
}: {
  residence: Residence;
  locale: Locale;
}) {
  const t =
    locale === "en"
      ? {
          plot: "Plot",
          built: "Planned living area",
          beds: "Bedrooms",
          baths: "Bathrooms",
          price: "Guide price",
          status: "Status",
          title: "Architecture, with intention.",
          body: "Materials, light, landscape and the relationship between indoor and outdoor spaces. The architectural concept, construction system and specifications will be documented for each verified project.",
        }
      : locale === "es"
        ? {
            plot: "Parcela",
            built: "Superficie prevista",
            beds: "Dormitorios",
            baths: "Baños",
            price: "Precio orientativo",
            status: "Estado",
            title: "Arquitectura con intención.",
            body: "Materiales, luz, paisaje y la relación entre interior y exterior. El concepto arquitectónico, el sistema constructivo y las especificaciones se documentarán para cada proyecto verificado.",
          }
        : {
            plot: "Parcel·la",
            built: "Superfície prevista",
            beds: "Dormitoris",
            baths: "Banys",
            price: "Preu orientatiu",
            status: "Estat",
            title: "Arquitectura amb intenció.",
            body: "Materials, llum, paisatge i la relació entre interior i exterior. El concepte arquitectònic, el sistema constructiu i les especificacions es documentaran per a cada projecte verificat.",
          };
  const metrics = r.verified
    ? [
        [t.plot, r.plot ? `${r.plot.toLocaleString(locale)} m²` : null],
        [t.built, r.built ? `${r.built.toLocaleString(locale)} m²` : null],
        [t.beds, r.beds],
        [t.baths, r.baths],
        [
          t.price,
          r.price
            ? new Intl.NumberFormat(locale, {
                style: "currency",
                currency: "EUR",
                maximumFractionDigits: 0,
              }).format(r.price)
            : null,
        ],
        [t.status, r.status?.[locale]],
      ].filter(([, v]) => v)
    : [];
  return (
    <section className="architecture-section section">
      <div>
        <p className="eyebrow">MODULARDOM / ARCHITECTURE</p>
        <h2>{t.title}</h2>
      </div>
      <div>
        <p>{r.verified && r.architecture ? r.architecture[locale] : t.body}</p>
        {metrics.length > 0 ? (
          <dl className="property-metrics">
            {metrics.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="asset-note">{copy[locale].pending}</p>
        )}
      </div>
    </section>
  );
}
