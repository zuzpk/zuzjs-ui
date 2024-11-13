import { AccordionHandler } from "./types";
declare const Accordion: import("react").ForwardRefExoticComponent<import("../Box").BoxProps & {
    message?: string;
    title: string | import("react").ReactNode | import("react").ReactNode[];
} & import("react").RefAttributes<AccordionHandler>>;
export default Accordion;
