import React, { useState, useEffect } from "react";
import { MapPin, Navigation, Sun, CheckCircle2, AlertTriangle, Radio } from "lucide-react";
import { PropertyLocation } from "@/lib/solar/types";
import { fetchSolarResourceForLocation, LiveSolarResource } from "@/lib/solar/api";
import { getSolarResourceForLocation } from "@/lib/solar/assumptions";

interface StepPropertyProps {
  location: PropertyLocation;
  onChange: (location: PropertyLocation) => void;
  onNext: () => void;
}

const POPULAR_CITIES = [
  { city: "Belagavi", state: "Karnataka" },
  { city: "Bengaluru", state: "Karnataka" },
  { city: "Mumbai", state: "Maharashtra" },
  { city: "Pune", state: "Maharashtra" },
  { city: "New Delhi", state: "Delhi" },
  { city: "Jaipur", state: "Rajasthan" },
  { city: "Ahmedabad", state: "Gujarat" },
  { city: "Chennai", state: "Tamil Nadu" },
  { city: "Hyderabad", state: "Telangana" },
];

export default function StepProperty({
  location,
  onChange,
  onNext,
}: StepPropertyProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [isLoadingSolar, setIsLoadingSolar] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [liveResource, setLiveResource] = useState<LiveSolarResource>(() =>
    getSolarResourceForLocation(location.city, location.state)
  );

  // Dynamically fetch exact live solar irradiance for GPS or city
  useEffect(() => {
    let isMounted = true;
    setIsLoadingSolar(true);

    const timer = setTimeout(async () => {
      try {
        const res = await fetchSolarResourceForLocation(
          location.city,
          location.state,
          location.latitude,
          location.longitude
        );
        if (isMounted) {
          setLiveResource(res);
        }
      } catch (e) {
        if (isMounted) {
          setLiveResource(getSolarResourceForLocation(location.city, location.state));
        }
      } finally {
        if (isMounted) {
          setIsLoadingSolar(false);
        }
      }
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [location.city, location.state, location.latitude, location.longitude]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        let detectedCity = "";
        let detectedState = "";
        let detectedCountry = "India";

        try {
          const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
          if (mapboxToken) {
            const res = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxToken}`
            );
            if (res.ok) {
              const data = await res.json();
              if (data.features && data.features.length > 0) {
                // Find locality/place and region
                const placeFeature = data.features.find((f: any) =>
                  f.place_type?.includes("place") ||
                  f.place_type?.includes("locality") ||
                  f.place_type?.includes("district")
                );
                const regionFeature = data.features.find((f: any) =>
                  f.place_type?.includes("region")
                );
                const countryFeature = data.features.find((f: any) =>
                  f.place_type?.includes("country")
                );

                if (placeFeature) detectedCity = placeFeature.text;
                if (regionFeature) detectedState = regionFeature.text;
                if (countryFeature) detectedCountry = countryFeature.text;

                // Also check context array of top feature if still missing
                if (!detectedCity || !detectedState) {
                  const top = data.features[0];
                  if (top.context) {
                    for (const ctx of top.context) {
                      if (ctx.id?.startsWith("place") || ctx.id?.startsWith("locality") || ctx.id?.startsWith("district")) {
                        if (!detectedCity) detectedCity = ctx.text;
                      }
                      if (ctx.id?.startsWith("region")) {
                        if (!detectedState) detectedState = ctx.text;
                      }
                      if (ctx.id?.startsWith("country")) {
                        if (!detectedCountry) detectedCountry = ctx.text;
                      }
                    }
                  }
                  if (!detectedCity) {
                    detectedCity = top.text;
                  }
                }
              }
            }
          }

          // Fallback to OpenStreetMap Nominatim if city is still not found
          if (!detectedCity) {
            const osmRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14`
            );
            if (osmRes.ok) {
              const osmData = await osmRes.json();
              const addr = osmData.address || {};
              detectedCity =
                addr.city ||
                addr.town ||
                addr.municipality ||
                addr.village ||
                addr.suburb ||
                addr.county ||
                detectedCity;
              detectedState = addr.state || detectedState;
              detectedCountry = addr.country || detectedCountry;
            }
          }
        } catch (geoErr) {
          console.warn("Reverse geocoding error:", geoErr);
        }

        onChange({
          ...location,
          latitude,
          longitude,
          city: detectedCity || "Detected Location",
          state: detectedState || "",
          country: detectedCountry || "India",
          source: "current_location",
        });
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        setErrorMsg(
          "Unable to retrieve your location. Please enter your city manually."
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSelectPreset = (preset: { city: string; state: string }) => {
    onChange({
      ...location,
      city: preset.city,
      state: preset.state,
      country: "India",
      source: "manual",
    });
  };

  const isFormValid = location.city.trim().length >= 2;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Where is the property you are evaluating?
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Location determines the solar irradiance (Peak Sun Hours) used to
          forecast annual generation.
        </p>
      </div>

      {/* Geolocation Button */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="flex items-center justify-center space-x-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 shadow-sm hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 transition"
        >
          <Navigation className={`h-4 w-4 text-amber-500 ${isLocating ? "animate-spin" : ""}`} />
          <span>{isLocating ? "Detecting location..." : "Use My Current Location"}</span>
        </button>
        {location.latitude && location.longitude && (
          <span className="flex items-center space-x-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>
              GPS Lat: {location.latitude.toFixed(4)}, Lng: {location.longitude.toFixed(4)}
            </span>
          </span>
        )}
      </div>

      {errorMsg && (
        <div className="flex items-center space-x-2 text-xs text-red-400 bg-red-500/10 p-2.5 rounded-md border border-red-500/20">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* City Presets */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
          Quick Select Region
        </label>
        <div className="flex flex-wrap gap-2">
          {POPULAR_CITIES.map((item) => {
            const isSelected =
              location.city.toLowerCase() === item.city.toLowerCase();
            return (
              <button
                key={item.city}
                type="button"
                onClick={() => handleSelectPreset(item)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  isSelected
                    ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                    : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
                }`}
              >
                {item.city}
              </button>
            );
          })}
        </div>
      </div>

      {/* Manual Input Fields */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="city-input"
            className="block text-sm font-medium text-slate-300"
          >
            City / Town <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1">
            <input
              id="city-input"
              type="text"
              value={location.city}
              onChange={(e) =>
                onChange({ ...location, city: e.target.value, source: "manual" })
              }
              placeholder="e.g. Belagavi"
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm font-semibold text-white placeholder:text-slate-500 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <MapPin className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
          </div>
        </div>

        <div>
          <label
            htmlFor="state-input"
            className="block text-sm font-medium text-slate-300"
          >
            State
          </label>
          <input
            id="state-input"
            type="text"
            value={location.state || ""}
            onChange={(e) =>
              onChange({ ...location, state: e.target.value })
            }
            placeholder="e.g. Karnataka"
            className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm font-semibold text-white placeholder:text-slate-500 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Irradiance Info Banner */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <div className="flex items-start space-x-3">
          <div className="rounded-lg bg-amber-500/10 p-2 text-amber-500">
            <Sun className={`h-5 w-5 ${isLoadingSolar ? "animate-spin" : ""}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-semibold text-white">
                Solar Irradiance for {location.city || "Selected Area"}
              </h4>
              {liveResource.isLive && (
                <span className="inline-flex items-center space-x-1 rounded bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                  <Radio className="h-3 w-3 animate-pulse" />
                  <span>LIVE SATELLITE</span>
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-400">
              {isLoadingSolar ? (
                <span>Fetching live irradiance from Global Solar Atlas / NASA satellite grid...</span>
              ) : (
                <>
                  Peak Sun Hours:{" "}
                  <strong className="text-white font-mono text-sm">
                    {liveResource.peakSunHours} kWh/m²/day
                  </strong>{" "}
                  <span className="opacity-75 block sm:inline mt-0.5 sm:mt-0">
                    • Source: {liveResource.source}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={onNext}
          disabled={!isFormValid}
          className="rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-bold text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-[#070A11] disabled:opacity-40 transition active:scale-95"
        >
          Next: Roof Measurement →
        </button>
      </div>
    </div>
  );
}
