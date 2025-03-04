import { Size } from "../../types/enums";
declare const List: import("react").ForwardRefExoticComponent<import("../..").ZuzProps & Omit<Omit<import("react").DetailedHTMLProps<import("react").OlHTMLAttributes<HTMLOListElement>, HTMLOListElement>, "ref"> | Omit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLUListElement>, HTMLUListElement>, "ref">, keyof import("../..").ZuzProps> & {
    size?: Size;
    items: import("./types").ListItem[];
    ol?: boolean;
} & import("react").RefAttributes<HTMLUListElement | HTMLOListElement>>;
export default List;
