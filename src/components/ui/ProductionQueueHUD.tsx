import { useState } from "react";
import { useCityStore } from "../../stores/useCityStore";

export const ProductionQueueHUD = () => {
  const productionQueue = useCityStore((s) => s.productionQueue);
  const removeProductionTask = useCityStore((s) => s.removeProductionQueue);

  const [expandedBuildings, setExpandedBuildings] = useState<
    Record<string, boolean>
  >({});

  // Grouper par type
  const grouped = productionQueue.reduce<
    Record<string, typeof productionQueue>
  >((acc, task) => {
    if (!acc[task.type]) acc[task.type] = [];
    acc[task.type].push(task);
    return acc;
  }, {});

  const toggleExpanded = (type: string) => {
    setExpandedBuildings((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <div
      style={{
        background: "#eee",
        padding: 10,
        marginTop: 10,
        maxHeight: 300,
        overflowY: "auto",
      }}
    >
      <h4>🔄 Productions en cours :</h4>
      {productionQueue.length === 0 && <div>Aucune production active</div>}
      {Object.entries(grouped).map(([type, tasks]) => (
        <div key={type} style={{ marginBottom: 10 }}>
          <div
            style={{
              fontWeight: "bold",
              cursor: "pointer",
              userSelect: "none",
              backgroundColor: "#ddd",
              padding: "5px 10px",
              borderRadius: 4,
            }}
            onClick={() => toggleExpanded(type)}
          >
            🏭 {type} – {tasks.length} en cours{" "}
            {expandedBuildings[type] ? "▼" : "▶"}
          </div>
          {expandedBuildings[type] && (
            <ul style={{ marginTop: 5, marginLeft: 15 }}>
              {tasks.map((task, i) => (
                <li
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  ({task.x}, {task.y}) – {(task.timeLeft / 1000).toFixed(1)}s
                  {/* Bouton supprimer */}
                  <button
                    style={{ marginLeft: "auto", cursor: "pointer" }}
                    onClick={() => removeProductionTask(task)}
                    title="Supprimer cette production"
                  >
                    🗑️
                  </button>
                  {/* Bouton pause (à implémenter plus tard) */}
                  <button
                    style={{ cursor: "pointer" }}
                    onClick={() => alert("Pause non implémentée")}
                    title="Mettre en pause"
                  >
                    ⏸️
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};
