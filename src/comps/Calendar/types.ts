import { ValueOf } from "../../types";
import { Variant } from "../../types/enums";

export type CalendarProps = {
    defaultValue?: Date | null;
    variant?: ValueOf<typeof Variant>;
    onChange: (date: Date | null) => void;
}