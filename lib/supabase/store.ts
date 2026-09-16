import { createClient } from "./client";
import {
  SavedEstimateRecord,
  SolarAssumptions,
  SolarEstimateResult,
  SolarEstimatorInput,
} from "../solar/types";

const LOCAL_STORAGE_KEY = "soloptimizer_saved_estimates";

// Helper to get local demo storage
function getLocalEstimates(): SavedEstimateRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to read estimates from local storage:", err);
    return [];
  }
}

function saveLocalEstimate(estimate: SavedEstimateRecord) {
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalEstimates();
    const updated = [estimate, ...existing.filter((item) => item.id !== estimate.id)];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save estimate to local storage:", err);
  }
}

export async function persistSolarEstimate(params: {
  propertyName: string;
  input: SolarEstimatorInput;
  assumptions: SolarAssumptions;
  result: SolarEstimateResult;
}): Promise<SavedEstimateRecord> {
  const estimateId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `est_${Date.now()}`;

  const record: SavedEstimateRecord = {
    id: estimateId,
    propertyName: params.propertyName || `${params.input.location.city} Rooftop Solar`,
    createdAt: new Date().toISOString(),
    input: params.input,
    assumptions: params.assumptions,
    result: params.result,
  };

  // 1. Try Supabase if configured and authenticated
  try {
    const supabase = createClient();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        record.userId = user.id;

        // Create or find property
        const { data: propData } = await supabase
          .from("properties")
          .insert({
            user_id: user.id,
            name: record.propertyName,
            city: params.input.location.city,
            state: params.input.location.state,
            country: params.input.location.country,
            postal_code: params.input.location.postalCode,
            latitude: params.input.location.latitude,
            longitude: params.input.location.longitude,
          })
          .select("id")
          .single();

        // Insert solar estimate
        await supabase.from("solar_estimates").insert({
          id: record.id,
          user_id: user.id,
          property_id: propData?.id || null,
          status: "saved",
          input_payload_json: params.input,
          assumptions_json: params.assumptions,
          result_payload_json: params.result,
          roof_geometry_geojson: params.input.roof.roofGeometry || null,
          model_version: params.assumptions.modelVersion || "1.0.0",
        });
      }
    }
  } catch (supabaseErr) {
    console.warn("Supabase persistence fallback to local storage:", supabaseErr);
  }

  // Always save to local backup as well so the user immediately sees it
  saveLocalEstimate(record);
  return record;
}

export async function fetchSavedEstimates(): Promise<SavedEstimateRecord[]> {
  try {
    const supabase = createClient();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("solar_estimates")
          .select("id, user_id, created_at, input_payload_json, assumptions_json, result_payload_json, properties(name)")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((item: any) => ({
            id: item.id,
            userId: item.user_id,
            propertyName:
              (Array.isArray(item.properties)
                ? item.properties[0]?.name
                : item.properties?.name) || "Rooftop Solar Estimate",
            createdAt: item.created_at,
            input: item.input_payload_json,
            assumptions: item.assumptions_json,
            result: item.result_payload_json,
          }));
        }
      }
    }
  } catch (err) {
    console.warn("Supabase fetch error, reading local fallback:", err);
  }

  return getLocalEstimates();
}

export async function fetchSavedEstimateById(
  id: string
): Promise<SavedEstimateRecord | null> {
  // Check local first or Supabase
  const localList = getLocalEstimates();
  const localMatch = localList.find((item) => item.id === id);
  if (localMatch) return localMatch;

  try {
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("solar_estimates")
        .select("id, user_id, created_at, input_payload_json, assumptions_json, result_payload_json, properties(name)")
        .eq("id", id)
        .single();

      if (!error && data) {
        const item = data as any;
        return {
          id: item.id,
          userId: item.user_id,
          propertyName:
            (Array.isArray(item.properties)
              ? item.properties[0]?.name
              : item.properties?.name) || "Rooftop Solar Estimate",
          createdAt: item.created_at,
          input: item.input_payload_json,
          assumptions: item.assumptions_json,
          result: item.result_payload_json,
        };
      }
    }
  } catch (err) {
    console.warn("Supabase fetch by ID error:", err);
  }

  return null;
}

export async function deleteSavedEstimate(id: string): Promise<boolean> {
  if (typeof window !== "undefined") {
    const existing = getLocalEstimates();
    const filtered = existing.filter((item) => item.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
  }

  try {
    const supabase = createClient();
    if (supabase) {
      await supabase.from("solar_estimates").delete().eq("id", id);
    }
  } catch (err) {
    console.warn("Supabase delete error:", err);
  }

  return true;
}
