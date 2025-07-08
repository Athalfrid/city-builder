import { useEffect } from "react";
import { useCityStore } from "../stores/useCityStore"

export const GameLoop = () => {
    const tickProduction = useCityStore((s) => s.tickProduction);
    const refreshProductionQueue = useCityStore((s) => s.refreshProductionQueue);

    useEffect(()=>{
        refreshProductionQueue();
        const interval = setInterval(()=>{
            tickProduction(1000)
        },1000);

        return () => clearInterval(interval);
    },[refreshProductionQueue,tickProduction])

    return null;
}