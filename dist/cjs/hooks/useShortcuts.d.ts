import { KeyCode } from "../types/enums";
export type Shortcut = {
    keys: KeyCode[];
    callback: (event: KeyboardEvent) => void;
};
declare const useShortcuts: (shortcuts: Shortcut[], preventDefault?: boolean) => void;
export default useShortcuts;
