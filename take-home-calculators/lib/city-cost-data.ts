// City cost-of-living context for salary pages
// Index: 100 = national average cost of living
// Rent multiplier: typical 1BHK rent as % of in-hand for someone at this LPA

export type CityTier = "metro" | "tier2" | "tier3";

export interface CityData {
  name: string;
  tier: CityTier;
  costIndex: number;       // relative to national average (100)
  avgRent1BHK: number;     // typical monthly rent, ₹
  isMetroForHRA: boolean;  // Mumbai, Delhi, Kolkata, Chennai get 50% HRA exemption
}

export const CITIES: CityData[] = [
  { name: "Mumbai",     tier: "metro", costIndex: 145, avgRent1BHK: 28000, isMetroForHRA: true },
  { name: "Delhi NCR",  tier: "metro", costIndex: 130, avgRent1BHK: 22000, isMetroForHRA: true },
  { name: "Bengaluru",  tier: "metro", costIndex: 125, avgRent1BHK: 20000, isMetroForHRA: false },
  { name: "Chennai",    tier: "metro", costIndex: 105, avgRent1BHK: 15000, isMetroForHRA: true },
  { name: "Kolkata",    tier: "metro", costIndex: 95,  avgRent1BHK: 12000, isMetroForHRA: true },
  { name: "Hyderabad",  tier: "metro", costIndex: 100, avgRent1BHK: 14000, isMetroForHRA: false },
  { name: "Pune",       tier: "metro", costIndex: 110, avgRent1BHK: 16000, isMetroForHRA: false },
  { name: "Ahmedabad",  tier: "tier2", costIndex: 85,  avgRent1BHK: 10000, isMetroForHRA: false },
  { name: "Jaipur",     tier: "tier2", costIndex: 75,  avgRent1BHK: 8500,  isMetroForHRA: false },
  { name: "Lucknow",    tier: "tier2", costIndex: 70,  avgRent1BHK: 8000,  isMetroForHRA: false },
  { name: "Indore",     tier: "tier2", costIndex: 70,  avgRent1BHK: 7500,  isMetroForHRA: false },
  { name: "Kochi",      tier: "tier2", costIndex: 80,  avgRent1BHK: 9500,  isMetroForHRA: false },
  { name: "Tier-3 City", tier: "tier3", costIndex: 55, avgRent1BHK: 5000,  isMetroForHRA: false },
];

export const NATIONAL_AVG_LPA_BY_EXPERIENCE: Record<string, number> = {
  "0-2 years":  4.5,
  "3-5 years":  8.5,
  "6-10 years": 15,
  "10+ years":  25,
};

/**
 * Returns a qualitative "purchasing power" comparison —
 * what this LPA roughly "feels like" relative to a Tier-1 metro baseline.
 */
export function getEquivalentLpaInCity(baseLpa: number, fromCity: CityData, toCity: CityData): number {
  const ratio = fromCity.costIndex / toCity.costIndex;
  return Math.round(baseLpa * ratio * 10) / 10;
}
