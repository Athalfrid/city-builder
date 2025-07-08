import { Tile, BuildingType } from "../stores/useCityStore";
import { createNoise2D } from "simplex-noise";

export type TerrainType = "grass" | "forest" | "water" | "mountain" | "desert";

export interface MapTile extends Tile {
  terrain: TerrainType;
}

export function generateMap(width: number, height: number): MapTile[] {
  const terrains: TerrainType[] = [
    "grass",
    "grass",
    "grass",
    "forest",
    "forest",
    "water",
    "mountain",
  ];
  const grid: MapTile[] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const terrain = terrains[Math.floor(Math.random() * terrains.length)];
      grid.push({
        x,
        y,
        building: "none",
        terrain,
      });
    }
  }

  return grid;
}

export function generateMapWithPropagation(
  width: number,
  height: number
): MapTile[] {
  const grid: MapTile[] = [];
  const terrains: TerrainType[] = [
    "grass",
    "forest",
    "water",
    "mountain",
  ];

  // Initialiser la grille avec un terrain par défaut ou aléatoire
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      grid.push({ x, y, building: "none", terrain: "grass" }); // ou un terrain aléatoire initial
    }
  }

  // Fonction utilitaire pour obtenir un terrain par coordonnées (attention aux limites)
  const getTile = (x: number, y: number) => {
    if (x >= 0 && x < width && y >= 0 && y < height) {
      return grid[y * width + x];
    }
    return null;
  };

  // Première passe : "ensemencer" quelques points de départ
  for (let i = 0; i < (width * height) / 20; i++) {
    // Ensemence 5% des tuiles
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    const initialTerrain =
      terrains[Math.floor(Math.random() * terrains.length)];
    const tileIndex = y * width + x;
    grid[tileIndex].terrain = initialTerrain;
  }

  // Deuxième passe (ou plusieurs passes) : propagation
  for (let i = 0; i < 5; i++) {
    // Faites 5 passes de propagation pour lisser
    const newGrid = [...grid]; // Créez une copie pour éviter les effets de bord immédiats
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const currentIndex = y * width + x;
        const currentTile = grid[currentIndex];

        // Compter les terrains des voisins
        const neighborTerrains: { [key in TerrainType]?: number } = {};
        const neighbors = [
          getTile(x - 1, y),
          getTile(x + 1, y),
          getTile(x, y - 1),
          getTile(x, y + 1),
          // getTile(x - 1, y - 1), getTile(x + 1, y - 1), // Diagonales si désiré
          // getTile(x - 1, y + 1), getTile(x + 1, y + 1),
        ];

        neighbors.forEach((n) => {
          if (n) {
            neighborTerrains[n.terrain] =
              (neighborTerrains[n.terrain] || 0) + 1;
          }
        });

        let mostCommonTerrain: TerrainType | undefined = undefined;
        let maxCount = -1;

        for (const terrain of Object.keys(neighborTerrains) as TerrainType[]) {
          if (neighborTerrains[terrain]! > maxCount) {
            maxCount = neighborTerrains[terrain]!;
            mostCommonTerrain = terrain;
          }
        }

        // Décision du nouveau terrain : forte probabilité du terrain majoritaire des voisins
        if (mostCommonTerrain && Math.random() < 0.8) {
          // 80% de chance de prendre le terrain majoritaire
          newGrid[currentIndex].terrain = mostCommonTerrain;
        } else {
          // Sinon, un terrain aléatoire (pour introduire de la diversité)
          newGrid[currentIndex].terrain =
            terrains[Math.floor(Math.random() * terrains.length)];
        }
      }
    }
    grid.splice(0, grid.length, ...newGrid); // Mettre à jour la grille principale
  }

  return grid;
}

export function generateMapWithPerlin(
  width: number,
  height: number,
  scale: number = 0.1
): MapTile[] {
  const noise2D = createNoise2D(Math.random);
  const grid: MapTile[] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Obtenez une valeur de bruit entre -1 et 1 (typiquement)
      const noiseValue = noise2D(x * scale, y * scale);

      // Normaliser la valeur entre 0 et 1 si nécessaire (certaines implémentations retournent 0-1 directement)
      const normalizedNoise = (noiseValue + 1) / 2; // Si noise2D retourne [-1, 1]

      const waterThreshold = 0.15;
      const grassThreshold = 0.6;
      const forestThreshold = 0.8;
      const moutainThreshold = 0.95;

      let terrain: TerrainType;

      if (normalizedNoise < waterThreshold) {
        terrain = "water";
      } else if (normalizedNoise < grassThreshold) {
        terrain = "grass";
      } else if (normalizedNoise < forestThreshold) {
        terrain = "forest";
      } else if (normalizedNoise < moutainThreshold) {
        terrain = "mountain";
      } else {
        terrain = "desert";
      }

      grid.push({
        x,
        y,
        building: "none",
        terrain,
      });
    }
  }

  return grid;
}
