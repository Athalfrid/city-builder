import { BuildingType } from "./building";

export interface ProductionTask {
  x: number;
  y: number;
  type: BuildingType;
  timeLeft: number;
}

export interface Production {
  gold: number;
  wood: number;
  food: number;
  stone: number;
  water: number;
}
