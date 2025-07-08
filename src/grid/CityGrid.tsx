import React, { use, useEffect } from "react";
import { BuildingType, useCityStore } from "../stores/useCityStore";
import { MapTile, TerrainType } from "../services/mapGenerator";

export const CityGrid = () => {
  const { grid, tileSize, initGrid, placeBuilding, removeBuilding,selectedBuilding } =
    useCityStore();

  useEffect(() => {
    initGrid();
  }, [initGrid]);

  const terrainLabels: Record<TerrainType, string> = {
    grass: "🌿 Plaine",
    forest: "🌲 Forêt",
    water: "🌊 Eau",
    mountain: "⛰️ Montagne",
    desert: "🏜️ Désert",
  };

  const buildingLabels: Record<BuildingType, string> = {
    house: "🏠 Maison",
    farm: "🌾 Ferme",
    market: "🏪 Marché",
    townhall: "🏛️",
    mine: "⛏️",
    lumberjack:"🪓",
    none: "",
  };

  const buildingLogos: Record<BuildingType, string> = {
    house: "🏠",
    farm: "🌾",
    market: "🏪",
    townhall: "🏛️",
    mine: "⛏️",
    lumberjack:"🪓",
    none: "",
  };

  const getTileLabels = (tile: MapTile) =>{
    return `${buildingLogos[tile.building]}`
  }

  const getTileTitle = (tile: MapTile) => {

    return `${terrainLabels[tile.terrain]} (${tile.x}, ${tile.y})${
      tile.building !== "none" ? " - " + buildingLabels[tile.building] : ""
    }`;
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(30,20px)`,
      }}
    >
      {grid.map((tile) => (
        <div
          key={`${tile.x}-${tile.y}`}
          onClick={() => {
            if (tile.building !== "none") {
              removeBuilding(tile);
            } else {
              placeBuilding(tile.x, tile.y, selectedBuilding);
            }
          }}
          style={{
            width: tileSize,
            height: tileSize,
            backgroundColor: (() => {
              switch (tile.terrain) {
                case "forest":
                  return "#228B22";
                case "water":
                  return "#1E90FF";
                case "mountain":
                  return "#A9A9A9";
                case "desert":
                  return "#EDC9AF";
                default:
                  return "#90ee90";
              }
            })(),
            border: "1px solid #999",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            userSelect: "none",
          }}
          title={getTileTitle(tile)}
        >
            {getTileLabels(tile)}
        </div>
      ))}
    </div>
  );
};
