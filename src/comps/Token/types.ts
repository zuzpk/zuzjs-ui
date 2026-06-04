import { ValueOf, Variant } from "../../types";

export interface TokenProps {
    id?: string;
    label: string;
    subLabel?: string;
    icon?: string;
    color?: string;
    removable?: boolean;
    variant?: ValueOf<typeof Variant>;
    ref?: React.Ref<HTMLDivElement>;
    render?: (props: TokenProps) => React.ReactNode;
    onClick?: (token: TokenProps) => void;
    onRemove?: (token: TokenProps) => void;
}