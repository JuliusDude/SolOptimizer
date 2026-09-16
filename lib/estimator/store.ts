import { z } from "zod";
import {
  PropertyLocation,
  RoofDetails,
  ElectricityDetails,
  SystemAssumptionsInput,
  SolarAssumptions,
  SolarEstimatorInput,
  RoofOrientation,
  ShadingLevel,
} from "../solar/types";
import { DEFAULT_SOLAR_ASSUMPTIONS } from "../solar/assumptions";

export const propertyLocationSchema = z.object({
  city: z.string().min(2, "City name is required"),
  state: z.string().optional(),
  country: z.string().default("India"),
  postalCode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  source: z.enum(["current_location", "manual", "map"]).optional(),
});

export const roofDetailsSchema = z.object({
  areaSqFt: z.number().positive("Roof area must be greater than 0"),
  areaSqM: z.number().positive("Roof area must be greater than 0"),
  measurementMethod: z.enum(["manual", "map_polygon"]),
  roofGeometry: z.any().optional(),
  orientation: z.enum([
    "north",
    "northEast",
    "east",
    "southEast",
    "south",
    "southWest",
    "west",
    "northWest",
  ]),
  shading: z.enum(["low", "moderate", "high"]),
});

export const electricityDetailsSchema = z.object({
  monthlyBillINR: z.number().min(0, "Monthly bill cannot be negative"),
  monthlyConsumptionKWh: z.number().optional(),
  tariffINRPerKWh: z.number().positive("Tariff must be greater than 0"),
  isCustomTariff: z.boolean().default(false),
});

export const systemAssumptionsSchema = z.object({
  costPerKW: z.number().positive("Cost per kW must be greater than 0"),
  isCustomCost: z.boolean().default(false),
});

export interface WizardState {
  step: number;
  location: PropertyLocation;
  roof: RoofDetails;
  electricity: ElectricityDetails;
  system: SystemAssumptionsInput;
  customAssumptions: Partial<SolarAssumptions>;
}

export const INITIAL_WIZARD_STATE: WizardState = {
  step: 1,
  location: {
    city: "",
    state: "",
    country: "India",
    source: "manual",
  },
  roof: {
    areaSqFt: 0,
    areaSqM: 0,
    measurementMethod: "manual",
    orientation: "south" as RoofOrientation,
    shading: "low" as ShadingLevel,
  },
  electricity: {
    monthlyBillINR: 0,
    monthlyConsumptionKWh: undefined,
    tariffINRPerKWh: 8.0,
    isCustomTariff: false,
  },
  system: {
    costPerKW: 55000,
    isCustomCost: false,
  },
  customAssumptions: {
    ...DEFAULT_SOLAR_ASSUMPTIONS,
  },
};

export function isStepValid(stepNumber: number, state: WizardState): boolean {
  switch (stepNumber) {
    case 1:
      return Boolean(state.location?.city && state.location.city.trim().length >= 2);
    case 2:
      return Boolean(state.roof?.areaSqFt && state.roof.areaSqFt > 0);
    case 3:
      return Boolean(state.roof?.orientation && state.roof?.shading);
    case 4:
      return Boolean(
        state.electricity?.monthlyBillINR &&
        state.electricity.monthlyBillINR > 0 &&
        state.electricity?.tariffINRPerKWh &&
        state.electricity.tariffINRPerKWh > 0
      );
    case 5:
      return Boolean(state.system?.costPerKW && state.system.costPerKW > 0);
    case 6:
      return true;
    default:
      return true;
  }
}

export function getMaxReachableStep(state: WizardState): number {
  for (let i = 1; i <= 5; i++) {
    if (!isStepValid(i, state)) {
      return i;
    }
  }
  return 6;
}

export function toSolarEstimatorInput(state: WizardState): SolarEstimatorInput {
  return {
    location: state.location,
    roof: state.roof,
    electricity: state.electricity,
    system: state.system,
  };
}
