import assumptionsData from "@/data/assumptions.json";
import solarResourceData from "@/data/solar-resource.json";
import { RoofOrientation, ShadingLevel, SolarAssumptions } from "./types";

export const DEFAULT_SOLAR_ASSUMPTIONS: SolarAssumptions = {
  peakSunHoursPerDay: assumptionsData.peakSunHoursPerDay,
  panelEfficiency: assumptionsData.panelEfficiency,
  usableRoofFactor: assumptionsData.usableRoofFactor,
  areaPerKWsqFt: assumptionsData.areaPerKWsqFt,
  systemPerformanceFactor: assumptionsData.systemPerformanceFactor,
  orientationFactors: assumptionsData.orientationFactors as Record<RoofOrientation, number>,
  shadingFactors: assumptionsData.shadingFactors as Record<ShadingLevel, number>,
  annualDegradationRate: assumptionsData.annualDegradationRate,
  co2KgPerKWh: assumptionsData.co2KgPerKWh,
  tariffEscalationRate: assumptionsData.tariffEscalationRate,
  modelVersion: assumptionsData.version,
};

export function getSolarResourceForLocation(city?: string, state?: string): {
  peakSunHours: number;
  source: string;
  matchedLocation: string;
} {
  const resourceMap = solarResourceData as Record<string, any>;
  
  if (city && state) {
    const key = `${city}, ${state}`;
    if (resourceMap[key]) {
      return {
        peakSunHours: resourceMap[key].peakSunHoursPerDay,
        source: resourceMap[key].source,
        matchedLocation: key,
      };
    }
  }

  if (city) {
    for (const key of Object.keys(resourceMap)) {
      if (key.toLowerCase().includes(city.toLowerCase())) {
        return {
          peakSunHours: resourceMap[key].peakSunHoursPerDay,
          source: resourceMap[key].source,
          matchedLocation: key,
        };
      }
    }
  }

  return {
    peakSunHours: resourceMap.default.peakSunHoursPerDay,
    source: resourceMap.default.source,
    matchedLocation: "National Average",
  };
}
