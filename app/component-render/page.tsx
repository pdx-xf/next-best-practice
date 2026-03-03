"use client";

import { useThemeStore } from "@/stores/useThemeStore";
import { useUserStore } from "@/stores/useUserStore";
import { useShallow } from "zustand/shallow";
import Child from "./_conmponents/Child";
import ThemeContextProvider from "./_context/ThemeContext";

export default function ComponentRenderBestPractice() {
  // GOOD
  const { name, setName } = useUserStore(
    useShallow((state) => ({ name: state.name, setName: state.setName })),
  );
  // GOOD
  const { theme, switchTheme } = useThemeStore(
    useShallow((state) => ({
      theme: state.theme,
      switchTheme: state.switchTheme,
    })),
  );

  return (
    <ThemeContextProvider>
      <div onClick={setName}>{name}</div>
      <Child />
      <div onClick={switchTheme}>{theme}</div>
    </ThemeContextProvider>
  );
}
