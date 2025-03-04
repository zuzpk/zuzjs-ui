import { FILTER } from "../../types/enums";
export type FilterProps = {
    names?: FILTER[];
    strength?: number;
};
declare const Filters: {
    (props: FilterProps): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
export default Filters;
