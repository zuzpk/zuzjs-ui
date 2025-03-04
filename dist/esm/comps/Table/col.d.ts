import { CSSProperties } from "react";
import { PubSub } from "../..";
import type { Column } from "./types";
declare const TColumn: {
    <T>(props: Column<T> & {
        idx: number;
        style?: CSSProperties;
        pubsub: PubSub;
        sortBy?: string | null;
    }): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
export default TColumn;
