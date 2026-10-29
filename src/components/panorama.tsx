"use client";
import { useEffect, useRef, useState } from "react";
import { Viewer } from "@photo-sphere-viewer/core";
import { VirtualTourPlugin } from "@photo-sphere-viewer/virtual-tour-plugin";
import "@photo-sphere-viewer/core/index.css";
export default function PanoramaViewer({
  scenes,
}: {
  scenes: { id: string; name: string; url: string; links: string[] }[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    let viewer: Viewer;
    try {
      viewer = new Viewer({
        container: ref.current,
        panorama: scenes[0].url,
        navbar: ["zoom", "move", "caption", "fullscreen"],
        caption: scenes[0].name,
        plugins: [
          [
            VirtualTourPlugin,
            {
              positionMode: "manual",
              renderMode: "3d",
              nodes: scenes.map((s) => ({
                id: s.id,
                name: s.name,
                panorama: s.url,
                links: s.links.map((nodeId, i) => ({
                  nodeId,
                  position: { yaw: `${i * 90}deg`, pitch: "0deg" },
                })),
              })),
            },
          ],
        ],
      });
      viewer.addEventListener("panorama-error", () => setError(true));
    } catch {
      setError(true);
    }
    return () => viewer?.destroy();
  }, [scenes]);
  return (
    <div>
      {error && <p role="alert">Panorama could not be loaded.</p>}
      <div ref={ref} className="viewer" />
    </div>
  );
}
