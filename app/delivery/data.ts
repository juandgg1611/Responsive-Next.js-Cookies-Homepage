export type LatLng = { lat: number; lng: number };
export type CoverageZone = {
  name: string;
  center: LatLng;
  radius: number;
  fee: number;
  time: string;
  color: string;
  minOrder: string;
};

export const MARACAIBO_CENTER: LatLng = { lat: 10.6315, lng: -71.6405 };

export const COVERAGE_ZONES: CoverageZone[] = [
  {
    name: "Centro",
    center: { lat: 10.6427, lng: -71.6125 },
    radius: 3000,
    fee: 2.99,
    time: "25-35 min",
    color: "#D4A574",
    minOrder: "$15",
  },
  {
    name: "Bellas Artes",
    center: { lat: 10.6756, lng: -71.6489 },
    radius: 2500,
    fee: 3.49,
    time: "30-40 min",
    color: "#C4914A",
    minOrder: "$20",
  },
  {
    name: "La Lago",
    center: { lat: 10.6189, lng: -71.6517 },
    radius: 2800,
    fee: 3.99,
    time: "35-45 min",
    color: "#A67040",
    minOrder: "$20",
  },
  {
    name: "Sabaneta",
    center: { lat: 10.6606, lng: -71.6256 },
    radius: 3200,
    fee: 4.49,
    time: "40-50 min",
    color: "#8B5A32",
    minOrder: "$25",
  },
  {
    name: "Vereda del Lago",
    center: { lat: 10.635, lng: -71.67 },
    radius: 2200,
    fee: 3.29,
    time: "28-38 min",
    color: "#BA7D4E",
    minOrder: "$15",
  },
  {
    name: "Las Delicias",
    center: { lat: 10.65, lng: -71.635 },
    radius: 2600,
    fee: 3.79,
    time: "33-43 min",
    color: "#9C6B3A",
    minOrder: "$20",
  },
];
