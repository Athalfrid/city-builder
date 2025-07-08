import { useCityStore } from "../../stores/useCityStore";

export const HUD = () => {
  const { resources, population } = useCityStore();

  return (
    <div style={{ display: "flex",  marginBottom: 10 }}>
      <div>
        <h3>Ressources :</h3>
        <div>💰 Or : {resources.gold}</div>
        <div>🌲 Bois : {resources.wood}</div>
        <div>🍖 Nourriture : {resources.food}</div>
        <div>🧱 Pierre : {resources.stone}</div>
      </div>
      <div>
        <h3>Population : {population.totalPopulation}</h3>
        <div>Employés : {population.employedPopulation}</div>
        <div>Sans emploi : {population.unemployedPopulation}</div>
      </div>
    </div>
  );
};
