import { ReactNode } from "react";
import { dynamic } from "../../types/shared";
import { TRANSITION_CURVES } from "../../types/enums";
import { ValueOf } from "../../types/shared";

export enum ToastType {
    Default = 'default', 
    Success = 'success',
    Error = 'error',
    Warn = 'warn',
    Promise = 'promise'
}

export const ToastDefaultTitle : dynamic = {
  success : "Action Successful",
  error : "Something Went Wrong",
  warn : "Heads Up",
  default : "Notice"
}

export interface ToastProps {
  id?: number;
  type: ToastType;
  icon?: string;
  title?: string | ReactNode;
  message?: string | ReactNode;
  duration?: number;
  onClose?: (id: number) => void,
  onClick?: () => void;
}