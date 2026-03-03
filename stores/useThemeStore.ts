import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useThemeStore = create<{
  theme: string;
  switchTheme: () => void;
}>()(
  devtools(
    (set) => ({
      theme: "黑",
      switchTheme: () => {
        set(
          (state) => {
            if (state.theme == "黑") {
              return { ...state, theme: "白" };
            } else {
              return { ...state, theme: "黑" };
            }
          },
          undefined,
          "theme/switchTheme",
        );
      },
    }),
    { name: "themeStore" },
  ),
);
