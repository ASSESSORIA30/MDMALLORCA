"use client";
import dynamic from "next/dynamic";
import { AssetBoundary } from "./asset-boundary";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Maximize,
  X,
  Play,
  Box,
  Compass,
  Layers,
  MapPin,
  Images,
} from "lucide-react";
import { copy, labels, type Locale, type Residence } from "@/lib/content";
const ModelViewer = dynamic(
  () => import("./viewers").then((m) => m.ModelViewer),
  { ssr: false, loading: () => <p>Loading 3D…</p> },
);
const PanoramaViewer = dynamic(() => import("./panorama"), {
  ssr: false,
  loading: () => <p>Loading 360°…</p>,
});
const LocationMap = dynamic(() => import("./location-map"), {
  ssr: false,
  loading: () => <p>Loading map…</p>,
});
export function Comparison({
  residence: r,
  locale,
}: {
  residence: Residence;
  locale: Locale;
}) {
  const [value, setValue] = useState(50);
  const t = labels[locale];
  const real = !!r.terrain && !!r.render;
  return (
    <div className="comparison-wrap">
      <div className="comparison">
        <Image
          src={r.render || r.image}
          alt={real ? t.after : copy[locale].demo}
          fill
          sizes="90vw"
          style={{ objectFit: "cover" }}
        />
        <div
          className="before-layer"
          style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}
        >
          <Image
            src={r.terrain || r.image}
            alt={real ? t.before : copy[locale].demo}
            fill
            sizes="90vw"
            style={{
              objectFit: "cover",
              filter: real ? "none" : "saturate(.3)",
            }}
          />
        </div>
        <span className="compare-label before">
          {real ? t.before : "01 / CONCEPT"}
        </span>
        <span className="compare-label after">
          {real ? t.after : "02 / CONCEPT"}
        </span>
        <div className="compare-line" style={{ left: `${value}%` }}>
          <span>‹ &nbsp; ›</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => setValue(+e.target.value)}
          aria-label={
            locale === "en"
              ? "Compare land and architecture"
              : locale === "es"
                ? "Comparar terreno y arquitectura"
                : "Compara terreny i arquitectura"
          }
        />
      </div>
      {!real && <p className="asset-note">{t.demoCompare}</p>}
    </div>
  );
}
export function Showroom({
  residence: r,
  locale,
}: {
  residence: Residence;
  locale: Locale;
}) {
  const t = labels[locale];
  const tabs = [
    ["gallery", Images],
    ["film", Play],
    ["model", Box],
    ["tour", Compass],
    ["plans", Layers],
    ["location", MapPin],
  ] as const;
  const [tab, setTab] = useState<string>("gallery");
  const [category, setCategory] = useState("exterior");
  const [full, setFull] = useState(false);
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const assets =
    tab === "plans"
      ? r.plans || []
      : (r.gallery || [{ src: r.image, category: "exterior" }])
          .filter((a) => a.category === category)
          .map((a) => a.src);
  const img = assets[index % Math.max(assets.length, 1)];
  useEffect(() => {
    if (full) {
      trigger.current = document.activeElement as HTMLElement;
      dialog.current?.showModal();
    } else if (dialog.current?.open) {
      dialog.current.close();
      trigger.current?.focus();
    }
  }, [full]);
  const caption = r.verified
    ? r.gallery?.find((a) => a.src === img)?.caption || r.name
    : copy[locale].demo;
  const change = (step: number) =>
    setIndex((i) => (i + step + assets.length) % assets.length);
  return (
    <section className="showroom section" id="showroom">
      <div className="section-heading">
        <div>
          <p className="eyebrow">A PRIVATE PERSPECTIVE</p>
          <h2>{copy[locale].showroom}</h2>
        </div>
        <p>{copy[locale].showroomBody}</p>
      </div>
      <div
        className="showroom-tabs"
        role="tablist"
        onKeyDown={(e) => {
          if (
            e.key !== "ArrowRight" &&
            e.key !== "ArrowLeft" &&
            e.key !== "Home" &&
            e.key !== "End"
          )
            return;
          e.preventDefault();
          const idx = tabs.findIndex(([key]) => key === tab);
          const next =
            e.key === "Home"
              ? 0
              : e.key === "End"
                ? tabs.length - 1
                : (idx + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) %
                  tabs.length;
          setTab(tabs[next][0]);
          setIndex(0);
          document.getElementById(`tab-${tabs[next][0]}`)?.focus();
        }}
        aria-label={copy[locale].showroom}
      >
        {tabs.map(([key, Icon]) => (
          <button
            key={key}
            role="tab"
            tabIndex={tab === key ? 0 : -1}
            aria-selected={tab === key}
            aria-controls="showroom-panel"
            id={`tab-${key}`}
            onClick={() => {
              setTab(key);
              setIndex(0);
              setZoom(1);
            }}
          >
            <Icon size={16} />
            {t[key]}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id="showroom-panel"
        aria-labelledby={`tab-${tab}`}
        className="showroom-panel"
      >
        {tab === "gallery" && (
          <>
            <div className="gallery-filters">
              {(
                [
                  "exterior",
                  "interior",
                  "architecture",
                  "lifestyle",
                  "construction",
                ] as const
              ).map((c) => (
                <button
                  key={c}
                  aria-pressed={category === c}
                  onClick={() => {
                    setCategory(c);
                    setIndex(0);
                  }}
                >
                  {t[c]}
                </button>
              ))}
            </div>
            {img ? (
              <div className="gallery-view">
                <Image
                  src={img}
                  alt={caption}
                  fill
                  sizes="90vw"
                  style={{ objectFit: "contain" }}
                />
                <button
                  className="expand"
                  onClick={() => setFull(true)}
                  aria-label={t.fullscreen}
                >
                  <Maximize size={19} />
                </button>
                <div className="gallery-caption">
                  <span>{caption}</span>
                  <div>
                    <button onClick={() => change(-1)} aria-label={t.previous}>
                      <ArrowLeft size={18} />
                    </button>
                    <span>
                      {index + 1} / {assets.length}
                    </span>
                    <button onClick={() => change(1)} aria-label={t.next}>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Empty
                label={t.waiting}
                locale={locale}
                kind={t[category as "exterior"]}
              />
            )}
          </>
        )}
        {tab === "film" &&
          (r.video ? (
            <video controls playsInline preload="none" poster={r.image}>
              <source src={r.video} />
            </video>
          ) : (
            <Empty locale={locale} label={t.waiting} kind={t.film} />
          ))}
        {tab === "model" &&
          (r.viewerHtml ? (
            <iframe
              src={r.viewerHtml}
              title={t.model}
              sandbox="allow-scripts allow-same-origin"
              allow="fullscreen"
              className="viewer"
            />
          ) : r.model ? (
            <AssetBoundary
              message={
                locale === "en"
                  ? "The model could not be loaded. Please check the project assets."
                  : locale === "es"
                    ? "No se pudo cargar el modelo. Revisa los recursos del proyecto."
                    : "No s’ha pogut carregar el model. Revisa els recursos del projecte."
              }
            >
              <ModelViewer residence={r} locale={locale} />
            </AssetBoundary>
          ) : (
            <Empty locale={locale} label={t.waiting} kind={t.model} />
          ))}
        {tab === "tour" &&
          (r.panoramas?.length ? (
            <PanoramaViewer scenes={r.panoramas} />
          ) : (
            <Empty locale={locale} label={t.waiting} kind={t.tour} />
          ))}
        {tab === "plans" &&
          (img ? (
            <div className="gallery-view">
              <Image
                src={img}
                alt={t.plans}
                fill
                sizes="90vw"
                style={{ objectFit: "contain" }}
              />
              <button
                className="expand"
                onClick={() => setFull(true)}
                aria-label={t.fullscreen}
              >
                <Maximize />
              </button>
            </div>
          ) : (
            <Empty locale={locale} label={t.waiting} kind={t.plans} />
          ))}
        {tab === "location" &&
          (r.coordinates ? (
            <>
              <LocationMap
                coordinates={r.coordinates}
                name={r.name}
                satelliteStyle={r.satelliteStyle}
              />
              <p className="asset-note">
                {r.approximate
                  ? "Approximate location · Ubicación aproximada · Ubicació aproximada"
                  : ""}{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://www.google.com/maps/search/?api=1&query=${r.coordinates[1]},${r.coordinates[0]}`}
                >
                  Google Maps ↗
                </a>
              </p>
            </>
          ) : (
            <Empty
              locale={locale}
              label={
                locale === "en"
                  ? "A location worth keeping private"
                  : locale === "es"
                    ? "Un lugar que merece privacidad"
                    : "Un lloc que mereix privacitat"
              }
              kind={
                locale === "en"
                  ? "Exact coordinates available following project verification."
                  : locale === "es"
                    ? "Coordenadas disponibles tras verificar el proyecto."
                    : "Coordenades disponibles després de verificar el projecte."
              }
            />
          ))}
      </div>
      <dialog
        aria-label={t.gallery}
        ref={dialog}
        onCancel={() => setFull(false)}
        onClose={() => setFull(false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") change(1);
          if (e.key === "ArrowLeft") change(-1);
        }}
        className="lightbox"
      >
        <button
          className="lightbox-close"
          onClick={() => setFull(false)}
          aria-label={t.close}
        >
          <X />
        </button>
        {img && (
          <div
            className="lightbox-image"
            onTouchStart={(e) => {
              e.currentTarget.dataset.x = String(e.touches[0].clientX);
            }}
            onTouchEnd={(e) => {
              const x =
                Number(e.currentTarget.dataset.x) - e.changedTouches[0].clientX;
              if (Math.abs(x) > 50) change(x > 0 ? 1 : -1);
            }}
          >
            <Image
              src={img}
              fill
              sizes="100vw"
              alt={tab === "plans" ? t.plans : caption}
              style={{ objectFit: "contain", transform: `scale(${zoom})` }}
            />
          </div>
        )}
        {tab === "plans" ? (
          <label className="zoom-control">
            Zoom{" "}
            <input
              type="range"
              min="1"
              max="3"
              step=".1"
              value={zoom}
              onChange={(e) => setZoom(+e.target.value)}
            />
          </label>
        ) : (
          <div className="lightbox-controls">
            <button onClick={() => change(-1)} aria-label={t.previous}>
              <ArrowLeft />
            </button>
            <span>
              {caption} · {index + 1}/{assets.length}
            </span>
            <button onClick={() => change(1)} aria-label={t.next}>
              <ArrowRight />
            </button>
          </div>
        )}
      </dialog>
    </section>
  );
}
function Empty({
  label,
  kind,
  locale,
}: {
  label: string;
  kind: string;
  locale: Locale;
}) {
  return (
    <div className="empty-state">
      <span className="empty-mark">
        M<span>D</span>
      </span>
      <p className="eyebrow">{kind}</p>
      <h3>{label}</h3>
      <p>
        {locale === "en"
          ? "Prepared for the real project. Professional assets will bring this experience to life."
          : locale === "es"
            ? "Preparado para el proyecto real. Los recursos profesionales darán vida a esta experiencia."
            : "Preparat per al projecte real. Els recursos professionals donaran vida a aquesta experiència."}
      </p>
    </div>
  );
}
