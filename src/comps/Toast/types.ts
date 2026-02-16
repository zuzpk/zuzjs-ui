import { ReactNode } from "react";
import { Variant } from "../../types";
import { dynamic, ValueOf } from "../../types/shared";

export enum ToastType {
    Default = 'default', 
    Success = 'success',
    Error = 'error',
    Warn = 'warn',
    Promise = 'promise'
}

export enum ToastPosition {
    TopLeft = 'TopLeft', TopCenter = 'TopCenter', TopRight = 'TopRight',
    BottomLeft = 'BottomLeft', BottomCenter = 'BottomCenter', BottomRight = 'BottomRight'
}

export enum ToastStyle {
    Stack = 'stack',
    Individual = 'individual'
}
export interface ToastAction {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
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
  sticky?: boolean;
  position?: ToastPosition;
  style?: ToastStyle;
  actions?: ToastAction[];
  variant?: ValueOf<typeof Variant>;
  inBackground?: boolean;
  progress?: boolean;
  onClose?: (id: number) => void;
  onClick?: () => void;
}

export {
    ToastAction as SnackAction, ToastPosition as SnackPosition,
    ToastStyle as SnackStyle,
    ToastType as SnackType
};

