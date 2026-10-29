import { redirect } from "next/navigation";
import { defaultLocale, isLocale } from "@/lib/content";
export default function Home() {
  redirect(`/${isLocale(defaultLocale) ? defaultLocale : "en"}`);
}
