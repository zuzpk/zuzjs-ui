import { FORMVALIDATION, Props, ValueOf, Variant } from '../../types';
import { Ref } from 'react';

type FormValidation = ValueOf<typeof FORMVALIDATION>

export type InputProps = Props<`input`> & {
    ref?: Ref<HTMLInputElement>,
    numeric?: boolean,
    variant?: ValueOf<typeof Variant>,
    with?: FormValidation | `${FormValidation}${string}`,
    /**
     * Triggers when Enter / Return is Pressed
     */
    onConfirm?: (value: string) => void,
}