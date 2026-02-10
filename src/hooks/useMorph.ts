"use client"
import { useState, useLayoutEffect, RefObject } from "react";
import { TRANSITION_CURVES } from "../types/enums";
import { ValueOf } from "../types";
import useFx from "./useFx";

export type MorphOptions = {
    duration?: number;
    curve?: ValueOf<typeof TRANSITION_CURVES>;
    borderRadius?: { from: number; to: number };
    targetWidth?: number;
};

const useMorph = (
    sourceRef: RefObject<HTMLElement | null>, 
    active: boolean,
    options: MorphOptions = {}
) => {
    const [sourceRect, setRect] = useState<DOMRect | null>(null);
    const [isMeasured, setIsMeasured] = useState(false);

    const { 
        duration = 0.25, 
        curve = TRANSITION_CURVES.EaseOutBack,
        borderRadius = { from: 40, to: 24 },
        targetWidth = 320
    } = options;

    useLayoutEffect(() => {
        if (active && sourceRef.current) {
            setRect(sourceRef.current.getBoundingClientRect());
            setIsMeasured(true);
        } else if (!active) {
            setIsMeasured(false);
        }
    }, [active, sourceRef]);

    const morph = useFx({
        from: { 
            opacity: 0, 
            width: sourceRect?.width, 
            height: sourceRect?.height,
            borderRadius: borderRadius.from 
        },
        to: { 
            opacity: 1, 
            width: targetWidth, 
            height: 'auto', // useFx handles the content reflow height
            borderRadius: borderRadius.to 
        },
        curve,
        duration,
        when: isMeasured && active
    });

    return {
        style: morph.style,
        isMeasured,
        sourceRect
    };
};

export default useMorph