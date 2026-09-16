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
    city: "Belagavi",
    state: "Karnataka",
    country: "India",
    latitude: 15.8497,
    longitude: 74.4977,
    source: "manual",
  },
  roof: {
    areaSqFt: 1200,
    areaSqM: 111.48,
    measurementMethod: "manual",
    orientation: "southEast",
    shading: "low",
  },
  electricity: {
    monthlyBillINR: 3500,
    monthlyConsumptionKWh: 450,
    tariffINRPerKWh: 8.5,
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

export function toSolarEstimatorInput(state: WizardState): SolarEstimatorInput {
  return {
    location: state.location,
    roof: state.roof,
    electricity: state.electricity,
    system: state.system,
  };
}
