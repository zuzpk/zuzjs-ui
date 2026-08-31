import { ReactNode } from "react";
import { BoxProps, ValueOf, Variant } from "../../types";

export interface Step {
    /** Step number (auto-generated if not provided) */
    index?: number;
    /** Icon to display instead of step number */
    icon?: ReactNode;
    /** Label text for the step */
    label?: ReactNode;
    /** Description text below the label */
    description?: ReactNode;
    /** Whether this step is completed */
    completed?: boolean
    /** Whether this step has an error */
    error?: boolean
    /** Whether this step is disabled */
    disabled?: boolean;
}

export type StepsProps = BoxProps & {
    /** Array of steps to display */
    steps: Step[];
    /** Current active step index (0-based) */
    current?: number
    /** Visual variant */
    variant?: ValueOf<typeof Variant>
    /** Direction of steps */
    direction?: 'horizontal' | 'vertical';
    /** Show step numbers */
    showNumber?: boolean
    /** Allow clicking on steps to navigate */
    clickable?: boolean
    /** Callback when a step is clicked */
    onChange?: (index: number, step: Step) => void;
}