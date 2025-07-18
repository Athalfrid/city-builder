import { BuildingType } from "../types/building";
import { Consumption } from "../types/consumption";
import { MapTile } from "../types/map";
import { PopulationState } from "../types/population";
import { Production, ProductionTask } from "../types/production";
import { Resources } from "../types/resources";

export interface CityState {
  //DEFINITION DE LA TAILLE DE LA MAP ET DES TILES
  width: number;
  height: number;
  grid: MapTile[];
  tileSize: number;
  setTileSize: (size: number) => void;
  initGrid: () => void;
  //SELECTION DU BATIMENT
  selectedBuilding: BuildingType;
  setSelectedBuilding: (building: BuildingType) => void;
  //CONSTRUCTION DU BATIMENT
  placeBuilding: (x: number, y: number, building: BuildingType) => void;
  //SUPPRESSION DU BATIMENT
  removeBuilding: (tile: MapTile) => void;
  //GESTION DES RESSOURCES
  resources: Resources;
  spendResources: (cost: Partial<Resources>) => boolean;
  addResources: (gain: Partial<Resources>) => void;
  //GESTION DE LA POPULATION
  population: PopulationState;
  //GESTION DE LA PRODUCTION
  productionQueue: ProductionTask[];
  tickProduction: (delta: number) => void;
  refreshProductionQueue: () => void;
  removeProductionQueue: (taskToRemove:ProductionTask)=>void;
  production: Production;
  setProduction: (newProduction: Production) => void;
  //GESTION DE LA CONSOMMATION
  consumption: Consumption;
  setConsumption: (newConsumption: Consumption) => void;
  //GESTION DU MODE 
  toolMode: "build" | "recolter";
  setToolMode: (mode: "build" | "recolter") => void;
  //GESTION DES RESSOURCES SUR LA MAP
  removeResource: (tile : MapTile) => void;
}
