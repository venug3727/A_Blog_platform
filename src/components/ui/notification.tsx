"use client";

import { useEffect } from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { useAppStore } from "@/stores";

const notificationIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const notificationStyles = {
  success: "border-green-200 bg-green-50 text-green-800",
  error: "border-red-200 bg-red-50 text-red-800",
  warning: "border-yellow-200 bg-yellow-50 text-yellow-800",
  info: "border-blue-200 bg-blue-50 text-blue-800",
};

export function NotificationContainer() {
  const { notifications, removeNotification, notificationPosition } =
    useAppStore();

  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  if (notifications.length === 0) return null;

  return (
    <div
      className={cn(
        "fixed z-50 flex flex-col gap-2 max-w-sm w-full",
        positionClasses[notificationPosition]
      )}
    >
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}

interface NotificationItemProps {
  notification: {
    id: string;
    type: "success" | "error" | "warning" | "info";
    title: string;
    message?: string;
    duration?: number;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
  onRemove: () => void;
}

function NotificationItem({ notification, onRemove }: NotificationItemProps) {
  const Icon = notificationIcons[notification.type];

  useEffect(() => {
    // Auto-remove after duration if specified
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => {
        onRemove();
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification.duration, onRemove]);

  return (
    <div
      className={cn(
        "relative flex items-start gap-3 p-4 border rounded-lg shadow-lg animate-in slide-in-from-right-full",
        notificationStyles[notification.type]
      )}
    >
      <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm">{notification.title}</h4>
        {notification.message && (
          <p className="text-sm opacity-90 mt-1">{notification.message}</p>
        )}

        {notification.action && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 h-auto p-0 text-current hover:text-current hover:bg-transparent underline"
            onClick={() => {
              notification.action?.onClick();
              onRemove();
            }}
          >
            {notification.action.label}
          </Button>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="h-auto p-1 text-current hover:text-current hover:bg-black/10"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
