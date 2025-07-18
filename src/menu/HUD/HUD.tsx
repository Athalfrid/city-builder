import { useCityStore } from "../../stores/useCityStore";
import { Box, Typography,  Stack, Chip } from "@mui/material";

const resourceKeys = ["gold", "wood", "food", "stone", "water"] as const;
type ResourceKey = typeof resourceKeys[number];

export const HUD = () => {
  const resources = useCityStore((state) => state.resources);
  const population = useCityStore((state) => state.population);
  const production = useCityStore((state) => state.production);
  const consumption = useCityStore((state) => state.consumption);

return (
  <Box
    sx={{
      display: "flex",
      gap: 3,
      p: 2,
      bgcolor: "#f0f4f8",
      borderRadius: 2,
      boxShadow: 3,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: "#333",
      userSelect: "none",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "flex-start",
    }}
  >
    {/* Ressources */}
    {resourceKeys.map((key) => {
      const prod = production?.[key] ?? 0;
      const cons = consumption?.[key] ?? 0;
      const balance = prod - cons;

      return (
        <Box
          key={key}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.7,
            bgcolor: "background.paper",
            p: "6px 12px",
            borderRadius: 3,
            boxShadow: 1,
            fontWeight: 600,
            fontSize: 14,
            whiteSpace: "nowrap",
          }}
        >
          <span>{getEmoji(key)}</span>
          <Typography component="span" sx={{ minWidth: 70 }}>
            {capitalize(key)}:
          </Typography>
          <Typography component="span">{resources[key]}</Typography>

          <Chip
            label={`${balance > 0 ? "+" : ""}${balance}/s`}
            color={balance > 0 ? "success" : balance < 0 ? "error" : "default"}
            size="small"
            sx={{ fontWeight: "bold", minWidth: 50, ml: 1 }}
          />
        </Box>
      );
    })}


    {/* Population */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        fontWeight: 600,
        fontSize: 14,
        whiteSpace: "nowrap",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
        <span>👥</span>
        <Typography component="span">Total:</Typography>
        <Typography component="span">{population.totalPopulation}</Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
        <span>👷</span>
        <Typography component="span">Employés:</Typography>
        <Typography component="span">{population.employedPopulation}</Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
        <span>🧍</span>
        <Typography component="span">Sans emploi:</Typography>
        <Typography component="span">{population.unemployedPopulation}</Typography>
      </Box>
    </Box>
  </Box>
);

};

// Petites fonctions utilitaires
const getEmoji = (key: string) => {
  switch (key) {
    case "gold":
      return "💰";
    case "wood":
      return "🌲";
    case "food":
      return "🍖";
    case "stone":
      return "🧱";
    case "water":
      return "💧";
    default:
      return "📦";
  }
};

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
