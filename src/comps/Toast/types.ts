import { ReactNode } from "react";
import { Variant } from "../../types";
import { dynamic, ValueOf } from "../../types/shared";
import { ButtonProps } from "../Button/types";

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
    tag?: string;
    buttonProps?: Omit<ButtonProps, 'onClick' | 'children'>;
    onClick: (e: any) => void;
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
  busy?: boolean;
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
  progressValue?: number;
  width?: number | string;
  onClose?: (id: number) => void;
  onClick?: (e: any) => void;
}

export {
    ToastAction as SnackAction, ToastPosition as SnackPosition,
    ToastStyle as SnackStyle,
    ToastType as SnackType
};

