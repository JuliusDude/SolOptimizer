"use client";

import React, { useState } from "react";
import { MapPin, Navigation, Sun, CheckCircle2, AlertTriangle } from "lucide-react";
import { PropertyLocation } from "@/lib/solar/types";
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const solarResource = getSolarResourceForLocation(
    location.city,
    location.state
  );

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onChange({
          ...location,
          latitude,
          longitude,
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
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Where is the property you are evaluating?
        </h2>
        <p className="mt-1 text-sm text-slate-600">
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
          className="flex items-center justify-center space-x-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-solar-500 disabled:opacity-50 transition"
        >
          <Navigation className={`h-4 w-4 text-solar-600 ${isLocating ? "animate-spin" : ""}`} />
          <span>{isLocating ? "Detecting location..." : "Use My Current Location"}</span>
        </button>
        {location.latitude && location.longitude && (
          <span className="flex items-center space-x-1 text-xs text-eco-700 bg-eco-50 border border-eco-200 px-3 py-1.5 rounded-full">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>
              GPS Lat: {location.latitude.toFixed(4)}, Lng: {location.longitude.toFixed(4)}
            </span>
          </span>
        )}
      </div>

      {errorMsg && (
        <div className="flex items-center space-x-2 text-xs text-amber-700 bg-amber-50 p-2.5 rounded-md border border-amber-200">
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
                    ? "bg-solar-500 text-slate-900 font-bold shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
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
            className="block text-sm font-medium text-slate-700"
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
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 shadow-sm focus:border-solar-500 focus:outline-none focus:ring-1 focus:ring-solar-500"
            />
            <MapPin className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
          </div>
        </div>

        <div>
          <label
            htmlFor="state-input"
            className="block text-sm font-medium text-slate-700"
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
            className="mt-1 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 shadow-sm focus:border-solar-500 focus:outline-none focus:ring-1 focus:ring-solar-500"
          />
        </div>
      </div>

      {/* Irradiance Info Banner */}
      <div className="rounded-xl border border-solar-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4">
        <div className="flex items-start space-x-3">
          <div className="rounded-lg bg-solar-500/20 p-2 text-solar-700">
            <Sun className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              Solar Resource for {location.city || "Selected Area"}
            </h4>
            <p className="mt-0.5 text-xs text-slate-600">
              Estimated Peak Sun Hours:{" "}
              <strong className="text-slate-900">
                {solarResource.peakSunHours} kWh/m²/day
              </strong>{" "}
              (Source: {solarResource.source})
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onNext}
          disabled={!isFormValid}
          className="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-medium text-white shadow hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-solar-500 disabled:opacity-40 transition"
        >
          Next: Roof Measurement →
        </button>
      </div>
    </div>
  );
}
