import { InputProps } from '../Input';
export type PasswordProps = Omit<InputProps, `type` | `numeric`> & {};
declare const OTP: import("react").ForwardRefExoticComponent<Omit<InputProps, "type" | "numeric"> & import("react").RefAttributes<HTMLInputElement>>;
export default OTP;
