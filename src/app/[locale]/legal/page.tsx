import { isLocale } from "@/lib/content";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/content";
export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <article className="legal-page section">
      <p className="eyebrow">MODULARDOM / PRE-PUBLICATION</p>
      <h1>
        {locale === "en"
          ? "Legal notice"
          : locale === "es"
            ? "Aviso legal"
            : "Avís legal"}
      </h1>
      <p>
        {locale === "en"
          ? "Illustrative development preview. Residence names and AI-generated architectural images are conceptual and do not represent verified plots, approved architecture or properties currently offered for sale. No commercial specifications, availability or prices are confirmed."
          : locale === "es"
            ? "Previsualización ilustrativa de desarrollo. Los nombres y las imágenes arquitectónicas generadas con IA son conceptuales y no representan parcelas verificadas, arquitectura aprobada ni propiedades actualmente a la venta. No se confirman especificaciones comerciales, disponibilidad ni precios."
            : "Previsualització il·lustrativa de desenvolupament. Els noms i les imatges arquitectòniques generades amb IA són conceptuals i no representen parcel·les verificades, arquitectura aprovada ni propietats actualment a la venda. No es confirmen especificacions comercials, disponibilitat ni preus."}
      </p>
      <h2>
        {locale === "en"
          ? "Operator information pending"
          : locale === "es"
            ? "Información del titular pendiente"
            : "Informació del titular pendent"}
      </h2>
      <p>
        {locale === "en"
          ? "Before production, complete the legal entity, registration and tax details, registered address, contact information and applicable terms. Obtain legal review."
          : locale === "es"
            ? "Antes de producción, completa razón social, datos registrales y fiscales, domicilio, información de contacto y condiciones aplicables. Solicita revisión legal."
            : "Abans de producció, completa la raó social, les dades registrals i fiscals, el domicili, la informació de contacte i les condicions aplicables. Sol·licita revisió legal."}
      </p>
    </article>
  );
}
