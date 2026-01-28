import { Variant } from "../../types/enums";

export type CalendarProps = {
    defaultValue?: Date | null;
    variant?: Variant;
    onChange: (date: Date | null) => void;
}