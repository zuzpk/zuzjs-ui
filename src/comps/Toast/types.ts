import { dynamic } from "../..";
import { TRANSITION_CURVES } from "../../types/enums";

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

export interface ToastData {
  id: number;
  type: ToastType;
  icon?: string;
  title?: string;
  message?: string;
  duration?: number;
  onClick?: () => void;
}

export interface ToastController {
  add: (toast: Omit<ToastData, 'id'>) => number;
  remove: (id: number) => void;
  clear: () => void;
}

export interface ToastContextType extends ToastController {
  fx: {
    curve: TRANSITION_CURVES,
    duration: number
  }
}