"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
const MATCH_MEDIA = `(prefers-color-scheme: dark)`;
const SSR = typeof window === 'undefined';
const ThemeContext = createContext(undefined);
export const useColorScheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
export const ThemeProvider = ({ children, storageKey = `--ucs` }) => {
    return _jsx(Theme, { storageKey: storageKey, children: children });
};
const Theme = ({ children, storageKey }) => {
    const [colorScheme, setThemeState] = useState(() => getTheme(storageKey, `system`));
    const [resolvedTheme, setResolvedTheme] = useState(() => getTheme(storageKey));
    // const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark' | undefined>(() => {
    //     if ( SSR ) return undefined
    //     return colorScheme === 'system' ? window?.matchMedia(MATCH_MEDIA).matches ? 'dark' : 'light' : colorScheme
    // });
    const getCurrentScheme = (e) => {
        if (!e)
            e = window.matchMedia(MATCH_MEDIA);
        return e.matches ? `dark` : `light`;
    };
    const applyColorScheme = useCallback((theme) => {
        let last = theme == `system` ? getCurrentScheme() : theme;
        const d = document.documentElement;
        d.setAttribute(`color-scheme`, last);
        d.style.colorScheme = last;
        setResolvedTheme(last);
    }, [getCurrentScheme]);
    const switchColorScheme = useCallback((theme) => {
        setThemeState(theme);
        localStorage.setItem(storageKey, theme);
        applyColorScheme(theme);
    }, [colorScheme]);
    const withMediaQuery = useCallback((e) => {
        const resolved = getCurrentScheme(e);
        setResolvedTheme(resolved);
        if (colorScheme === 'system') {
            applyColorScheme('system');
        }
    }, [colorScheme]);
    useEffect(() => {
        if (colorScheme == undefined)
            window.localStorage.getItem(storageKey) || `system`;
    }, [colorScheme]);
    useEffect(() => {
        const media = window.matchMedia(MATCH_MEDIA);
        media.addEventListener(`change`, withMediaQuery);
        // withMediaQuery(media)
    }, [withMediaQuery]);
    useEffect(() => {
        const handleStorage = (e) => {
            if (e.key != storageKey) {
                return;
            }
            if (!e.newValue) {
                switchColorScheme(`system`);
            }
            else
                switchColorScheme(e.newValue);
        };
        window.addEventListener(`storage`, handleStorage);
        return () => window.removeEventListener(`storage`, handleStorage);
    }, [switchColorScheme]);
    useEffect(() => {
        applyColorScheme((colorScheme || `system`));
    }, [colorScheme]);
    return (_jsxs(ThemeContext, { value: { colorScheme: colorScheme, resolvedScheme: resolvedTheme, setColorScheme: switchColorScheme }, children: [_jsx("script", { suppressHydrationWarning: true, dangerouslySetInnerHTML: {
                    __html: `const el = document.documentElement
                    const themes = ['light', 'dark']
                    let theme = localStorage.getItem(\`${storageKey}\`) || "system";
                    if (theme === "system") {
                        theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
                    }
                    document.documentElement.setAttribute("color-scheme", theme);
                    document.documentElement.style.colorScheme = theme;`
                } }), children] }));
};
const getTheme = (key, fallback) => {
    if (SSR)
        return undefined;
    let theme;
    try {
        theme = localStorage.getItem(key) || undefined;
    }
    catch (e) {
        // Unsupported
    }
    return theme || fallback;
};
