import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { AppProvider } from "./src/context/AppContext";
import { useApp } from "./src/context/AppContext";
import { AppNavigator } from "./src/routes/AppNavigator";

function corEscura(hex: string) {
  const limpa = hex.replace("#", "");
  const valor = limpa.length === 3
    ? limpa.split("").map((parte) => parte + parte).join("")
    : limpa;
  const numero = Number.parseInt(valor, 16);
  const r = (numero >> 16) & 255;
  const g = (numero >> 8) & 255;
  const b = numero & 255;
  const brilho = (r * 299 + g * 587 + b * 114) / 1000;

  return brilho < 140;
}

function AppContent() {
  const { colors } = useApp();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background);
  }, [colors.background]);

  return (
    <>
      <StatusBar
        backgroundColor={colors.background}
        style={corEscura(colors.background) ? "light" : "dark"}
      />
      <AppNavigator />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
