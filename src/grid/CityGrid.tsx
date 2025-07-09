import React, { useEffect } from "react";
import { useCityStore } from "../stores/useCityStore";
import { MapTile, TerrainType } from "../types/map";
import { BuildingType } from "../types/building";

export const CityGrid = () => {
  const {
    grid,
    tileSize,
    initGrid,
    placeBuilding,
    removeBuilding,
    selectedBuilding,
    toolMode,
    removeResource
  } = useCityStore();

  useEffect(() => {
    initGrid();
  }, [initGrid]);

  const terrainLabels: Record<TerrainType, string> = {
    grass: "🌿 Plaine",
    forest: "🌲 Forêt",
    water: "🌊 Eau",
    mountain: "⛰️ Montagne",
    desert: "🏜️ Désert",
    wheat: "🌾 Blé",
  };

  const buildingLabels: Record<BuildingType, string> = {
    townhall: "🏛️",
    house: "🏠 Maison",
    farm: "🏡 Ferme",
    market: "🏪 Marché",
    mine: "⛏️",
    lumberjack: "🪓",
    none: "",
  };

  const buildingLogos: Record<BuildingType, string> = {
    townhall: "🏛️",
    house: "🏠",
    farm: "🏡",
    market: "🏪",
    mine: "⛏️",
    lumberjack: "🪓",
    none: "",
  };

  const getTileLabels = (tile: MapTile) => {
    switch (tile.terrain) {
      case "forest":
        return "🌲";
      case "water":
        return "🌊";
      case "mountain":
        return "⛰️";
      case "desert":
        return "🏜️";
      case "wheat":
        return "🌾"; // 🌟 Ajout ici pour voir tes champs
      default:
        if (tile.building !== "none") {
          return `${buildingLogos[tile.building]}`;
        } else {
          return "";
        }
    }
  };

  const getTileTitle = (tile: MapTile) => {
    return `${terrainLabels[tile.terrain]} (${tile.x}, ${tile.y})${
      tile.building !== "none" ? " - " + buildingLabels[tile.building] : ""
    }`;
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(30,30px)`,
      }}
    >
      {grid.map((tile) => (
        <div
          key={`${tile.x}-${tile.y}`}
          onClick={() => {
            if(toolMode === "recolter"){
              removeResource(tile);
            }else{
              if (tile.building !== "none") {
                removeBuilding(tile);
              } else {
                placeBuilding(tile.x, tile.y, selectedBuilding);
              }
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
