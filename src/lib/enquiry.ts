export type Enquiry = {
  name: string;
  email: string;
  phone: string;
  country: string;
  property: string;
  message: string;
  locale: "en" | "es" | "ca";
  consent: true;
};
export function validateEnquiry(value: unknown): Enquiry | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const v = value as Record<string, unknown>;
  const keys = ["name", "email", "phone", "property", "message"];
  if (keys.some((k) => typeof v[k] !== "string")) return null;
  if (v.website) return null;
  const str = (k: string) => (v[k] as string).trim();
  const name = str("name"),
    email = str("email"),
    phone = str("phone"),
    property = str("property"),
    message = str("message");
  const country = typeof v.country === "string" ? v.country.trim() : "";
  if (
    name.length < 2 ||
    name.length > 120 ||
    email.length > 254 ||
    !/^\S+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !/^\+[0-9 ()-]{7,24}$/.test(phone) ||
    !property ||
    property.length > 100 ||
    message.length < 10 ||
    message.length > 3000 ||
    country.length > 100 ||
    !["on", true].includes(v.consent as string | boolean) ||
    !["en", "es", "ca"].includes(v.locale as string)
  )
    return null;
  return {
    name,
    email,
    phone,
    country,
    property,
    message,
    locale: v.locale as Enquiry["locale"],
    consent: true,
  };
}
