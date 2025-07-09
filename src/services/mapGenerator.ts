import { createNoise2D } from "simplex-noise";

import { MapTile,TerrainType } from "../types/map";

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
