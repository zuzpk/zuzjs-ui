"use client"
import { TimelineLayer, useTimeline } from "@zuzjs/hooks";
import { Children, createContext, FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import { TimelineContextValue, TimelineProviderProps } from "./types";

const getLayerSignature = (layer: TimelineLayer) => JSON.stringify(layer);

const TimelineContext = createContext<TimelineContextValue | null>(null);

/**
 * Wrap a page or section. Engine config only — individual components declare their
 * own layers via the `timeline` prop, which `useBase` registers automatically.
 *
 * @example
 * ```tsx
 * <TimelineProvider timeline={{ mode: "scroll", interpolate: true, lerpFactor: 0.08 }}>
 *   <Box timeline={{ id: "hero", entry: { y: [80, 0, "$spring"] } }}>…</Box>
 *   <Box timeline={{ id: "card", entry: { delay: 0.25, y: [60, 0, "$spring"] } }}>…</Box>
 * </TimelineProvider>
 * ```
 */
const TimelineProvider: FC<TimelineProviderProps> = ({ timeline, children, className }) => {
    const [layers, setLayers] = useState<TimelineLayer[]>([]);
    const layerMapRef = useRef<Map<string, TimelineLayer>>(new Map());

    const registerLayer = useCallback((layer: TimelineLayer) => {
        const previousLayer = layerMapRef.current.get(layer.id);
        if (previousLayer && getLayerSignature(previousLayer) === getLayerSignature(layer)) {
            return;
        }

        layerMapRef.current.set(layer.id, layer);
        setLayers([...layerMapRef.current.values()]);
    }, []);

    const unregisterLayer = useCallback((id: string) => {
        if (!layerMapRef.current.has(id)) {
            return;
        }

        layerMapRef.current.delete(id);
        setLayers([...layerMapRef.current.values()]);
    }, []);

    const tlValue = useTimeline({ ...timeline, layers } as any);

    const value: TimelineContextValue = { ...tlValue, registerLayer, unregisterLayer };

    const isSingleChild = Children.count(children) === 1;
    const warnedMultiRootRef = useRef(false);
    const warnedSingleRootRef = useRef(false);

    useEffect(() => {
        if (process.env.NODE_ENV === "production") return;
        if (isSingleChild) return;
        if (warnedMultiRootRef.current) return;
        warnedMultiRootRef.current = true;

        console.warn(
            "[TimelineProvider] Multiple root children detected; wrapper fallback is used. " +
            "For precise scroll keyframes with custom scroll containers, set `timelineRoot` on the intended root element."
        );
    }, [isSingleChild]);

    useEffect(() => {
        if (process.env.NODE_ENV === "production") return;
        if (!isSingleChild) return;
        if (warnedSingleRootRef.current) return;
        warnedSingleRootRef.current = true;

        console.warn(
            "[TimelineProvider] Single root child detected. For scroll mode, set `timelineRoot` on the element you want to measure."
        );
    }, [isSingleChild]);

    const content = isSingleChild
        ? children
        : (
            <div
                ref={tlValue.containerRef as React.RefObject<HTMLDivElement>}
                className={className}
                style={{
                    width: "100%",
                    minHeight: "100%",
                }}>
                {children}
            </div>
        );

    return (
        <TimelineContext.Provider value={value}>
            {content}
        </TimelineContext.Provider>
    );
};

TimelineProvider.displayName = "Zuz.TimelineProvider";

/**
 * Consume the nearest `TimelineProvider` state. Returns `null` outside a provider.
 *
 * @example
 * ```tsx
 * const tl = useTimelineContext<"hero" | "card">()!;
 * <div style={tl.effects.hero}>…</div>
 * ```
 */
const useTimelineContext = <Id extends string = string>(): TimelineContextValue & { effects: Record<Id, Record<string, string | number>> } | null => {
    return useContext(TimelineContext) as any;
};

export { TimelineContext, TimelineProvider, useTimelineContext };
export type { TimelineContextValue, TimelineProviderProps };

