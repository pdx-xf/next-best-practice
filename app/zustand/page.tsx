"use client";

import { useThemeStore } from "@/stores/useThemeStore";
import { useUserStore } from "@/stores/useUserStore";
import { useShallow } from "zustand/shallow";
import Child from "./_conmponents/Child";

export default function ZustandBestPractice() {
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
    <div>
      <div onClick={setName}>{name}</div>
      <Child />
      <div onClick={switchTheme}>{theme}</div>
    </div>
  );
}
