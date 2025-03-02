import { JSX, Ref } from "react";
import type { TableProps } from "./types";
declare const ForwardedTable: <T>(props: TableProps<T> & {
    ref?: Ref<HTMLDivElement>;
}) => JSX.Element;
export default ForwardedTable;
