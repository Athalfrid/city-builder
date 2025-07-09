import { BuildingType } from "../types/building";
import { MapTile } from "../types/map";
import { PopulationState } from "../types/population";
import { ProductionTask } from "../types/production";
import { Resources } from "../types/resources";

export interface CityState {
  width: number;
  height: number;
  grid: MapTile[];
  tileSize: number;
  setTileSize: (size: number) => void;
  selectedBuilding: BuildingType;
  setSelectedBuilding: (building: BuildingType) => void;
  initGrid: () => void;
  placeBuilding: (x: number, y: number, building: BuildingType) => void;
  removeBuilding: (tile: MapTile) => void;
  resources: Resources;
  spendResources: (cost: Partial<Resources>) => boolean;
  addResources: (gain: Partial<Resources>) => void;
  population: PopulationState;
  productionQueue: ProductionTask[];
  tickProduction: (delta: number) => void;
  refreshProductionQueue: () => void;
  toolMode: "build" | "recolter";
  setToolMode: (mode: "build" | "recolter") => void;
  removeResource: (tile : MapTile) => void
}
