import { useCityStore } from "../../stores/useCityStore";

export const ProductionQueueHUD = () => {
  const productionQueue = useCityStore((s) => s.productionQueue);

  return (
    <div style={{ background: "#eee", padding: 10, marginTop: 10 }}>
      <h4>🔄 Productions en cours :</h4>
      {productionQueue.length === 0 && <div>Aucune production active</div>}
      {productionQueue.map((task, i) => (
        <div key={i} style={{ marginBottom: 5 }}>
          ⛏️ {task.type} en ({task.x}, {task.y}) – Temps restant :{" "}
          {(task.timeLeft / 1000).toFixed(1)}s
        </div>
      ))}
    </div>
  );
};
