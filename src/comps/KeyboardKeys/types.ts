import { ReactNode } from "react";
import { Variant } from "../../types/enums";
import { BoxProps } from "../Box";

export type KeyboardKey =
  | "command"
  | "shift"
  | "ctrl"
  | "option"
  | "enter"
  | "delete"
  | "escape"
  | "tab"
  | "capslock"
  | "up"
  | "right"
  | "down"
  | "left"
  | "pageup"
  | "pagedown"
  | "home"
  | "end"
  | "help"
  | "space"
  | "fn"
  | "win"
  | "alt";

export type KeyCombination = `${KeyboardKey}+${KeyboardKey | string}`;

export const isKeyCombination = (value: KeyboardKey | KeyboardKey[] | KeyCombination): value is KeyCombination => {
    return typeof value === "string" && value.includes("+");
} 

export const KeysMap: Record<KeyboardKey, string> = {
    command: "⌘",
    shift: "⇧",
    ctrl: "⌃",
    option: "⌥",
    enter: "↵",
    delete: "⌫",
    escape: "⎋",
    tab: "⇥",
    capslock: "⇪",
    up: "↑",
    right: "→",
    down: "↓",
    left: "←",
    pageup: "⇞",
    pagedown: "⇟",
    home: "↖",
    end: "↘",
    help: "?",
    space: "␣",
    fn: "Fn",
    win: "⌘",
    alt: "⌥",
};

export const KeysLabelMap: Record<KeyboardKey, string> = {
    command: "Command",
    shift: "Shift",
    ctrl: "Control",
    option: "Option",
    enter: "Enter",
    delete: "Delete",
    escape: "Escape",
    tab: "Tab",
    capslock: "Caps Lock",
    up: "Up",
    right: "Right",
    down: "Down",
    left: "Left",
    pageup: "Page Up",
    pagedown: "Page Down",
    home: "Home",
    end: "End",
    help: "Help",
    space: "Space",
    fn: "Fn",
    win: "Win",
    alt: "Alt",
};

export type KeyboardKeyProps = BoxProps & {
    keys: KeyboardKey | KeyboardKey[] | KeyCombination,
    children?: ReactNode,
    variant?: Variant
}