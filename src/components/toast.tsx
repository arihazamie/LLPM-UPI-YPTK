"use client";

import { useEffect, useState, useCallback } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

interface Toast {
  id: string;
  type: "success" | "error" | "warning";
  message: string;
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
  duration?: number;
}

function ToastItem({ toast, onRemove, duration = 5000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    // Wait for animation to complete before calling onRemove
    setTimeout(() => onRemove(toast.id), 300);
  }, [onRemove, toast.id]);

  useEffect(() => {
    // Trigger animation
    setIsVisible(true);

    // Auto close after duration
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, handleClose]);

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStyles = () => {
    switch (toast.type) {
      case "success":
        return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20";
      case "error":
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20";
      case "warning":
        return "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20";
    }
  };

  return (
    <div
      className={`
        min-w-80 max-w-md p-4 rounded-lg border shadow-lg
        transform transition-all duration-300 ease-in-out
        ${
          isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }
        ${getStyles()}
      `}>
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {toast.message}
          </p>
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>
      {/* Progress bar */}
      <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
        <div
          className={`h-1 rounded-full transition-all ease-linear ${
            toast.type === "success"
              ? "bg-green-500"
              : toast.type === "error"
              ? "bg-red-500"
              : "bg-yellow-500"
          }`}
          style={{
            width: "100%",
            animation: `shrink ${duration}ms linear`,
          }}
        />
      </div>
      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemoveToast: (id: string) => void;
}

export function ToastContainer({ toasts, onRemoveToast }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            transform: `translateY(-${index * 8}px)`,
            zIndex: 50 - index,
          }}>
          <ToastItem
            toast={toast}
            onRemove={onRemoveToast}
          />
        </div>
      ))}
    </div>
  );
}

export type { Toast };
