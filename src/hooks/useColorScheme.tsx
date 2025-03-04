"use client"
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { ColorTheme } from "../types/enums";

const MATCH_MEDIA = `(prefers-color-scheme: dark)`
const SSR = typeof window === 'undefined'
export type ColorScheme = `light` | `dark` | `system`
export type ThemeContextProps = {
    colorScheme: ColorScheme,
    resolvedScheme: `light` | `dark`,
    setColorScheme: (theme: ColorScheme) => void
}
export interface ThemeProviderProps {
    children: ReactNode,
    forceTheme?: ColorTheme,
    storageKey?: string
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const useColorScheme = () => {

    const context = useContext(ThemeContext)

    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;

}

export const ThemeProvider = ({ 
    children, 
    storageKey = `--ucs`,
    forceTheme
} : ThemeProviderProps) => {

    return <Theme storageKey={storageKey} forceTheme={forceTheme}>{children}</Theme>
    
}

const Theme = ({ children, storageKey, forceTheme } : ThemeProviderProps) => {

    const [colorScheme, setThemeState] = useState(() => forceTheme || getTheme(storageKey!, `system`))
    const [resolvedTheme, setResolvedTheme] = useState(() => forceTheme || getTheme(storageKey!));
    // const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark' | undefined>(() => {
    //     if ( SSR ) return undefined
    //     return colorScheme === 'system' ? window?.matchMedia(MATCH_MEDIA).matches ? 'dark' : 'light' : colorScheme
    // });

    const getCurrentScheme = (e?: MediaQueryList | MediaQueryListEvent) => {
        if (!e) e = window.matchMedia(MATCH_MEDIA)
        return e.matches ? `dark` : `light`
    }

    const applyColorScheme = useCallback((theme: ColorScheme) => {
        
        let last = theme == `system` ? getCurrentScheme() : theme
        const d = document.documentElement
        
        d.setAttribute(`color-scheme`, last)
        d.style.colorScheme = last

        setResolvedTheme(last)

    }, [getCurrentScheme])

    const switchColorScheme = useCallback((theme: ColorScheme) => {
        setThemeState(theme);
        localStorage.setItem(storageKey!, theme);
        applyColorScheme(theme)
    }, [colorScheme])

    const withMediaQuery = useCallback((e: MediaQueryListEvent | MediaQueryList) => {
        const resolved = getCurrentScheme(e)
        setResolvedTheme(resolved)
    
          if (colorScheme === 'system') {
            applyColorScheme('system')
          }
        },
        [colorScheme]
    )

    useEffect(() => {
        if ( colorScheme == undefined )
            window.localStorage.getItem(storageKey!) as ColorScheme || `system`
    }, [colorScheme])

    useEffect(() => {
        const media = window.matchMedia(MATCH_MEDIA)
        media.addEventListener(`change`, withMediaQuery)
        // withMediaQuery(media)
    }, [withMediaQuery])


    useEffect(() => {

        const handleStorage = (e: StorageEvent) => {
            if ( e.key != storageKey ){
                return
            }
            if ( !e.newValue ){
                switchColorScheme(`system`)
            }
            else
                switchColorScheme(e.newValue as ColorScheme)
        }

        window.addEventListener(`storage`, handleStorage)

        return () => window.removeEventListener(`storage`, handleStorage)

    }, [switchColorScheme])


    useEffect(() => {
        applyColorScheme((forceTheme || colorScheme || `system`) as ColorScheme)
    }, [colorScheme])

    return (
        <ThemeContext value={{ colorScheme: colorScheme as ColorScheme, resolvedScheme: resolvedTheme! as "dark" | "light", setColorScheme: switchColorScheme }}>
            <script 
                suppressHydrationWarning
                dangerouslySetInnerHTML={{ 
                    __html: forceTheme ? `` : `const el = document.documentElement
                    const themes = ['light', 'dark']
                    let theme = localStorage.getItem(\`${storageKey}\`) || "system";
                    if (theme === "system") {
                        theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
                    }
                    document.documentElement.setAttribute("color-scheme", theme);
                    document.documentElement.style.colorScheme = theme;`
                }}
            />
            {children}
        </ThemeContext>
    );
    
}

const getTheme = (key: string, fallback?: string) => {
    if (SSR) return undefined
    let theme
    try {
      theme = localStorage.getItem(key) || undefined
    } catch (e) {
      // Unsupported
    }
    return theme || fallback
}