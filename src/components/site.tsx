"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ArrowDown, Menu, X } from "lucide-react";
import { copy, locales, type Locale } from "@/lib/content";
export function Header({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();
  const t = copy[locale];
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => {
    setOpen(false);
  }, [path]);
  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open]);
  return (
    <header
      className={`header ${scrolled ? "scrolled" : ""} ${open ? "menu-open" : ""}`}
    >
      <Link className="brand" href={`/${locale}`} aria-label="ModularDom home">
        MODULAR<span>DOM</span>
        <small>MALLORCA PRIVATE RESIDENCES</small>
      </Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        <Link href={`/${locale}/residences`}>{t.collection}</Link>
        <Link href={`/${locale}/experience`}>{t.experience}</Link>
        <Link href={`/${locale}#philosophy`}>{t.about}</Link>
      </nav>
      <div className="header-right">
        <div className="languages" aria-label="Language">
          {locales.map((l) => (
            <Link
              key={l}
              lang={l}
              aria-current={locale === l ? "true" : undefined}
              className={locale === l ? "active" : ""}
              href={path.replace(/^\/(en|es|ca)(?=\/|$)/, `/${l}`)}
            >
              {l.toUpperCase()}
            </Link>
          ))}
        </div>
        <Link className="private-link" href={`/${locale}/contact`}>
          {t.contact}
          <ArrowUpRight size={13} />
        </Link>
        <button
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-menu"
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          <Link href={`/${locale}/residences`}>{t.collection}</Link>
          <Link href={`/${locale}/experience`}>{t.experience}</Link>
          <Link href={`/${locale}#philosophy`} onClick={() => setOpen(false)}>
            {t.about}
          </Link>
          <Link href={`/${locale}/contact`}>{t.contact}</Link>
        </nav>
      )}
    </header>
  );
}
export function ArrowLink({
  href,
  children,
  light = false,
}: {
  href: string;
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <Link className={`arrow-link ${light ? "light" : ""}`} href={href}>
      {children}
      <ArrowUpRight size={17} />
    </Link>
  );
}
export function ConceptImage({
  src = "/images/villa.jpg",
  alt,
  className = "",
  priority = false,
}: {
  src?: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`concept-image ${className}`}>
      <Image
        src={src}
        fill
        alt={alt}
        sizes="(max-width: 720px) 100vw, 80vw"
        priority={priority}
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}
export function Hero({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [playVideo, setPlayVideo] = useState(false);
  useEffect(() => {
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    setPlayVideo(
      !matchMedia("(prefers-reduced-motion: reduce)").matches &&
        !connection?.saveData,
    );
  }, []);
  const video = process.env.NEXT_PUBLIC_HERO_VIDEO;
  return (
    <section className="hero">
      <ConceptImage alt={t.demo} priority className="hero-picture" />
      {video && playVideo && (
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/images/villa.jpg"
        >
          <source src={video} type="video/mp4" />
        </video>
      )}
      <div className="hero-shade" />
      <div className="hero-content">
        <p className="eyebrow">
          {t.eyebrow}
          <span className="fine-line" />
        </p>
        <h1>
          {t.hero.split("\n").map((s, i) => (
            <span key={i}>{s}</span>
          ))}
        </h1>
        <p className="hero-description">{t.intro}</p>
        <div className="hero-actions">
          <ArrowLink href={`/${locale}/residences`} light>
            {t.discover}
          </ArrowLink>
          <Link className="quiet-link" href={`/${locale}/experience`}>
            {t.explore}
          </Link>
        </div>
      </div>
      <div className="hero-bottom">
        <a href="#philosophy" className="scroll-cue">
          <ArrowDown size={15} />
          {t.scroll}
        </a>
        <span className="hero-caption">{t.demo}</span>
        <span className="hero-number">
          39° N &nbsp; 3° E <i> MALLORCA</i>
        </span>
      </div>
    </section>
  );
}
export function Footer({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <footer>
      <div className="footer-top">
        <Link className="brand" href={`/${locale}`}>
          MODULAR<span>DOM</span>
          <small>MALLORCA PRIVATE RESIDENCES</small>
        </Link>
        <p>{t.footer}</p>
        <ArrowLink href={`/${locale}/contact`}>{t.contact}</ArrowLink>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} ModularDom</span>
        <span>{t.concept}</span>
        <div>
          <Link href={`/${locale}/privacy`}>{t.privacy}</Link>
          <Link href={`/${locale}/legal`}>{t.legal}</Link>
        </div>
      </div>
    </footer>
  );
}
export function Reveal() {
  const path = usePathname();
  useEffect(() => {
    document.documentElement.classList.add("js-reveal");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.08 },
    );
    document.querySelectorAll(".reveal").forEach((e) => observer.observe(e));
    return () => observer.disconnect();
  }, [path]);
  return null;
}
