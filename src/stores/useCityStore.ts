import { create } from "zustand";
import { generateMapWithPerlin, MapTile } from "../services/mapGenerator";
import {
  buildingCosts,
  buildingPopulation,
  buildingProduction,
  canProduce,
  EMPTY_BUILDING,
} from "../constants/building";
import { getDistance } from "../utils/distance";

type ResourceType = {
  gold: number;
  wood: number;
  food: number;
  stone: number;
};

export type BuildingType =
  | "house"
  | "farm"
  | "market"
  | "townhall"
  | "mine"
  | "lumberjack"
  | "none";

export interface Tile {
  x: number;
  y: number;
  building: BuildingType;
}
export interface Resources {
  gold: number;
  wood: number;
  food: number;
  stone: number;
}
interface PopulationState {
  totalPopulation: number;
  employedPopulation: number;
  unemployedPopulation: number;
}

interface ProductionTask {
  x: number;
  y: number;
  type: BuildingType;
  timeLeft: number;
}

interface CityState {
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
}

export const useCityStore = create<CityState>((set, get) => {
  // 💡 Fonction interne
  const recalcPopulation = () => {
    const { grid } = get();
    let totalCapacity = 0;
    let totalWorkforce = 0;

    grid.forEach((tile) => {
      const data = buildingPopulation[tile.building];
      totalCapacity += data.capacity;
      totalWorkforce += data.workforce;
    });

    const totalPopulation = totalCapacity;
    const employedPopulation = Math.min(totalCapacity, totalWorkforce);
    const unemployedPopulation = totalPopulation - employedPopulation;

    set({
      population: {
        totalPopulation,
        employedPopulation,
        unemployedPopulation,
      },
    });
  };

  return {
    width: 30,
    height: 30,
    tileSize: 30,
    setTileSize: (size) => set({ tileSize: size }),
    grid: [],
    selectedBuilding: "house",
    setSelectedBuilding: (building) => set({ selectedBuilding: building }),
    resources: {
      gold: 1000,
      wood: 1000,
      food: 1000,
      stone: 1000,
    },
    population: {
      totalPopulation: 0,
      employedPopulation: 0,
      unemployedPopulation: 0,
    },
    productionQueue: [],

    spendResources: (cost) => {
      const { resources } = get();
      for (const key in cost) {
        const res = key as keyof Resources;
        if ((resources[res] ?? 0) < (cost[res] ?? 0)) return false;
      }
      const newResources = { ...resources };
      for (const key in cost) {
        const res = key as keyof Resources;
        newResources[res] -= cost[res] ?? 0;
      }
      set({ resources: newResources });
      return true;
    },

    initGrid: () => {
      const { width, height } = get();
      const grid = generateMapWithPerlin(width, height);
      set({ grid });
    },

    addResources: (production: Partial<ResourceType>) => {
      set((state) => {
        const newResources = { ...state.resources };

        for (const [key, value] of Object.entries(production) as [
          keyof ResourceType,
          number
        ][]) {
          newResources[key] = (newResources[key] ?? 0) + value;
        }
        return { resources: newResources };
      });
    },
    placeBuilding: (x, y, building) => {
      if (building === "townhall") {
        const alreadyExists = get().grid.some(
          (tile) => tile.building === "townhall"
        );
        if (alreadyExists) {
          alert("Il y a déjà un hôtel de ville !");
          return;
        }
      }

      if (building !== "townhall") {
        const hasTownhall = get().grid.some(
          (tile) => tile.building === "townhall"
        );
        if (!hasTownhall) {
          alert("⛔ Tu dois d'abord construire un hôtel de ville !");
          return;
        }
      }

      const neededWorkforce = buildingPopulation[building].workforce;
      const { population } = get();
      if (
        building !== "townhall" &&
        population.unemployedPopulation < neededWorkforce
      ) {
        alert("Pas assez de main d'oeuvre disponible !");
        return;
      }

      const { grid, spendResources } = get();
      const index = grid.findIndex((tile) => tile.x === x && tile.y === y);
      if (index === -1 || grid[index].building !== "none") return;

      if (grid[index].terrain === "water") {
        alert("Vous avez déjà réussi à faire tenir un batiment sur l'eau ?");
        return;
      }

      const cost = buildingCosts[building];
      const canAfford = spendResources(cost);
      if (!canAfford) {
        alert("Pas assez de ressources !");
        return;
      }

      const newGrid = [...grid];
      newGrid[index] = { ...newGrid[index], building };
      set({ grid: newGrid });
      recalcPopulation(); // 🔁 ici
      get().refreshProductionQueue();
    },

    removeBuilding: (tile) => {
      const { grid, addResources } = get();
      if (tile.building === "none") return;

      const cost = buildingCosts[tile.building];
      const refund: Partial<Resources> = {};
      for (const key in cost) {
        const res = key as keyof Resources;
        refund[res] = Math.floor((cost[res] ?? 0) / 2);
      }
      addResources(refund);

      const newGrid = grid.map((t) =>
        t.x === tile.x && t.y === tile.y
          ? { ...t, building: EMPTY_BUILDING }
          : t
      );
      set({ grid: newGrid });
      recalcPopulation(); // 🔁 ici aussi
      get().refreshProductionQueue();
    },

    refreshProductionQueue: () => {
      const { grid, population } = get();

      const townhall = grid.find((t) => t.building === "townhall");
      if (!townhall) return;

      let availableWorkers = population.employedPopulation;
      const newQueue: ProductionTask[] = [];

      for (const tile of grid) {
        const { building, x, y } = tile;
        if (!canProduce(building)) continue;

        if (building === "none" || buildingProduction[building] == null)
          continue;

        const { workforce } = buildingPopulation[building];
        if (availableWorkers < workforce) continue;

        availableWorkers -= workforce;
        const distance = getDistance(x, y, townhall.x, townhall.y);
        const timeMs = 3000 + distance * 500;
        newQueue.push({ x, y, type: building, timeLeft: timeMs });
      }
      set({ productionQueue: newQueue });
    },

    tickProduction: (delta: number) => {
      const { productionQueue, grid, addResources } = get();
      const updatedQueue: ProductionTask[] = [];

      for (const task of productionQueue) {
        const newTime = task.timeLeft - delta;
        //MON SOUCIS EST LA APRES
        if (newTime <= 0) {
            console.log("prod terminée")
          const production = buildingProduction[task.type];

          if (production) {
            addResources(production);
          }
          const distance = getDistance(
            task.x,
            task.y,
            grid.find((t) => t.building === "townhall")?.x ?? 0,
            grid.find((t) => t.building === "townhall")?.y ?? 0
          );

          const newTimeMs = 3000 + distance * 500;
          updatedQueue.push({ ...task, timeLeft: newTimeMs });
        } else {
          updatedQueue.push({ ...task, timeLeft: newTime });
        }
      }
      set({ productionQueue: updatedQueue });
    },
  };
});
