export interface DeliveryZone {
  id: string;
  name: string;
  price: number; // Frais de livraison en FDJ
  estimatedTime: string;
}

// Zones de livraison desservies à Djibouti-ville
export const DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: "centre_ville",
    name: "Centre-Ville / Plateau / Einguella",
    price: 300,
    estimatedTime: "20-30 min",
  },
  {
    id: "heron_marabout",
    name: "Héron / Marabout",
    price: 400,
    estimatedTime: "25-35 min",
  },
  {
    id: "haramous",
    name: "Haramous",
    price: 500,
    estimatedTime: "30-40 min",
  },
  {
    id: "gabode",
    name: "Gabode / Aéroport",
    price: 400,
    estimatedTime: "25-35 min",
  },
  {
    id: "boulaos",
    name: "Boulaos / Stade",
    price: 350,
    estimatedTime: "20-30 min",
  },
  {
    id: "balbala_centre",
    name: "Balbala (Carrefour / Cité Cheik Osman)",
    price: 500,
    estimatedTime: "30-45 min",
  },
  {
    id: "balbala_sud",
    name: "Balbala Sud / Cheik Moussa",
    price: 600,
    estimatedTime: "35-50 min",
  },
  {
    id: "pk12_doraleh",
    name: "PK12 / Doraleh",
    price: 700,
    estimatedTime: "40-55 min",
  },
];
