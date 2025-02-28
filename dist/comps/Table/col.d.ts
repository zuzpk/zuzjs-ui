import { CSSProperties } from "react";
import type { Column } from "./types";
import { PubSub } from "../..";
declare const TColumn: <T>(props: Column<T> & {
    idx: number;
    style?: CSSProperties;
    pubsub: PubSub;
}) => import("react/jsx-runtime").JSX.Element;
export default TColumn;
