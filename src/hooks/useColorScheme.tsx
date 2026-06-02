"use client"
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { DialogProps } from "../comps/Dialog/types";
import { DrawerProps } from "../comps/Drawer/types";
import { GroupProps } from "../comps/Group";
import LayersProvider from "../comps/Layers";
import { SpinnerProps } from "../comps/Spinner/types";
import { ToastPosition, ToastStyle, ToastType } from "../comps/Toast/types";
import { ToolTipTransition } from "../comps/Tooltip/types";
import { setZuzMap } from "../funs/css";
import { animationProps } from "../types";
import { COLORTHEME, TRANSITION_CURVES, TRANSITIONS, Variant } from "../types/enums";
import { ValueOf } from "../types/shared";

const MATCH_MEDIA = `(prefers-color-scheme: dark)`
const SSR = typeof window === 'undefined'

const getResolvedScheme = (): `light` | `dark` => {
    if (SSR) return `light`
    return window.matchMedia(MATCH_MEDIA).matches ? `dark` : `light`
}

const DEFAULT_THEME_CONTEXT: ThemeContextProps = {
    colorScheme: `system`,
    resolvedScheme: getResolvedScheme(),
    setColorScheme: () => {}
}

type ColorScheme = ValueOf<typeof COLORTHEME>
// type _Variant = ValueOf<typeof Variant>
export interface ThemeConfig {
    /**
     * Auto generated zuzMap.ts
     */
    zuzMap?: Record<string, string>,
    variant?: ValueOf<typeof Variant>,
    group?: GroupProps & {
        fx?: animationProps
    },
    /**
     * Dialog Default Settings
     */
    dialog?: Omit<DialogProps, `id` | `title` | `message` | `action` | `onShow` | `onHide`>,
    /**
     * Dialog Default Settings
     */
    drawer?: Omit<DrawerProps, `as` | `children` | `onClose`>,
    /**
     * App Level Spinner Conf
     */
    spinner?: SpinnerProps,

    /** Toast Default Settings */
    toast?: {
        variant?: ValueOf<typeof Variant>,
        position?: ToastPosition,
        style?: ToastStyle,
        transition?: ValueOf<typeof TRANSITIONS>,
        curve?: ValueOf<typeof TRANSITION_CURVES>,
        type?: ToastType,
        duration?: number,
        progress?: boolean
    },

    /** Tooltip Default Settings */
    tooltip?: {
        variant?: ValueOf<typeof Variant>,
        transition?: ToolTipTransition,
        curve?: ValueOf<typeof TRANSITION_CURVES>,
    },

    /** Enable squircle shapes across app */
    squircle?: boolean
}

export type ThemeContextProps = {
    colorScheme: ColorScheme,
    resolvedScheme: `light` | `dark`,
    setColorScheme: (theme: ColorScheme) => void
} & ThemeConfig

export type ThemeProviderProps = {
    children: ReactNode,
    forceTheme?: ColorScheme,
    storageKey?: string
} & ThemeConfig

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const useColorScheme = (ignoreContext?: boolean) : ThemeContextProps | undefined => {

    const context = useContext(ThemeContext)

    if (!context) {
        if ( ignoreContext === true ) return DEFAULT_THEME_CONTEXT
        throw new Error('useColorScheme must be used within a ThemeProvider');
    }

    return context;

}

export const useTheme = useColorScheme

export const ThemeProvider = ({ 
    children, 
    storageKey = `--ucs`,
    forceTheme,
    zuzMap,
    ...conf
} : ThemeProviderProps) => {

    if ( zuzMap ) setZuzMap(zuzMap)
        
    return <Theme 
        storageKey={storageKey} 
        forceTheme={forceTheme}
        {...conf}>{children}</Theme>
    
}

const Theme = ({ children, storageKey, forceTheme, ...config } : ThemeProviderProps) => {

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

    useEffect(() => {
        if ( config.squircle ) {

            const style = document.body.style
            const supportsNative = CSS.supports('corner-shape', 'squircle');

            if (supportsNative) {
                style.setProperty('--corner-shape', 'squircle');
                style.setProperty('--radius-xs', '60px');
                style.setProperty('--radius-sm', '60px');
                style.setProperty('--radius-md', '60px');
                style.setProperty('--radius-lg', '60px');
                style.setProperty('--radius-xl', '70px');
                style.setProperty('--radius-xxl', '90px');
            }
            // else {
            //     /** 
            //      * SVG Mask Fallback (Firefox/Safari)
            //      * Uses a path that approximates a squircle. 
            //      * The viewbox is 1x1 to work with mask-size: 100% 
            //      */
            //     const svgSquircle = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1' preserveAspectRatio='none'%3E%3Cpath d='M 0,0.5 C 0,0 0,0 0.5,0 S 1,0 1,0.5 1,1 0.5,1 0,1 0,0.5' fill='white'/%3E%3C/svg%3E";
            //     style.setProperty('--squircle-mask', `url("${svgSquircle}")`);
            //     // In the fallback, we usually use the SVG mask instead of radius values
            // }

            // Inject the global "apply to all" rule
            const styleTag = document.createElement('style');
            styleTag.id = '--squircle-global-styles';

            styleTag.innerHTML = `
                *:not(.--round) {
                    ${supportsNative 
                        ? 'corner-shape: var(--corner-shape);' 
                        : 'mask-image: var(--squircle-mask); mask-size: 100% 100%; -webkit-mask-image: var(--squircle-mask); -webkit-mask-size: 100% 100%;'
                    }
                }
            `;
            
            document.head.appendChild(styleTag);

            // Cleanup function to remove the style tag if config.squircle is disabled
            return () => {
                const existingTag = document.getElementById('--squircle-global-styles');
                if (existingTag) existingTag.remove();
            };

        }
    }, [config.squircle])

    return (
        <ThemeContext value={{ 
            colorScheme: colorScheme as ColorScheme, 
            resolvedScheme: resolvedTheme! as "dark" | "light", 
            setColorScheme: switchColorScheme,
            ...config
        }}>
            { forceTheme ? null : <script 
                suppressHydrationWarning
                dangerouslySetInnerHTML={{ 
                    __html: `const el = document.documentElement
                    const themes = ['light', 'dark']
                    let theme = localStorage.getItem(\`${storageKey}\`) || "system";
                    if (theme === "system") {
                        theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
                    }
                    document.documentElement.setAttribute("color-scheme", theme);
                    document.documentElement.style.colorScheme = theme;`
                }}
            /> }
            <LayersProvider>
                {children}
            </LayersProvider>
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