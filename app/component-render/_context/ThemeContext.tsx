import { useThemeStore } from "@/stores/useThemeStore";
import React, { createContext, FC, useContext } from "react";
import { useShallow } from "zustand/shallow";

type ThemeContextType = {
  theme: string;
  switchTheme: () => void;
} | null;

const ThemeContext = createContext<ThemeContextType>(null);

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
  return useContext(ThemeContext);
};

export default ThemeContextProvider;
