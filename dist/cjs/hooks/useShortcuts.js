'use client';
import { useEffect } from "react";
import { KeyCode } from "../types/enums";
const useShortcuts = (shortcuts, preventDefault) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            const pressedKeys = [];
            if (event.ctrlKey)
                pressedKeys.push(KeyCode.Ctrl);
            if (event.shiftKey)
                pressedKeys.push(KeyCode.Shift);
            if (event.altKey)
                pressedKeys.push(KeyCode.Alt);
            if (event.metaKey)
                pressedKeys.push(KeyCode.PauseBreak); // Meta key (Cmd on Mac)
            pressedKeys.push(event.keyCode); // Convert event key to KeyCode enum
            shortcuts.forEach(({ keys, callback }) => {
                if (keys.every(key => pressedKeys.includes(key))) {
                    if (preventDefault ?? true)
                        event.preventDefault();
                    callback(event);
                }
            });
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [shortcuts, preventDefault]);
};
export default useShortcuts;
