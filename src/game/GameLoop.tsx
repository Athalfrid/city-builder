import { useEffect } from "react";
import { useCityStore } from "../stores/useCityStore";

export const GameLoop = () => {
  const refreshProductionQueue = useCityStore((s) => s.refreshProductionQueue);

  useEffect(() => {
    refreshProductionQueue(); // ✅ une seule fois au lancement

    const interval = setInterval(() => {
      useCityStore.getState().tickProduction(1000); // ✅ production seulement
    }, 1000);

    return () => clearInterval(interval);
  }); 

  return null;
};
