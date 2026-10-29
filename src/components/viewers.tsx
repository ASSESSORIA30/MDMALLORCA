"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  Bounds,
  OrbitControls,
  useGLTF,
  ContactShadows,
  Environment,
  Html,
} from "@react-three/drei";
import { Maximize } from "lucide-react";
import { labels, type Locale, type Residence } from "@/lib/content";
function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}
function CameraPosition({ position }: { position: [number, number, number] }) {
  const camera = useThree((s) => s.camera);
  useEffect(() => {
    camera.position.set(...position);
    camera.updateMatrixWorld();
  }, [camera, position]);
  return null;
}
export function ModelViewer({
  residence: r,
  locale,
}: {
  residence: Residence;
  locale: Locale;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [floor, setFloor] = useState(0);
  const [view, setView] = useState(-1);
  const [night, setNight] = useState(false);
  const [hotspot, setHotspot] = useState<string | null>(null);
  const model = r.modelFloors?.[floor]?.url || r.model!;
  const selected = r.modelViews?.[view];
  const env = night ? r.nightEnvironment : r.environment;
  return (
    <div className="viewer model-viewer" ref={ref}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [8, 5, 8], fov: 45 }}
        shadows
        fallback={<p>WebGL is unavailable on this device.</p>}
      >
        <color attach="background" args={[night ? "#20251f" : "#e9e6df"]} />
        <ambientLight intensity={night ? 0.25 : 1.2} />
        <directionalLight
          position={[10, 15, 8]}
          intensity={night ? 0.2 : 2}
          castShadow
        />
        <Suspense
          fallback={
            <Html center>
              <span className="model-loading">
                {locale === "en"
                  ? "Loading architecture…"
                  : locale === "es"
                    ? "Cargando arquitectura…"
                    : "Carregant arquitectura…"}
              </span>
            </Html>
          }
        >
          <Bounds fit={!selected} clip observe margin={1.3}>
            <Model url={model} />
          </Bounds>
          {env && <Environment files={env} />}
          <ContactShadows opacity={0.35} scale={40} blur={2.5} far={15} />
          {r.modelHotspots?.map((h) => (
            <Html key={h.id} position={h.position} center>
              <button
                className="model-hotspot"
                aria-label={h.label[locale]}
                aria-expanded={hotspot === h.id}
                onClick={() => setHotspot(hotspot === h.id ? null : h.id)}
              >
                +
              </button>
              {hotspot === h.id && (
                <div className="hotspot-content">
                  <strong>{h.label[locale]}</strong>
                  <p>{h.description[locale]}</p>
                </div>
              )}
            </Html>
          ))}
        </Suspense>
        {selected && <CameraPosition position={selected.position} />}
        <OrbitControls
          makeDefault
          target={selected?.target || [0, 0, 0]}
          minPolarAngle={0.1}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
      <div className="model-toolbar">
        {r.modelFloors && (
          <select
            aria-label={
              locale === "en" ? "Floor" : locale === "es" ? "Planta" : "Planta"
            }
            value={floor}
            onChange={(e) => setFloor(+e.target.value)}
          >
            {r.modelFloors.map((f, i) => (
              <option key={f.url} value={i}>
                {f.name[locale]}
              </option>
            ))}
          </select>
        )}
        {r.modelViews && (
          <select
            aria-label={
              locale === "en"
                ? "Camera view"
                : locale === "es"
                  ? "Vista de cámara"
                  : "Vista de càmera"
            }
            value={view}
            onChange={(e) => setView(+e.target.value)}
          >
            <option value={-1}>
              {locale === "en"
                ? "Overview"
                : locale === "es"
                  ? "Vista general"
                  : "Vista general"}
            </option>
            {r.modelViews.map((v, i) => (
              <option key={i} value={i}>
                {v.name[locale]}
              </option>
            ))}
          </select>
        )}
        {r.nightEnvironment && (
          <button aria-pressed={night} onClick={() => setNight(!night)}>
            {night
              ? locale === "en"
                ? "Day view"
                : "Vista diurna"
              : locale === "en"
                ? "Night view"
                : "Vista nocturna"}
          </button>
        )}
      </div>
      <button
        className="expand"
        aria-label={labels[locale].fullscreen}
        onClick={() => {
          if (document.fullscreenElement) document.exitFullscreen();
          else ref.current?.requestFullscreen();
        }}
      >
        <Maximize />
      </button>
    </div>
  );
}
