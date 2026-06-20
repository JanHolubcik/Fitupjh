import { toast as rtToast, ToastOptions, ToastPromiseParams } from "react-toastify";
import { ReactNode } from "react";

const defaultOptions: ToastOptions<any> = {
  position: "bottom-left",
  autoClose: 2500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showToast = {
  success: (message: ReactNode, options?: ToastOptions) => {
    return rtToast.success(message, { ...defaultOptions, ...options });
  },
  error: (message: ReactNode, options?: ToastOptions) => {
    return rtToast.error(message, { ...defaultOptions, ...options });
  },
  info: (message: ReactNode, options?: ToastOptions) => {
    return rtToast.info(message, { ...defaultOptions, ...options });
  },
  warning: (message: ReactNode, options?: ToastOptions) => {
    return rtToast.warning(message, { ...defaultOptions, ...options });
  },
  promise: <TData = unknown, TError = unknown, TValue = unknown>(
    promise: Promise<TData> | (() => Promise<TData>),
    params: ToastPromiseParams<TData, TError, TValue>,
    options?: ToastOptions<TData>
  ) => {
    return rtToast.promise<TData, TError, TValue>(promise, params, { ...defaultOptions, ...options } as any);
  },
};
