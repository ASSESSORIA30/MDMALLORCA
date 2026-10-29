"use client";
import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
export default function LocationMap({
  coordinates,
  name,
  satelliteStyle,
}: {
  coordinates: [number, number];
  name: string;
  satelliteStyle?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [satellite, setSatellite] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const map = new maplibregl.Map({
      container: ref.current,
      style:
        satellite && satelliteStyle
          ? satelliteStyle
          : {
              version: 8,
              sources: {
                osm: {
                  type: "raster",
                  tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
                  tileSize: 256,
                  attribution: "© OpenStreetMap contributors",
                },
              },
              layers: [
                {
                  id: "osm",
                  type: "raster",
                  source: "osm",
                  paint: { "raster-saturation": -0.8 },
                },
              ],
            },
      center: coordinates,
      zoom: 12,
    });
    map.addControl(new maplibregl.NavigationControl());
    map.addControl(new maplibregl.FullscreenControl());
    const el = document.createElement("div");
    el.className = "map-marker";
    el.textContent = "MD";
    el.title = name;
    new maplibregl.Marker({ element: el }).setLngLat(coordinates).addTo(map);
    return () => map.remove();
  }, [coordinates, name, satellite, satelliteStyle]);
  return (
    <div>
      {satelliteStyle && (
        <button className="map-style" onClick={() => setSatellite(!satellite)}>
          {satellite ? "Map" : "Satellite"}
        </button>
      )}
      <div ref={ref} className="viewer" />
    </div>
  );
}
