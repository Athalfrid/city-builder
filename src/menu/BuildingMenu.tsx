import { useCityStore } from "../stores/useCityStore";
import {
  buildingCosts,
  buildingList,
  buildingPopulation,
  BuildingType,
} from "../types/building";

export const BuildingMenu = () => {
  const { selectedBuilding, setSelectedBuilding, setToolMode, toolMode } =
    useCityStore();
  const hasTownhall = useCityStore((state) =>
    state.grid.some((tile) => tile.building === "townhall")
  );
  const formatCost = (building: BuildingType): string => {
    const cost = buildingCosts[building];
    const parts: string[] = [];

    if (cost.wood) parts.push(`Bois : ${cost.wood}`);
    if (cost.gold) parts.push(`Or : ${cost.gold}`);
    if (cost.food) parts.push(`Nourriture : ${cost.food}`);

    parts.push(`Ouvriers : ${buildingPopulation[building].workforce}`);

    return parts.length ? parts.join(" | ") : "Gratuit";
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        marginBottom: 20,
        padding: 25,
        backgroundColor: "lightblue",
      }}
    >
      <h3>Menu de construction</h3>
      <div style={{ marginBottom: 10 }}>
        <button
          onClick={() => setToolMode("recolter")}
          disabled={toolMode === "recolter"}
          style={{
            opacity: toolMode === "recolter" ? 0.5 : 1,
            cursor: toolMode === "recolter" ? "not-allowed" : "pointer",
            marginRight: 10,
          }}
        >
          🪓 Supprimer ressources
        </button>

        <button
          onClick={() => setToolMode("build")}
          disabled={toolMode === "build"}
          style={{
            opacity: toolMode === "build" ? 0.5 : 1,
            cursor: toolMode === "build" ? "not-allowed" : "pointer",
          }}
        >
          🏗️ Construction
        </button>
      </div>

      {buildingList.map(({ type, label, emoji }) => (
        <button
          key={type}
          onClick={() => setSelectedBuilding(type)}
          disabled={toolMode === "recolter"}
          style={{
            padding: "8px 12px",
            cursor:
              type === "townhall" && hasTownhall ? "not-allowed" : "pointer",
            backgroundColor:
              type === "townhall" && hasTownhall
                ? "#ccc"
                : selectedBuilding === type
                ? "#4caf50"
                : "#eee",
            border: "none",
            borderRadius: 4,
            fontWeight: selectedBuilding === type ? "bold" : "normal",
            opacity: type === "townhall" && hasTownhall ? 0.5 : 1,
          }}
        >
          {emoji} {label} <br /> Coût : <i>{formatCost(type)}</i>
        </button>
      ))}
    </div>
  );
};
