import { create } from "zustand";
import { generateMapWithPerlin } from "../services/mapGenerator";
import { getDistance } from "../utils/distance";
import {
  buildingCosts,
  buildingPopulation,
  buildingProduction,
  canProduce,
  EMPTY_BUILDING,
} from "../types/building";
import { Resources, ResourceType } from "../types/resources";
import { ProductionTask } from "../types/production";
import { CityState } from "./CityState";
import { MapTile, TerrainType } from "../types/map";

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

  const transformSurroundingToWheat = (
    x: number,
    y: number,
    grid: MapTile[]
  ) => {
    const newGrid = [...grid];

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const nx = x + dx;
        const ny = y + dy;

        const index = newGrid.findIndex((t) => t.x === nx && t.y === ny);
        if (
          index !== -1 &&
          newGrid[index].terrain === "grass" &&
          !(nx === x && ny === y)
        ) {
          newGrid[index].terrain = "wheat";
        }
      }
    }

    return newGrid;
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
    toolMode: "build",
    setToolMode: (mode) => set({ toolMode: mode }),

    //INITIALISATION DES DIMENSIONS ET DE LA CARTE EN FONCTION DE CELLES-CI
    initGrid: () => {
      const { width, height } = get();
      const grid = generateMapWithPerlin(width, height);
      set({ grid });
    },

    // CALCUL DU COUT DE CONSTRUCTION EN RESSOURCES
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

    //AJOUT DES RESSOURCES AU STOCK VIA PRODUCTION OU DESTRUCTION D'UN BATIMENT
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

    //PLACEMENT D'UN BATIMENT EN FONCTION DES COORDONNEES ET DU TYPE DE BATIMENT
    placeBuilding: (x, y, building) => {
      //VERIFICATION DE LA PRÉSENCE DE L'HOTEL DE VILLE
      if (building !== "townhall") {
        const hasTownhall = get().grid.some(
          (tile) => tile.building === "townhall"
        );
        if (!hasTownhall) {
          alert("⛔ Tu dois d'abord construire un hôtel de ville !");
          return;
        }
      }

      //VERIFICATION S'IL N'Y A PAS DEJA UN HOTEL DE VILLE
      if (building === "townhall") {
        const alreadyExists = get().grid.some(
          (tile) => tile.building === "townhall"
        );
        if (alreadyExists) {
          alert("Il y a déjà un hôtel de ville !");
          return;
        }
      }

      //VERIFICATION DE LA MAIN D'OEUVRE
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

      //EMPECHER DE CONSTRUIRE SUR L'EAU
      if (grid[index].terrain === "water") {
        alert("Vous avez déjà réussi à faire tenir un batiment sur l'eau ?");
        return;
      }

      //PLACER DES CHAMPS AUTOUR D'UNE FERME
      if (building === "farm") {
        const newGrid = transformSurroundingToWheat(x, y, grid);
        set({ grid: newGrid });
      }
      //EMPECHER DE CONSTRUIRE SUR LES CHAMPS DE BLÉ
      if (grid[index].terrain === "wheat") {
        alert("Tu ne peux pas construire sur un champs de blé !");
        return;
      }

      //VERIFICATION DES RESSOURCES DISPONIBLES
      const cost = buildingCosts[building];
      const canAfford = spendResources(cost);
      if (!canAfford) {
        alert("Pas assez de ressources !");
        return;
      }

      const newGrid = [...grid];
      newGrid[index] = { ...newGrid[index], building };
      set({ grid: newGrid });
      //CALCUL DE LA POPULATION ET DE LA MAIN D'OEUVRE APRES LA CONSTRUCTION
      recalcPopulation();
      get().refreshProductionQueue();
    },

    //SUPPRIMER UN BATIMENT (REMBOURSEMENT PARTIEL)
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
      //CALCUL DE LA POPULATION ET DE LA MAIN D'OEUVRE APRES LA CONSTRUCTION
      recalcPopulation();
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
          console.log("prod terminée");
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

    removeResource: (tile: MapTile) => {
      const { resources } = get();
      const { x, y, terrain } = tile;

      if (terrain !== "forest" && terrain !== "mountain" && terrain !== "wheat") {
        alert("Tu ne peux supprimer que des ressources naturelles !");
        return;
      }

      const cost = 2;
      if (resources.gold < cost) {
        alert("Pas assez d’or pour utiliser le bulldozer !");
        return;
      }

      const newResources = { ...resources, gold: resources.gold - cost };
      const newGrid = get().grid.map((t) =>
        t.x === x && t.y === y
          ? {
              ...t,
              terrain: terrain === "forest" ? "grass" : terrain === "mountain" ? "desert" : "grass" as TerrainType,
            }
          : t
      );

      set({ grid: newGrid, resources: newResources });
    },
  };
});
