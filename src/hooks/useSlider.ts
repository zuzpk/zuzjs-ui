'use client'
import { useState } from "react";
import { useViewTransition } from "..";

const useSlider = () => {

    const [history, setHistory] = useState<string[]>(["root"]);
    const [prevKey, setPrevKey] = useState<string | null>(null);
    const [direction, setDirection] = useState<"left" | "right">("left");
    const startTransition = useViewTransition();
  
    const push = (key: string) => {
      setDirection("left");
      setPrevKey(history[history.length - 1]);
      startTransition(() => setHistory((prev) => [...prev, key]));
    };
  
    const goBack = () => {
      if (history.length <= 1) return;
      setDirection("right");
      setPrevKey(history[history.length - 1]);
      startTransition(() => setHistory((prev) => prev.slice(0, -1)));
    };
  
    return { push, goBack, prevKey, direction }

}

export default useSlider