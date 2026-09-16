"use client";

import React, { useEffect, useRef, useState } from "react";
import * as turf from "@turf/turf";
import { AlertCircle, Check, Info, Layers, RefreshCw, Trash2 } from "lucide-react";

interface RoofMapDrawerProps {
  initialLat?: number;
  initialLng?: number;
  onAreaConfirmed: (areaSqFt: number, areaSqM: number, geometry: any) => void;
  currentAreaSqFt?: number;
}

export default function RoofMapDrawer({
  initialLat = 15.8497, // Belagavi default
  initialLng = 74.4977,
  onAreaConfirmed,
  currentAreaSqFt = 0,
}: RoofMapDrawerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const drawRef = useRef<any>(null);

  const [measuredAreaSqM, setMeasuredAreaSqM] = useState<number>(0);
  const [measuredAreaSqFt, setMeasuredAreaSqFt] = useState<number>(0);
  const [currentGeometry, setCurrentGeometry] = useState<any>(null);
  const [hasPolygon, setHasPolygon] = useState<boolean>(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMapReady, setIsMapReady] = useState<boolean>(false);
  const [styleMode, setStyleMode] = useState<"satellite" | "streets">("satellite");

  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (!token) {
      setMapError(
        "Mapbox access token is not set. Please set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN or enter roof area manually."
      );
      return;
    }

    let isMounted = true;

    async function initMapbox() {
      try {
        const mapboxglModule = await import("mapbox-gl");
        const MapboxDrawModule = await import("@mapbox/mapbox-gl-draw");

        const mapboxgl = (mapboxglModule as any).default || mapboxglModule;
        const MapboxDraw = (MapboxDrawModule as any).default || MapboxDrawModule;

        mapboxgl.accessToken = token;

        const map = new mapboxgl.Map({
          container: mapContainerRef.current!,
          style: "mapbox://styles/mapbox/satellite-streets-v12",
          center: [initialLng, initialLat],
          zoom: 18,
          pitch: 0,
        });

        map.addControl(new mapboxgl.NavigationControl(), "top-right");

        const draw = new MapboxDraw({
          displayControlsDefault: false,
          controls: {
            polygon: true,
            trash: true,
          },
          defaultMode: "draw_polygon",
        });

        map.addControl(draw, "top-left");

        const updateArea = () => {
          const data = draw.getAll();
          if (data.features.length > 0) {
            const polygon = data.features[0];
            const areaM2 = turf.area(polygon);
            const areaFt2 = areaM2 * 10.7639;

            if (isMounted) {
              setMeasuredAreaSqM(Math.round(areaM2 * 10) / 10);
              setMeasuredAreaSqFt(Math.round(areaFt2));
              setCurrentGeometry(polygon.geometry);
              setHasPolygon(true);
            }
          } else {
            if (isMounted) {
              setMeasuredAreaSqM(0);
              setMeasuredAreaSqFt(0);
              setCurrentGeometry(null);
              setHasPolygon(false);
            }
          }
        }

        map.on("load", () => {
          if (!isMounted) return;
          setIsMapReady(true);
        });

        map.on("draw.create", updateArea);
        map.on("draw.update", updateArea);
        map.on("draw.delete", updateArea);

        mapRef.current = map;
        drawRef.current = draw;
      } catch (err: any) {
        console.error("Mapbox init failed:", err);
        if (isMounted) {
          setMapError(
            "Could not initialize satellite map. You can still enter your roof area manually or check your connection."
          );
        }
      }
    }

    initMapbox();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [token, initialLat, initialLng]);

  const toggleLayer = () => {
    if (!mapRef.current) return;
    const nextStyle = styleMode === "satellite" ? "streets" : "satellite";
    setStyleMode(nextStyle);
    mapRef.current.setStyle(
      nextStyle === "satellite"
        ? "mapbox://styles/mapbox/satellite-streets-v12"
        : "mapbox://styles/mapbox/streets-v12"
    );
  };

  const handleClear = () => {
    if (drawRef.current) {
      drawRef.current.deleteAll();
      setMeasuredAreaSqM(0);
      setMeasuredAreaSqFt(0);
      setCurrentGeometry(null);
      setHasPolygon(false);
    }
  };

  const handleConfirm = () => {
    if (measuredAreaSqFt > 0) {
      onAreaConfirmed(measuredAreaSqFt, measuredAreaSqM, currentGeometry);
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-900 px-4 py-2 text-white">
        <div className="flex items-center space-x-2 text-sm">
          <Info className="h-4 w-4 text-solar-400" />
          <span>
            Click points along the edges of your roof. Click the first point again to close the polygon.
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={toggleLayer}
            className="flex items-center space-x-1 rounded bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-200 hover:bg-slate-700"
          >
            <Layers className="h-3.5 w-3.5" />
            <span>{styleMode === "satellite" ? "Streets View" : "Satellite View"}</span>
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={!hasPolygon}
            className="flex items-center space-x-1 rounded bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-200 hover:bg-red-900/40 hover:text-red-300 disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {mapError ? (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-600" />
            <span>{mapError}</span>
          </div>
        </div>
      ) : (
        <div className="relative h-[420px] w-full overflow-hidden rounded-xl border border-slate-200 shadow-inner bg-slate-100">
          <div ref={mapContainerRef} className="h-full w-full" />

          {/* Area floating badge */}
          {hasPolygon && (
            <div className="absolute bottom-4 left-4 z-10 flex flex-col rounded-lg bg-white/95 p-3.5 shadow-xl backdrop-blur-sm border border-slate-200">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Measured Roof Area
              </span>
              <div className="mt-1 flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-slate-900">
                  {measuredAreaSqFt.toLocaleString("en-IN")}
                </span>
                <span className="text-sm font-medium text-slate-600">sq ft</span>
                <span className="text-xs text-slate-400">
                  ({measuredAreaSqM.toLocaleString("en-IN")} m²)
                </span>
              </div>
              <button
                type="button"
                onClick={handleConfirm}
                className="mt-2.5 flex items-center justify-center space-x-1.5 rounded-md bg-eco-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-eco-700 transition"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Apply This Area</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
