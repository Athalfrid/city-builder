import { BuildingType } from "./building";

export interface ProductionTask {
  x: number;
  y: number;
  type: BuildingType;
  timeLeft: number;
}
