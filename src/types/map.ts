import { BuildingType } from "./building";

export type TerrainType = "grass" | "forest" | "water" | "mountain" | "desert" | "wheat";


export interface Tile {
  x: number;
  y: number;
  building: BuildingType;
}

export interface MapTile extends Tile {
  terrain: TerrainType;
}