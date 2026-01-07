// Implementación básica de toast si no la tienes
import * as React from "react";

export type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
};

export function useToast() {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const toast = (props: ToastProps) => {
    setToasts([...toasts, props]);
    setTimeout(() => {
      setToasts(toasts.slice(1));
    }, props.duration || 3000);
  };

  return {
    toast,
    toasts,
  };
}
