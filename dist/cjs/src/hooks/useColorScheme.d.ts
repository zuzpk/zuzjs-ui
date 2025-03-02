import { ReactNode } from "react";
import { ColorTheme } from "../types/enums";
export type ColorScheme = `light` | `dark` | `system`;
export type ThemeContextProps = {
    colorScheme: ColorScheme;
    resolvedScheme: `light` | `dark`;
    setColorScheme: (theme: ColorScheme) => void;
};
export interface ThemeProviderProps {
    children: ReactNode;
    forceTheme?: ColorTheme;
    storageKey?: string;
}
export declare const useColorScheme: () => ThemeContextProps;
export declare const ThemeProvider: ({ children, storageKey, forceTheme }: ThemeProviderProps) => import("react/jsx-runtime").JSX.Element;
