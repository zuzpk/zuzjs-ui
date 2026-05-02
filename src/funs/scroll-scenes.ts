import type { TimelineEntry, TimelineLayer, TimelineKeyframe } from "@zuzjs/hooks";

export interface ScrollSceneConfig {
    start: number;
    inEnd: number;
    outStart: number;
    end: number;
    fromY?: string;
    atY?: string;
    outY?: string;
    fromOpacity?: number;
    atOpacity?: number;
    outOpacity?: number;
    easing?: string;
    willChange?: string;
    entry?: ScrollEntryConfig;
}

interface ScrollEntryLegacyConfig {
    fromY?: string;
    toY?: string;
    fromOpacity?: number;
    toOpacity?: number;
    fromScale?: number;
    toScale?: number;
}

export interface ScrollEntryConfig extends Partial<TimelineEntry>, ScrollEntryLegacyConfig {
    duration?: number;
    delay?: number;
    easing?: string;
}

export interface ScrollTrackKeyframe {
    at: number;
    y?: string;
    opacity?: number;
    scale?: number;
}

export interface ScrollTrackConfig {
    keyframes: ScrollTrackKeyframe[];
    timeline?: string;
    easing?: string;
    willChange?: string;
    entry?: ScrollEntryConfig;
}

export interface ScrollScenesConfig {
    id: string;
    timeline?: string;
    scrollContainerSelector?: string;
    scenes: Record<string, ScrollSceneConfig>;
    tracks?: Record<string, ScrollTrackConfig>;
}

export interface ScrollScenesModel {
    id: string;
    scopeClass: string;
    timelineName: string;
    scrollContainerSelector?: string;
    entryNames: Record<string, boolean>;
    panelClasses: Record<string, string>;
    trackClasses: Record<string, string>;
    allClasses: Record<string, string>;
    fallbackLayers: Record<string, TimelineLayer>;
    cssText: string;
}

const DEFAULT_EASING = "cubic-bezier(0.2, -0.36, 0, 1.46)";
const DEFAULT_TIMELINE = "scroll()";

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

const percent = (value: number) => `${(clamp01(value) * 100).toFixed(4).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1")}%`;

const slugify = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

const toTimelineEasing = (value?: string) => {
    if (!value) return "$spring";
    if (value.startsWith("$")) return value;
    const match = value.match(/^var\(--([a-z0-9_-]+)\)$/i);
    if (match) return `$${match[1]}`;
    return value;
};

const toCssEasing = (value?: string) => {
    if (!value) return DEFAULT_EASING;
    if (value.startsWith("$")) return `var(--${value.slice(1)})`;
    return value;
};

type StringEntryTuple = [string, string, string?];
type NumberEntryTuple = [number, number, string?];

interface ResolvedEntrySpec {
    duration: number;
    delay: number;
    easing?: string;
    y?: StringEntryTuple;
    opacity?: NumberEntryTuple;
    scale?: NumberEntryTuple;
}

interface ResolveEntryDefaults {
    y?: [string, string];
    opacity?: [number, number];
    scale?: [number, number];
    easing?: string;
}

const isEffectTuple = (value: unknown): value is [unknown, unknown, unknown?] =>
    Array.isArray(value) && value.length >= 2;

const resolveStringTuple = (
    value: unknown,
    legacyFrom?: string,
    legacyTo?: string,
    fallback?: [string, string]
): StringEntryTuple | undefined => {
    if (isEffectTuple(value) && typeof value[0] === "string" && typeof value[1] === "string") {
        return [value[0], value[1], typeof value[2] === "string" ? value[2] : undefined];
    }

    const from = legacyFrom ?? fallback?.[0];
    const to = legacyTo ?? fallback?.[1];
    if (from === undefined || to === undefined) return undefined;
    return [from, to, undefined];
};

const resolveNumberTuple = (
    value: unknown,
    legacyFrom?: number,
    legacyTo?: number,
    fallback?: [number, number]
): NumberEntryTuple | undefined => {
    if (isEffectTuple(value) && typeof value[0] === "number" && typeof value[1] === "number") {
        return [value[0], value[1], typeof value[2] === "string" ? value[2] : undefined];
    }

    const from = legacyFrom ?? fallback?.[0];
    const to = legacyTo ?? fallback?.[1];
    if (from === undefined || to === undefined) return undefined;
    return [from, to, undefined];
};

const resolveEntrySpec = (entry?: ScrollEntryConfig, defaults?: ResolveEntryDefaults): ResolvedEntrySpec | undefined => {
    if (!entry) return undefined;

    const y = resolveStringTuple((entry as any).y, entry.fromY, entry.toY, defaults?.y);
    const opacity = resolveNumberTuple((entry as any).opacity, entry.fromOpacity, entry.toOpacity, defaults?.opacity);
    const scale = resolveNumberTuple((entry as any).scale, entry.fromScale, entry.toScale, defaults?.scale);

    return {
        duration: entry.duration ?? 700,
        delay: entry.delay ?? 0,
        easing: y?.[2] || opacity?.[2] || scale?.[2] || entry.easing || defaults?.easing,
        y,
        opacity,
        scale
    };
};

const hasEntryEffects = (entry?: ResolvedEntrySpec): boolean => {
    if (!entry) return false;
    return Boolean(entry.y || entry.opacity || entry.scale);
};

const entryToTimeline = (entry?: ScrollEntryConfig, defaults?: ResolveEntryDefaults): TimelineLayer["entry"] | undefined => {
    const resolved = resolveEntrySpec(entry, defaults);
    if (!resolved || !hasEntryEffects(resolved)) return undefined;

    const timelineEntry: TimelineLayer["entry"] = {
        duration: resolved.duration,
        delay: resolved.delay,
        easing: toTimelineEasing(resolved.easing)
    };

    if (resolved.y) {
        timelineEntry.y = [resolved.y[0], resolved.y[1], toTimelineEasing(resolved.y[2] || resolved.easing)] as any;
    }

    if (resolved.opacity) {
        timelineEntry.opacity = [resolved.opacity[0], resolved.opacity[1], toTimelineEasing(resolved.opacity[2] || resolved.easing)] as any;
    }

    if (resolved.scale) {
        timelineEntry.scale = [resolved.scale[0], resolved.scale[1], toTimelineEasing(resolved.scale[2] || resolved.easing)] as any;
    }

    return timelineEntry;
};

const validScene = (scene: ScrollSceneConfig): boolean => {
    const points = [scene.start, scene.inEnd, scene.outStart, scene.end];
    if (points.some((n) => Number.isNaN(n))) return false;
    return scene.start <= scene.inEnd && scene.inEnd <= scene.outStart && scene.outStart <= scene.end;
};

const normalizeTrackKeyframes = (keyframes: ScrollTrackKeyframe[]): ScrollTrackKeyframe[] => {
    const list = [...keyframes]
        .filter((kf) => !Number.isNaN(kf.at))
        .sort((a, b) => a.at - b.at)
        .map((kf) => ({ ...kf, at: clamp01(kf.at) }));

    if (list.length === 0) return [];

    const first = list[0];
    const last = list[list.length - 1];

    const withEdges = [...list];

    if (first.at > 0) {
        withEdges.unshift({ ...first, at: 0 });
    }

    if (last.at < 1) {
        withEdges.push({ ...last, at: 1 });
    }

    return withEdges;
};

const trackFrameToCss = (
    frame: ScrollTrackKeyframe,
    state: { y: string; opacity: number; scale: number },
    usage: { y: boolean; opacity: boolean; scale: boolean }
) => {
    if (typeof frame.y === "string") state.y = frame.y;
    if (typeof frame.opacity === "number") state.opacity = frame.opacity;
    if (typeof frame.scale === "number") state.scale = frame.scale;

    const declarations: string[] = [];

    if (usage.y || usage.scale) {
        const transforms: string[] = [];
        if (usage.y) transforms.push(`translateY(${state.y})`);
        if (usage.scale) transforms.push(`scale(${state.scale})`);
        declarations.push(`transform: ${transforms.join(" ")};`);
    }

    if (usage.opacity) {
        declarations.push(`opacity: ${state.opacity};`);
    }

    return declarations.join(" ");
};

export const buildScrollScenesModel = (config: ScrollScenesConfig): ScrollScenesModel => {
    const id = slugify(config.id || "scene");
    const scopeClass = `--zss-${id}`;
    const timelineName = `--zss-${id}-timeline`;
    const timeline = config.timeline || timelineName;
    const entryNames: Record<string, boolean> = {};
    const panelClasses: Record<string, string> = {};
    const trackClasses: Record<string, string> = {};
    const allClasses: Record<string, string> = {};
    const fallbackLayers: Record<string, TimelineLayer> = {};
    const blocks: string[] = [];

    for (const [sceneName, sceneRaw] of Object.entries(config.scenes || {})) {
        const sceneId = slugify(sceneName);
        const scene = {
            fromY: "100vh",
            atY: "0",
            outY: "-8vh",
            fromOpacity: 1,
            atOpacity: 1,
            outOpacity: 0,
            easing: DEFAULT_EASING,
            willChange: "transform, opacity",
            entry: undefined,
            ...sceneRaw
        };

        if (!validScene(scene)) continue;

        const keyframeName = `zss-${id}-${sceneId}`;
        const entryKeyframeName = `zss-${id}-${sceneId}-entry`;
        const className = `--zss-${id}-${sceneId}`;
        panelClasses[sceneName] = className;
        allClasses[sceneName] = className;

        const p0 = percent(scene.start);
        const p1 = percent(scene.inEnd);
        const p2 = percent(scene.outStart);
        const p3 = percent(scene.end);

        const sceneAnimationNames: string[] = [];
        const sceneDurations: string[] = [];
        const sceneTimings: string[] = [];
        const sceneDelays: string[] = [];
        const sceneFills: string[] = [];
        const sceneTimelines: string[] = [];

        if (scene.entry) {
            const resolvedEntry = resolveEntrySpec(scene.entry, {
                y: [scene.fromY, scene.atY],
                opacity: [scene.fromOpacity, scene.atOpacity],
                easing: scene.easing
            });

            if (resolvedEntry && hasEntryEffects(resolvedEntry)) {
                entryNames[sceneName] = true;

                const fromTransforms = [resolvedEntry?.y ? `translateY(${resolvedEntry.y[0]})` : "", resolvedEntry?.scale ? `scale(${resolvedEntry.scale[0]})` : ""].filter(Boolean).join(" ");
                const toTransforms = [resolvedEntry?.y ? `translateY(${resolvedEntry.y[1]})` : "", resolvedEntry?.scale ? `scale(${resolvedEntry.scale[1]})` : ""].filter(Boolean).join(" ");

                blocks.push(
                    `@keyframes ${entryKeyframeName} {`,
                    `  0% { ${fromTransforms ? `transform: ${fromTransforms};` : ""}${resolvedEntry?.opacity ? ` opacity: ${resolvedEntry.opacity[0]};` : ""} }`,
                    `  100% { ${toTransforms ? `transform: ${toTransforms};` : ""}${resolvedEntry?.opacity ? ` opacity: ${resolvedEntry.opacity[1]};` : ""} }`,
                    `}`
                );

                sceneAnimationNames.push(entryKeyframeName);
                sceneDurations.push(`${resolvedEntry.duration}ms`);
                sceneTimings.push(toCssEasing(resolvedEntry.easing || scene.easing));
                sceneDelays.push(`${resolvedEntry.delay}ms`);
                sceneFills.push(`both`);
                sceneTimelines.push(`auto`);
            }
        }

        sceneAnimationNames.push(keyframeName);
        sceneDurations.push(`1s`);
        sceneTimings.push(toCssEasing(scene.easing));
        sceneDelays.push(`0ms`);
        sceneFills.push(`both`);
        sceneTimelines.push(timeline);

        blocks.push(
            `@keyframes ${keyframeName} {`,
            `  0%, ${p0} { transform: translateY(${scene.fromY}); opacity: ${scene.fromOpacity}; }`,
            `  ${p1}, ${p2} { transform: translateY(${scene.atY}); opacity: ${scene.atOpacity}; }`,
            `  ${p3}, 100% { transform: translateY(${scene.outY}); opacity: ${scene.outOpacity}; }`,
            `}`,
            `.${className} {`,
            `  animation-name: ${sceneAnimationNames.join(", ")};`,
            `  animation-duration: ${sceneDurations.join(", ")};`,
            `  animation-timing-function: ${sceneTimings.join(", ")};`,
            `  animation-fill-mode: ${sceneFills.join(", ")};`,
            `  animation-delay: ${sceneDelays.join(", ")};`,
            `  animation-timeline: ${sceneTimelines.join(", ")};`,
            `  will-change: ${scene.willChange};`,
            `  transform: translateZ(0);`,
            `}`
        );

        fallbackLayers[sceneName] = {
            id: sceneName,
            trigger: "timeline",
            entry: entryToTimeline(scene.entry, {
                y: [scene.fromY, scene.atY],
                opacity: [scene.fromOpacity, scene.atOpacity],
                easing: scene.easing
            }),
            keyframes: [
                {
                    trigger: "timeline",
                    start: 0,
                    end: scene.start,
                    y: [scene.fromY, scene.fromY],
                    opacity: [scene.fromOpacity, scene.fromOpacity]
                },
                {
                    trigger: "timeline",
                    start: scene.start,
                    end: scene.inEnd,
                    y: [scene.fromY, scene.atY, toTimelineEasing(scene.easing)],
                    opacity: [scene.fromOpacity, scene.atOpacity, toTimelineEasing(scene.easing)]
                },
                {
                    trigger: "timeline",
                    start: scene.inEnd,
                    end: scene.outStart,
                    y: [scene.atY, scene.atY],
                    opacity: [scene.atOpacity, scene.atOpacity]
                },
                {
                    trigger: "timeline",
                    start: scene.outStart,
                    end: scene.end,
                    y: [scene.atY, scene.outY, toTimelineEasing(scene.easing)],
                    opacity: [scene.atOpacity, scene.outOpacity, toTimelineEasing(scene.easing)]
                },
                {
                    trigger: "timeline",
                    start: scene.end,
                    end: 1,
                    y: [scene.outY, scene.outY],
                    opacity: [scene.outOpacity, scene.outOpacity]
                }
            ]
        };
    }

    for (const [trackName, trackRaw] of Object.entries(config.tracks || {})) {
        const trackId = slugify(trackName);
        const className = `--zss-${id}-trk-${trackId}`;
        const keyframeName = `zss-${id}-trk-${trackId}`;
        const trackTimeline = trackRaw.timeline || timeline;
        const easing = trackRaw.easing || DEFAULT_EASING;
        const willChange = trackRaw.willChange || "transform, opacity";
        const normalized = normalizeTrackKeyframes(trackRaw.keyframes || []);
        const entry = trackRaw.entry;

        if (normalized.length === 0) continue;

        const usage = {
            y: normalized.some((kf) => typeof kf.y === "string"),
            opacity: normalized.some((kf) => typeof kf.opacity === "number"),
            scale: normalized.some((kf) => typeof kf.scale === "number")
        };

        const initialState = {
            y: "0",
            opacity: 1,
            scale: 1
        };

        if (normalized[0]) {
            const first = normalized[0];
            if (typeof first.y === "string") initialState.y = first.y;
            if (typeof first.opacity === "number") initialState.opacity = first.opacity;
            if (typeof first.scale === "number") initialState.scale = first.scale;
        }

        const state = { ...initialState };

        const keyframeLines: string[] = [];
        for (const frame of normalized) {
            keyframeLines.push(`  ${percent(frame.at)} { ${trackFrameToCss(frame, state, usage)} }`);
        }

        trackClasses[trackName] = className;
        allClasses[trackName] = className;

        const trackAnimationNames: string[] = [];
        const trackDurations: string[] = [];
        const trackTimings: string[] = [];
        const trackDelays: string[] = [];
        const trackFills: string[] = [];
        const trackTimelines: string[] = [];

        if (entry) {
            const resolvedEntry = resolveEntrySpec(entry, {
                y: usage.y ? [initialState.y, initialState.y] : undefined,
                opacity: usage.opacity ? [initialState.opacity, initialState.opacity] : undefined,
                scale: usage.scale ? [initialState.scale, initialState.scale] : undefined,
                easing
            });

            if (resolvedEntry && hasEntryEffects(resolvedEntry)) {
                entryNames[trackName] = true;

                const entryKeyframeName = `zss-${id}-trk-${trackId}-entry`;
                const fromTransforms = [resolvedEntry?.y ? `translateY(${resolvedEntry.y[0]})` : "", resolvedEntry?.scale ? `scale(${resolvedEntry.scale[0]})` : ""].filter(Boolean).join(" ");
                const toTransforms = [resolvedEntry?.y ? `translateY(${resolvedEntry.y[1]})` : "", resolvedEntry?.scale ? `scale(${resolvedEntry.scale[1]})` : ""].filter(Boolean).join(" ");

                blocks.push(
                    `@keyframes ${entryKeyframeName} {`,
                    `  0% { ${fromTransforms ? `transform: ${fromTransforms};` : ""}${resolvedEntry?.opacity ? ` opacity: ${resolvedEntry.opacity[0]};` : ""} }`,
                    `  100% { ${toTransforms ? `transform: ${toTransforms};` : ""}${resolvedEntry?.opacity ? ` opacity: ${resolvedEntry.opacity[1]};` : ""} }`,
                    `}`
                );

                trackAnimationNames.push(entryKeyframeName);
                trackDurations.push(`${resolvedEntry.duration}ms`);
                trackTimings.push(toCssEasing(resolvedEntry.easing || easing));
                trackDelays.push(`${resolvedEntry.delay}ms`);
                trackFills.push(`both`);
                trackTimelines.push(`auto`);
            }
        }

        trackAnimationNames.push(keyframeName);
        trackDurations.push(`1s`);
        trackTimings.push(toCssEasing(easing));
        trackDelays.push(`0ms`);
        trackFills.push(`both`);
        trackTimelines.push(trackTimeline);

        blocks.push(
            `@keyframes ${keyframeName} {`,
            ...keyframeLines,
            `}`,
            `.${className} {`,
            `  animation-name: ${trackAnimationNames.join(", ")};`,
            `  animation-duration: ${trackDurations.join(", ")};`,
            `  animation-timing-function: ${trackTimings.join(", ")};`,
            `  animation-fill-mode: ${trackFills.join(", ")};`,
            `  animation-delay: ${trackDelays.join(", ")};`,
            `  animation-timeline: ${trackTimelines.join(", ")};`,
            `  will-change: ${willChange};`,
            `  transform: translateZ(0);`,
            `}`
        );

        const timelineKeyframes: TimelineKeyframe[] = [];
        let lastState = { y: "0", opacity: 1, scale: 1 };

        if (normalized[0]) {
            const first = normalized[0];
            if (typeof first.y === "string") lastState.y = first.y;
            if (typeof first.opacity === "number") lastState.opacity = first.opacity;
            if (typeof first.scale === "number") lastState.scale = first.scale;
        }

        for (let i = 1; i < normalized.length; i++) {
            const prev = normalized[i - 1];
            const curr = normalized[i];
            const nextState = { ...lastState };
            if (typeof curr.y === "string") nextState.y = curr.y;
            if (typeof curr.opacity === "number") nextState.opacity = curr.opacity;
            if (typeof curr.scale === "number") nextState.scale = curr.scale;

            const kf: TimelineKeyframe = {
                trigger: "timeline",
                start: prev.at,
                end: curr.at
            };

            if (usage.y) {
                (kf as any).y = [lastState.y, nextState.y, toTimelineEasing(easing)];
            }
            if (usage.opacity) {
                (kf as any).opacity = [lastState.opacity, nextState.opacity, toTimelineEasing(easing)];
            }
            if (usage.scale) {
                (kf as any).scale = [lastState.scale, nextState.scale, toTimelineEasing(easing)];
            }

            timelineKeyframes.push(kf);
            lastState = nextState;
        }

        fallbackLayers[trackName] = {
            id: trackName,
            trigger: "timeline",
            entry: entryToTimeline(entry, {
                y: usage.y ? [initialState.y, initialState.y] : undefined,
                opacity: usage.opacity ? [initialState.opacity, initialState.opacity] : undefined,
                scale: usage.scale ? [initialState.scale, initialState.scale] : undefined,
                easing
            }),
            keyframes: timelineKeyframes
        };
    }

    const cssText = [
        `/* Zuz Scroll Scenes: ${id} */`,
        `@supports (animation-timeline: scroll()) {`,
        ...blocks.map((line) => `  ${line}`),
        `}`
    ].join("\n");

    return {
        id,
        scopeClass,
        timelineName,
        scrollContainerSelector: config.scrollContainerSelector,
        entryNames,
        panelClasses,
        trackClasses,
        allClasses,
        fallbackLayers,
        cssText
    };
};
