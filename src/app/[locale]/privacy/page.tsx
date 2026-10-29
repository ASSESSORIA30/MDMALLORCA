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
  const en = locale === "en",
    es = locale === "es";
  return (
    <article className="legal-page section">
      <p className="eyebrow">MODULARDOM / PRE-PUBLICATION</p>
      <h1>
        {en
          ? "Privacy information"
          : es
            ? "Información de privacidad"
            : "Informació de privacitat"}
      </h1>
      <p>
        {en
          ? "This is a development preview. Enquiry delivery is disabled until secure storage and spam protection are configured. No analytics or advertising cookies are used."
          : es
            ? "Esta es una previsualización de desarrollo. El envío de consultas está deshabilitado hasta configurar el almacenamiento seguro y la protección antispam. No se utilizan cookies analíticas ni publicitarias."
            : "Aquesta és una previsualització de desenvolupament. L’enviament de consultes està deshabilitat fins que es configuri l’emmagatzematge segur i la protecció antispam. No s’utilitzen galetes analítiques ni publicitàries."}
      </p>
      <h2>
        {en
          ? "Before publication"
          : es
            ? "Antes de publicar"
            : "Abans de publicar"}
      </h2>
      <p>
        {en
          ? "The operator must provide its legal identity and contact details, lawful basis, purposes, retention periods, processors, international transfer safeguards and a channel for access, correction, erasure, objection and portability requests. This page requires legal approval before collecting enquiries."
          : es
            ? "El responsable debe completar su identidad y datos de contacto, base jurídica, finalidades, plazos de conservación, encargados, garantías de transferencias internacionales y canal de ejercicio de derechos de acceso, rectificación, supresión, oposición y portabilidad. Esta página requiere aprobación legal antes de recoger consultas."
            : "El responsable ha de completar la identitat i les dades de contacte, base jurídica, finalitats, terminis de conservació, encarregats, garanties de transferències internacionals i canal d’exercici dels drets d’accés, rectificació, supressió, oposició i portabilitat. Aquesta pàgina requereix aprovació legal abans de recollir consultes."}
      </p>
      <h2>
        {en
          ? "Third-party experiences"
          : es
            ? "Experiencias de terceros"
            : "Experiències de tercers"}
      </h2>
      <p>
        {en
          ? "When configured, maps contact their tile provider and spam protection contacts Cloudflare Turnstile. Review provider terms and consent requirements before activation."
          : es
            ? "Al configurarse, los mapas contactan con su proveedor de teselas y la protección antispam con Cloudflare Turnstile. Revisa las condiciones y requisitos de consentimiento antes de activarlos."
            : "Quan es configuren, els mapes contacten amb el proveïdor de tessel·les i la protecció antispam amb Cloudflare Turnstile. Revisa les condicions i els requisits de consentiment abans d’activar-los."}
      </p>
    </article>
  );
}
