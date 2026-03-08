import { useThemeStore } from "@/stores/useThemeStore";
import React, { createContext, FC, useContext } from "react";
import { useShallow } from "zustand/shallow";

type ThemeContextValue = {
  theme: string;
  switchTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const ThemeContextProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // GOOD
  const { theme, switchTheme } = useThemeStore(
    useShallow((state) => ({
      theme: state.theme,
      switchTheme: state.switchTheme,
    })),
  );
  return (
    <ThemeContext.Provider value={{ theme, switchTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useThemeContext must be used within ThemeContextProvider");
  }

  return context;
};

export default ThemeContextProvider;
