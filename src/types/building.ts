import { Resources } from "./resources";

export const EMPTY_BUILDING: BuildingType = "none";

export type BuildingType =
  | "townhall"
  | "house"
  | "farm"
  | "market"
  | "mine"
  | "lumberjack"
  | "none";

export interface BuildingPopulation {
  capacity: number;
  workforce: number;
}

export const buildingList: {
  type: BuildingType;
  label: string;
  emoji: string;
  canProduce: boolean;
}[] = [
  { type: "townhall", label: "Hôtel de ville", emoji: "🏛️", canProduce: false },
  { type: "house", label: "Maison", emoji: "🏠", canProduce: false },
  { type: "farm", label: "Ferme", emoji: "🏡", canProduce: true },
  { type: "market", label: "Marché", emoji: "🏪", canProduce: true },
  { type: "mine", label: "Mine", emoji: "⛏️ ", canProduce: true },
  {
    type: "lumberjack",
    label: "Cabane de bûcheron",
    emoji: "🪓",
    canProduce: true,
  },
];

export const buildingCosts: Record<BuildingType, Partial<Resources>> = {
  townhall: { wood: 50, gold: 50 }, //un hôtel de ville coûte 50 bois et 50 or
  house: { wood: 20, gold: 10 }, //une maison coûte 20 bois et 10 or
  farm: { wood: 10, gold: 5 }, //une ferme coûte 10 bois et 2 or
  market: { wood: 30, gold: 30 }, //un marché coûte 30 bois et 30 or
  mine: { wood: 20, gold: 10 },
  lumberjack: { stone: 20, gold: 10 },
  none: {},
};

export const buildingPopulation: Record<BuildingType, BuildingPopulation> = {
  townhall: { capacity: 10, workforce: 8 }, // hôtel de ville héberge 10 et nécessite 8 employés
  house: { capacity: 5, workforce: 0 }, // une maison héberge 5 personnes, ne travaille pas
  farm: { capacity: 0, workforce: 6 }, // une ferme ne loge personne mais nécessite 6 travailleurs
  market: { capacity: 0, workforce: 4 }, // un marché nécessite 4 personnes
  mine: { capacity: 0, workforce: 6 }, // une mine de pierre nécessite 6 personnes
  lumberjack: { capacity: 0, workforce: 6 }, // une cabane de bûcheron nécessite 6 personnes
  none: { capacity: 0, workforce: 0 },
};

export const buildingProduction: Record<BuildingType, Partial<Resources>> = {
  townhall: {}, // ne produit rien (ou gestion plus tard)
  house: {}, // ne produit rien
  farm: { food: 5 }, // produit 5 nourriture par cycle
  market: { gold: 3 }, // produit 3 or par cycle
  mine: { stone: 4 },
  lumberjack: { wood: 4 },
  none: {},
};

export const canProduce = (type: BuildingType): boolean => {
  return buildingList.find((b) => b.type === type)?.canProduce ?? false;
};
