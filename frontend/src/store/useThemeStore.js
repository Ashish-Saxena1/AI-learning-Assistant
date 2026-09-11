import { create } from "zustand";

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("pageTheme") || "coffee",
    setTheme: (theme) => {
        localStorage.setItem("pageTheme", theme);
        set({ theme });
    },
}));