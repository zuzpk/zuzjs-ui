import { Command } from "../..";
import { Props } from '../../types';
import { Variant } from '../../types/enums';

export type TextAreaProps = Props<`textarea`> & {
    autoResize?: boolean,
    resize?: `none` | `block` | `both` | `horizontal` | `vertical`,
    maxHeight?: number | string,
    variant?: Variant,
    command?: string,
    commands?: Command[],
    cmd?: (value: string, textarea: HTMLTextAreaElement | HTMLInputElement) => void,
    renderDropdown?: (props: {
        show: boolean;
        position: { top: number; left: number };
        commands: Command[];
        onSelect: (value: string) => void;
    }) => React.ReactNode;
}
