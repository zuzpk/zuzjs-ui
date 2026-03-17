import { Ref } from 'react';
import { Props, ValueOf, Variant, WithFormValidation } from '../../types';

export type InputProps = Props<`input`> & {
    ref?: Ref<HTMLInputElement>,
    numeric?: boolean,
    variant?: ValueOf<typeof Variant>,
    with?: WithFormValidation,
    /**
     * Triggers when Enter / Return is Pressed
     */
    onConfirm?: (value: string) => void,
}