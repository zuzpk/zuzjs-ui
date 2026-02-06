import { FORMVALIDATION, Props, ValueOf } from '../../types';
import { Variant } from '@zuzjs/types';
import { Ref } from 'react';

type FormValidation = ValueOf<typeof FORMVALIDATION>

export type InputProps = Props<`input`> & {
    ref?: Ref<HTMLInputElement>,
    numeric?: boolean,
    variant?: Variant,
    with?: FormValidation | `${FormValidation}${string}`,
    /**
     * Triggers when Enter / Return is Pressed
     */
    onConfirm?: (value: string) => void,
}