import { TimelineLayer, TimelineOptions, UseTimelineReturn } from "@zuzjs/hooks";
import { ReactNode } from "react";

/** Engine config only — no `layers` (those are declared on child elements via the `timeline` prop). */
export type TimelineConfig = Omit<TimelineOptions, "layers">;

/**
 * Props for the `TimelineProvider` context wrapper.
 *
 * @example
 * ```tsx
 * // Wrap at page/section level — engine config only, no layers here
 * <TimelineProvider timeline={{ mode: "scroll", interpolate: true, lerpFactor: 0.08 }}>
 *   <Box timeline={{ id: "hero", entry: { y: [80, 0, "$spring"] } }}>
 *     Hero content
 *   </Box>
 *   <Box timeline={{ id: "tagline", entry: { delay: 0.25, y: [60, 0, "$spring"] } }}>
 *     Tagline
 *   </Box>
 * </TimelineProvider>
 *
 * // Or consume effects manually in a child:
 * function HeroSection() {
 *   const tl = useTimelineContext<"hero" | "tagline">()!;
 *   return <div style={tl.effects.hero}>…</div>;
 * }
 * ```
 */
export interface TimelineProviderProps {
    /** Engine config (mode, interpolate, lerpFactor, etc.) — layers are registered by children */
    timeline: TimelineConfig;
    children?: ReactNode;
    className?: string;
}

/** Full context value: all of UseTimelineReturn plus layer registration helpers */
export interface TimelineContextValue extends UseTimelineReturn<string> {
    registerLayer: (layer: TimelineLayer) => void;
    unregisterLayer: (id: string) => void;
}
