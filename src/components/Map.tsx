import { useEffect, useRef, type CSSProperties } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { cn } from "@/lib/utils";

interface MapViewProps {
  className?: string;
  style?: CSSProperties;
  initialCenter?: maplibregl.LngLatLike;
  initialZoom?: number;
  onMapReady?: (map: maplibregl.Map) => void;
}

export function MapView({
  className,
  style,
  initialCenter = [-48.5477, -27.5954],
  initialZoom = 12,
  onMapReady,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const openStreetMapStyle: maplibregl.StyleSpecification = {
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
          id: "osm-tiles",
          type: "raster",
          source: "osm",
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    };

    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: openStreetMapStyle,
      center: initialCenter,
      zoom: initialZoom,
    });

    mapRef.current.addControl(new maplibregl.NavigationControl(), "top-right");

    mapRef.current.on("load", () => {
      onMapReady?.(mapRef.current!);
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  // Run once (or when onMapReady callback identity changes).
  // Avoid depending on `initialCenter`/`initialZoom` to prevent
  // recreating the map when callers pass inline arrays.
  // If callers need to programmatically center/zoom later, do it via
  // the `onMapReady` callback and the returned map instance.
  }, [onMapReady]);

  return <div ref={mapContainer} className={cn("w-full h-[500px]", className)} style={style} />;
}
