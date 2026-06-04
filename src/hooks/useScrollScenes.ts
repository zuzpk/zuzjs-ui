import React from "react";
import type { TimelineLayer } from "@zuzjs/hooks";
import { buildScrollScenesModel, ScrollScenesConfig } from "../funs/scroll-scenes";

export interface UseScrollScenesReturn {
    scopeClass: string;
    panel: Record<string, string>;
    track: Record<string, string>;
    supportsScrollTimeline: boolean;
    className: (sceneName: string) => string;
    timeline: (name: string) => TimelineLayer | undefined;
    cssText: string;
}

const ensureStyleTag = (id: string, cssText: string) => {
    if (typeof document === "undefined") return;

    const styleId = `zuz-scroll-scenes-${id}`;
    const existing = document.getElementById(styleId) as HTMLStyleElement | null;

    if (existing) {
        if (existing.textContent !== cssText) {
            existing.textContent = cssText;
        }
        return;
    }

    const style = document.createElement("style");
    style.id = styleId;
    style.type = "text/css";
    style.textContent = cssText;
    document.head.appendChild(style);
};

const appendTimelineName = (container: HTMLElement, timelineName: string) => {
    const currentNames = (container.style.getPropertyValue("scroll-timeline-name") || "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);

    if (!currentNames.includes(timelineName)) {
        currentNames.push(timelineName);
        container.style.setProperty("scroll-timeline-name", currentNames.join(", "));
    }

    if (!container.style.getPropertyValue("scroll-timeline-axis")) {
        container.style.setProperty("scroll-timeline-axis", "block");
    }
};

const bindTimelineToScrollContainer = (
    scopeClass: string,
    timelineName: string,
    scrollContainerSelector?: string
) => {
    if (typeof document === "undefined") return;

    const scopes = Array.from(document.querySelectorAll(`.${scopeClass}`)) as HTMLElement[];

    scopes.forEach((scopeEl) => {
        let container: HTMLElement | null = null;

        if (scrollContainerSelector) {
            const root = scopeEl.getRootNode() as Document | ShadowRoot;
            const scoped = root.querySelector(scrollContainerSelector);
            container = (scoped as HTMLElement | null) || null;
        }

        if (!container) {
            container = scopeEl.closest(".--scroll-content") as HTMLElement | null;
        }

        if (!container) {
            container = document.scrollingElement as HTMLElement | null;
        }

        if (!container) return;
        appendTimelineName(container, timelineName);
    });
};

const useScrollScenes = (config: ScrollScenesConfig): UseScrollScenesReturn => {
    const serialized = React.useMemo(() => JSON.stringify(config), [config]);

    if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const configRef = React.useRef(config);
        if (configRef.current !== config) {
            console.warn(
                '[zuz] useScrollScenes: config object is not stable. ' +
                'Define it outside the component or wrap in useMemo() ' +
                'to avoid re-generating CSS keyframes on every render.'
            );
            configRef.current = config;
        }
    }

    const model = React.useMemo(() => buildScrollScenesModel(config), [serialized]);

    const [supportsScrollTimeline, setSupportsScrollTimeline] = React.useState(false);

    React.useEffect(() => {
        if (typeof CSS === "undefined" || typeof CSS.supports !== "function") {
            setSupportsScrollTimeline(false);
            return;
        }

        try {
            setSupportsScrollTimeline(CSS.supports("animation-timeline: scroll()"));
        } catch {
            setSupportsScrollTimeline(false);
        }
    }, []);

    React.useEffect(() => {
        if (!supportsScrollTimeline) return;
        ensureStyleTag(model.id, model.cssText);
        bindTimelineToScrollContainer(model.scopeClass, model.timelineName, model.scrollContainerSelector);
    }, [
        model.id,
        model.cssText,
        model.scopeClass,
        model.timelineName,
        model.scrollContainerSelector,
        supportsScrollTimeline
    ]);

    return React.useMemo(() => ({
        scopeClass: model.scopeClass,
        panel: model.panelClasses,
        track: model.trackClasses,
        supportsScrollTimeline,
        className: (sceneName: string) => {
            if (model.entryNames[sceneName]) return "";
            return model.allClasses[sceneName] || "";
        },
        timeline: (name: string) => {
            if (model.entryNames[name]) return model.fallbackLayers[name];
            if (!supportsScrollTimeline) return model.fallbackLayers[name];
            return undefined;
        },
        cssText: model.cssText
    }), [model, supportsScrollTimeline]);
};

export default useScrollScenes;
