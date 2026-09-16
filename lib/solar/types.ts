export type RoofOrientation =
  | "north"
  | "northEast"
  | "east"
  | "southEast"
  | "south"
  | "southWest"
  | "west"
  | "northWest";

export type ShadingLevel = "low" | "moderate" | "high";

export type MeasurementMethod = "manual" | "map_polygon";

export interface PropertyLocation {
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  source?: "current_location" | "manual" | "map";
}

export interface RoofDetails {
  areaSqFt: number;
  areaSqM: number;
  measurementMethod: MeasurementMethod;
  roofGeometry?: any; // GeoJSON polygon
  orientation: RoofOrientation;
  shading: ShadingLevel;
}

export interface ElectricityDetails {
  monthlyBillINR: number;
  monthlyConsumptionKWh?: number;
  tariffINRPerKWh: number;
  isCustomTariff: boolean;
}

export interface SystemAssumptionsInput {
  costPerKW: number;
  isCustomCost: boolean;
}

export interface SolarEstimatorInput {
  location: PropertyLocation;
  roof: RoofDetails;
  electricity: ElectricityDetails;
  system: SystemAssumptionsInput;
}

export interface SolarAssumptions {
  peakSunHoursPerDay: number;
  panelEfficiency: number;
  usableRoofFactor: number;
  areaPerKWsqFt: number;
  systemPerformanceFactor: number;
  orientationFactors: Record<RoofOrientation, number>;
  shadingFactors: Record<ShadingLevel, number>;
  annualDegradationRate: number;
  co2KgPerKWh: number;
  tariffEscalationRate: number;
  modelVersion?: string;
}

export interface TwentyFiveYearProjectionYear {
  year: number;
  generationKWh: number;
  savingsINR: number;
  cumulativeSavingsINR: number;
  netCashFlowINR: number;
}

export interface SolarEstimateResult {
  usableRoofAreaSqFt: number;
  usableRoofAreaSqM: number;
  estimatedCapacityKW: number;
  annualGenerationKWh: number;
  monthlyGenerationKWh: number[]; // 12-month array
  systemCostINR: number;
  annualSavingsINR: number;
  paybackYears: number | null; // null if annual savings <= 0
  annualCO2AvoidedKg: number;
  twentyFiveYearProjection: TwentyFiveYearProjectionYear[];
  assumptionsUsed: SolarAssumptions;
  explanation: {
    usableAreaFormula: string;
    capacityFormula: string;
    generationFormula: string;
    savingsFormula: string;
    paybackFormula: string;
    co2Formula: string;
  };
}

export interface SavedEstimateRecord {
  id: string;
  userId?: string;
  propertyName: string;
  createdAt: string;
  input: SolarEstimatorInput;
  assumptions: SolarAssumptions;
  result: SolarEstimateResult;
}
