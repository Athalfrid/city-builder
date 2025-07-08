import { buildingCosts, buildingList } from "../constants/building";
import { BuildingType, useCityStore } from "../stores/useCityStore";

export const BuildingMenu = () => {
  const { selectedBuilding, setSelectedBuilding } = useCityStore();
  const hasTownhall = useCityStore((state) =>
    state.grid.some((tile) => tile.building === "townhall")
  );
  const formatCost = (building: BuildingType) :string => {
    const cost = buildingCosts[building];
    const parts: string[]= [];

    if(cost.wood) parts.push(`Bois : ${cost.wood}`);
    if(cost.gold) parts.push(`Or : ${cost.gold}`);
    if(cost.food) parts.push(`Nourriture : ${cost.food}`);

    return parts.length ? parts.join(" | ") : "Gratuit";
  }

  return (
    <div style={{ display: "flex",flexDirection:"column", gap: 10, marginBottom: 20 }}>
        <h3>Menu de construction</h3>
      {buildingList.map(({ type, label, emoji }) => (
        <button
          key={type}
          onClick={() => setSelectedBuilding(type)}
          style={{
            padding: "8px 12px",
            cursor:
              type === "townhall" && hasTownhall ? "not-allowed" : "pointer",
            backgroundColor:
              selectedBuilding === type
                ? "#4caf50"
                : type === "townhall" && hasTownhall
                ? "#ccc"
                : "#eee",
            border: "none",
            borderRadius: 4,
            fontWeight: selectedBuilding === type ? "bold" : "normal",
            opacity: type === "townhall" && hasTownhall ? 0.5 : 1,
          }}
        >
          {emoji} {label} <br/> Coût : {formatCost(type)}
        </button>
      ))}
    </div>
  );
};
