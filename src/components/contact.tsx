"use client";
import { useState } from "react";
import Link from "next/link";
import { Turnstile } from "./turnstile";
import { ArrowUpRight } from "lucide-react";
import { labels, residences, copy, type Locale } from "@/lib/content";
export function ContactForm({ locale }: { locale: Locale }) {
  const t = labels[locale];
  const [token, setToken] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="contact-form"
      onSubmit={async (e) => {
        e.preventDefault();
        if (process.env.NEXT_PUBLIC_ENQUIRIES_ENABLED !== "true") {
          setStatus(t.unavailable);
          return;
        }
        setBusy(true);
        setStatus("");
        const form = e.currentTarget;
        const data = Object.fromEntries(new FormData(form));
        try {
          const r = await fetch("/api/enquiries", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, locale, turnstileToken: token }),
          });
          if (r.ok) {
            setStatus(
              locale === "en"
                ? "Thank you. Your enquiry has been received."
                : locale === "es"
                  ? "Gracias. Hemos recibido tu consulta."
                  : "Gràcies. Hem rebut la teva consulta.",
            );
            form.reset();
          } else if (r.status === 503) setStatus(t.unavailable);
          else
            setStatus(
              locale === "en"
                ? "Please check your information and try again."
                : locale === "es"
                  ? "Revisa los datos e inténtalo de nuevo."
                  : "Revisa les dades i torna-ho a provar.",
            );
        } catch {
          setStatus(t.unavailable);
        } finally {
          setBusy(false);
          setToken("");
          setAttempt((v) => v + 1);
        }
      }}
    >
      <div className="form-grid">
        <label>
          {t.name}
          <input name="name" autoComplete="name" required maxLength={120} />
        </label>
        <label>
          {t.email}
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
          />
        </label>
        <label>
          {t.phone}
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+34"
            pattern="\+[0-9 ()\-]{7,24}"
            required
          />
        </label>
        <label>
          {t.country}
          <input name="country" autoComplete="country-name" maxLength={100} />
        </label>
      </div>
      <label>
        {t.property}
        <select name="property" required defaultValue="">
          <option value="" disabled>
            {t.choose}
          </option>
          <option value="general">{t.general}</option>
          {residences.map((r) => (
            <option key={r.slug} value={r.slug}>
              {r.name} — {copy[locale].concept}
            </option>
          ))}
        </select>
      </label>
      <label>
        {t.message}
        <textarea
          name="message"
          rows={3}
          required
          minLength={10}
          maxLength={3000}
        />
      </label>
      <div className="honeypot" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="consent">
        <input name="consent" type="checkbox" required />
        <span>
          {t.consent}{" "}
          <Link href={`/${locale}/privacy`}>{copy[locale].privacy} ↗</Link>
        </span>
      </label>
      <Turnstile key={attempt} onToken={setToken} />
      <p className="form-note">
        {process.env.NEXT_PUBLIC_ENQUIRIES_ENABLED === "true"
          ? ""
          : locale === "en"
            ? "Preview mode. Delivery requires the secure backend to be configured."
            : locale === "es"
              ? "Modo de previsualización. El envío requiere configurar el backend seguro."
              : "Mode de previsualització. L’enviament requereix configurar el backend segur."}
      </p>
      <button className="arrow-link dark-button" disabled={busy}>
        {busy ? "…" : t.submit}
        <ArrowUpRight size={18} />
      </button>
      <p role="status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}
