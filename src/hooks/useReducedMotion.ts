"use client";
import { useEffect, useState } from "react";

const mq = typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;

const useReducedMotion = () => {
    const [reduced, setReduced] = useState(() => mq?.matches ?? false);
    useEffect(() => {
        const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
        mq?.addEventListener("change", handler);
        return () => mq?.removeEventListener("change", handler);
    }, []);
    return reduced;
};

export default useReducedMotion;
