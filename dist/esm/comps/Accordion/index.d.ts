import { AccordionHandler } from "./types";
declare const Accordion: import("react").ForwardRefExoticComponent<import("..").BoxProps & {
    message?: string | import("react").ReactNode;
    title: string | import("react").ReactNode | import("react").ReactNode[];
} & import("react").RefAttributes<AccordionHandler>>;
export default Accordion;
