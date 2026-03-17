import { Command } from '@zuzjs/hooks';
import { Props, ValueOf, WithFormValidation } from '../../types';
import { Variant } from '../../types/enums';

export type TextAreaProps = Props<`textarea`> & {
    autoResize?: boolean,
    resize?: `none` | `block` | `both` | `horizontal` | `vertical`,
    maxHeight?: number | string,
    variant?: ValueOf<typeof Variant>,
    command?: string,
    commands?: Command[],
    with?: WithFormValidation,
    cmd?: (value: string, textarea: HTMLTextAreaElement | HTMLInputElement) => void,
    renderDropdown?: (props: {
        show: boolean;
        position: { top: number; left: number };
        commands: Command[];
        onSelect: (value: string) => void;
    }) => React.ReactNode;
}
