import React from "react";
import logo from "./logo.svg";
import { CityGrid } from "./grid/CityGrid";
import "./App.css";
import { BuildingMenu } from "./menu/BuildingMenu";
import { HUD } from "./menu/HUD/HUD";
import { GameLoop } from "./game/GameLoop";
import { ProductionQueueHUD } from "./components/ui/ProductionQueueHUD";

function App() {
  return (
    <div className="App">
      <GameLoop />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          margin: 0,
          background: "#222",
        }}
      >
        <h1>City Builder React TS</h1>
        <div style={{ display: "flex" }}>
          <CityGrid />
          <div
            style={{
              margin: 20,
            }}
          >
            <HUD />
            <BuildingMenu />
            <ProductionQueueHUD />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
