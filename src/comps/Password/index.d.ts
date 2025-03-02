import { InputProps } from '../Input';
export type PasswordProps = Omit<InputProps, `type` | `numeric`> & {};
declare const Password: import("react").ForwardRefExoticComponent<Omit<InputProps, "type" | "numeric"> & import("react").RefAttributes<HTMLInputElement>>;
export default Password;
