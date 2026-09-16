import { describe, it, expect } from "vitest";
import {
  calculateUsableRoofArea,
  calculateSystemCapacityKW,
  calculateAnnualGenerationKWh,
  calculateSystemCostINR,
  calculateAnnualSavingsINR,
  calculateSimplePaybackYears,
  calculateCO2AvoidedKg,
  calculateTwentyFiveYearProjection,
  calculateSolarEstimate,
} from "../../lib/solar/calculator";
import { DEFAULT_SOLAR_ASSUMPTIONS } from "../../lib/solar/assumptions";
import { SolarEstimatorInput } from "../../lib/solar/types";

describe("Solar Calculation Engine", () => {
  describe("Usable Roof Area", () => {
    it("calculates usable area correctly with 0.85 factor", () => {
      expect(calculateUsableRoofArea(1200, 0.85)).toBe(1020);
      expect(calculateUsableRoofArea(1000, 0.85)).toBe(850);
    });

    it("returns 0 for zero or negative area", () => {
      expect(calculateUsableRoofArea(0, 0.85)).toBe(0);
      expect(calculateUsableRoofArea(-500, 0.85)).toBe(0);
    });
  });

  describe("System Capacity (kW)", () => {
    it("calculates capacity based on 80 sqft/kW assumption", () => {
      expect(calculateSystemCapacityKW(1020, 80)).toBe(12.75);
      expect(calculateSystemCapacityKW(400, 80)).toBe(5);
    });

    it("handles zero or negative usable area", () => {
      expect(calculateSystemCapacityKW(0, 80)).toBe(0);
      expect(calculateSystemCapacityKW(-100, 80)).toBe(0);
    });
  });

  describe("Annual Generation (kWh)", () => {
    it("calculates deterministic annual generation with all derate factors", () => {
      // 5 kW, 5.0 PSH, 365 days, 0.78 PR, South (1.0), Low shading (1.0)
      // 5 * 5 * 365 * 0.78 * 1.0 * 1.0 = 7117.5 -> rounded 7118
      const gen = calculateAnnualGenerationKWh(5, 5.0, 0.78, 1.0, 1.0);
      expect(gen).toBe(7118);
    });

    it("derates for North orientation (0.60) and High shading (0.55)", () => {
      const gen = calculateAnnualGenerationKWh(5, 5.0, 0.78, 0.6, 0.55);
      // 7117.5 * 0.6 * 0.55 = 2348.775 -> 2349
      expect(gen).toBe(2349);
    });
  });

  describe("Financials & Payback", () => {
    it("calculates system cost", () => {
      expect(calculateSystemCostINR(5, 55000)).toBe(275000);
      expect(calculateSystemCostINR(0, 55000)).toBe(0);
    });

    it("calculates annual savings", () => {
      expect(calculateAnnualSavingsINR(7118, 8.5)).toBe(60503);
      expect(calculateAnnualSavingsINR(0, 8.5)).toBe(0);
    });

    it("calculates simple payback period", () => {
      // 275000 / 60503 = 4.545 -> 4.5
      expect(calculateSimplePaybackYears(275000, 60503)).toBe(4.5);
    });

    it("returns null when savings are zero or negative to prevent Infinity", () => {
      expect(calculateSimplePaybackYears(275000, 0)).toBeNull();
      expect(calculateSimplePaybackYears(275000, -100)).toBeNull();
      expect(calculateSimplePaybackYears(0, 60503)).toBeNull();
    });
  });

  describe("CO2 Avoided", () => {
    it("calculates avoided emissions using India CEA grid factor (0.82 kg/kWh)", () => {
      // 7118 * 0.82 = 5836.76 -> 5837
      expect(calculateCO2AvoidedKg(7118, 0.82)).toBe(5837);
    });
  });

  describe("25-Year Projection", () => {
    it("applies annual degradation and tariff escalation over 25 years", () => {
      const projection = calculateTwentyFiveYearProjection(
        275000,
        7118,
        8.0,
        DEFAULT_SOLAR_ASSUMPTIONS
      );

      expect(projection).toHaveLength(25);
      expect(projection[0].year).toBe(1);
      expect(projection[0].generationKWh).toBe(7118);
      expect(projection[0].savingsINR).toBe(56944);

      // Year 25 should show degraded generation (0.7%/yr) and escalated tariff (3%/yr)
      const year25 = projection[24];
      expect(year25.year).toBe(25);
      expect(year25.generationKWh).toBeLessThan(7118);
      expect(year25.cumulativeSavingsINR).toBeGreaterThan(projection[0].savingsINR * 25);
      expect(year25.netCashFlowINR).toBeGreaterThan(0); // Positively paid off
    });
  });

  describe("Full Belagavi Demo Scenario (PRD Section 21)", () => {
    it("runs complete estimate pipeline deterministically matching expected inputs", () => {
      const input: SolarEstimatorInput = {
        location: {
          city: "Belagavi",
          state: "Karnataka",
          country: "India",
          latitude: 15.8497,
          longitude: 74.4977,
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
      };

      const result = calculateSolarEstimate(input, { peakSunHoursPerDay: 5.4 });

      expect(result.usableRoofAreaSqFt).toBe(1020);
      expect(result.estimatedCapacityKW).toBe(12.75);
      expect(result.systemCostINR).toBe(701250);
      expect(result.annualGenerationKWh).toBeGreaterThan(18000);
      expect(result.annualSavingsINR).toBeGreaterThan(150000);
      expect(result.paybackYears).toBeCloseTo(4.4, 0.5);
      expect(result.twentyFiveYearProjection).toHaveLength(25);
      expect(result.monthlyGenerationKWh).toHaveLength(12);
      expect(result.explanation.capacityFormula).toContain("12.75 kW");
    });
  });
});
