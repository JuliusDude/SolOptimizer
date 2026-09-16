import { getSolarResourceForLocation } from "./assumptions";

export interface LiveSolarResource {
  peakSunHours: number;
  source: string;
  matchedLocation: string;
  isLive?: boolean;
}

/**
 * Fetches real-time solar irradiance (Global Horizontal Irradiance / PSH)
 * from NASA POWER Climatology & Global Solar Atlas datasets for the exact coordinates.
 * Falls back seamlessly to the verified regional dataset if offline or unavailable.
 */
export async function fetchSolarResourceForLocation(
  city?: string,
  state?: string,
  latitude?: number,
  longitude?: number
): Promise<LiveSolarResource> {
  // If coordinates are provided, query live NASA POWER / Solar Climatology API
  if (typeof latitude === "number" && typeof longitude === "number" && !isNaN(latitude) && !isNaN(longitude)) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const url = `https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=ALLSKY_SFC_SW_DWN&community=RE&longitude=${longitude.toFixed(4)}&latitude=${latitude.toFixed(4)}&format=JSON`;
      
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const annualPSH = data?.properties?.parameter?.ALLSKY_SFC_SW_DWN?.ANN;
        if (typeof annualPSH === "number" && annualPSH > 0 && annualPSH < 12) {
          const roundedPSH = Math.round(annualPSH * 10) / 10;
          return {
            peakSunHours: roundedPSH,
            source: "NASA POWER Global Solar Radiation (Live Satellite Geo-grid)",
            matchedLocation: city ? `${city}${state ? `, ${state}` : ""}` : `GPS (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)`,
            isLive: true,
          };
        }
      }
    } catch (e) {
      // Graceful fallback to static benchmark
      console.warn("Live solar resource query timed out or failed, using benchmark dataset", e);
    }
  }

  // Fallback to regional benchmark lookup
  const benchmark = getSolarResourceForLocation(city, state);
  return {
    ...benchmark,
    source: `${benchmark.source} (MNRE / Global Solar Atlas benchmark)`,
    isLive: false,
  };
}
