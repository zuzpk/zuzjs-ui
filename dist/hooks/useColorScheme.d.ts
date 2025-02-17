import { ReactNode } from "react";
export type ColorScheme = `light` | `dark` | `system`;
export type ThemeContextProps = {
    colorScheme: ColorScheme;
    resolvedScheme: `light` | `dark`;
    setColorScheme: (theme: ColorScheme) => void;
};
export interface ThemeProviderProps {
    children: ReactNode;
    storageKey?: string;
}
export declare const useColorScheme: () => ThemeContextProps;
export declare const ThemeProvider: ({ children, storageKey }: ThemeProviderProps) => import("react/jsx-runtime").JSX.Element;
