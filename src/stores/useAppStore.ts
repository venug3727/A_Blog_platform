import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { toast } from "@/hooks/use-toast";

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number; // in milliseconds, 0 means persistent
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface LoadingState {
  [key: string]: boolean;
}

interface AppStore {
  // Global Loading States
  loadingStates: LoadingState;
  globalLoading: boolean;

  // Notifications
  notifications: Notification[];

  // App State
  isOnline: boolean;
  lastSync: Date | null;
  notificationPosition:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left";

  // Loading Actions
  setLoading: (key: string, loading: boolean) => void;
  setGlobalLoading: (loading: boolean) => void;
  clearAllLoading: () => void;
  isLoading: (key: string) => boolean;

  // Notification Actions
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;

  // App State Actions
  setOnlineStatus: (isOnline: boolean) => void;
  updateLastSync: () => void;
  setNotificationPosition: (
    position: "top-right" | "top-left" | "bottom-right" | "bottom-left"
  ) => void;

  // Utility Actions
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
}

export const useAppStore = create<AppStore>()(
  devtools(
    (set, get) => ({
      // Initial State
      loadingStates: {},
      globalLoading: false,
      notifications: [],
      isOnline: true,
      lastSync: null,
      notificationPosition: "top-right",

      // Loading Actions
      setLoading: (key, loading) =>
        set(
          (state) => ({
            loadingStates: {
              ...state.loadingStates,
              [key]: loading,
            },
          }),
          false,
          `setLoading:${key}:${loading}`
        ),

      setGlobalLoading: (globalLoading) =>
        set({ globalLoading }, false, "setGlobalLoading"),

      clearAllLoading: () =>
        set(
          { loadingStates: {}, globalLoading: false },
          false,
          "clearAllLoading"
        ),

      isLoading: (key) => {
        const state = get();
        return state.loadingStates[key] || false;
      },

      // Notification Actions
      addNotification: (notification) => {
        const id = Math.random().toString(36).substring(2, 11);
        const newNotification: Notification = {
          id,
          duration: 5000, // Default 5 seconds
          ...notification,
        };

        set(
          (state) => ({
            notifications: [...state.notifications, newNotification],
          }),
          false,
          "addNotification"
        );

        // Auto-remove notification after duration (if not persistent)
        if (newNotification.duration && newNotification.duration > 0) {
          setTimeout(() => {
            get().removeNotification(id);
          }, newNotification.duration);
        }
      },

      removeNotification: (id) =>
        set(
          (state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          }),
          false,
          "removeNotification"
        ),

      clearAllNotifications: () =>
        set({ notifications: [] }, false, "clearAllNotifications"),

      // App State Actions
      setOnlineStatus: (isOnline) =>
        set({ isOnline }, false, "setOnlineStatus"),

      updateLastSync: () =>
        set({ lastSync: new Date() }, false, "updateLastSync"),

      setNotificationPosition: (notificationPosition) =>
        set({ notificationPosition }, false, "setNotificationPosition"),

      // Utility Actions
      showSuccess: (title, message) => {
        get().addNotification({
          type: "success",
          title,
          message,
        });
        toast({
          title,
          description: message,
          variant: "success",
        });
      },

      showError: (title, message) => {
        get().addNotification({
          type: "error",
          title,
          message,
          duration: 8000, // Longer duration for errors
        });
        toast({
          title,
          description: message,
          variant: "destructive",
        });
      },

      showWarning: (title, message) => {
        get().addNotification({
          type: "warning",
          title,
          message,
          duration: 6000,
        });
        toast({
          title,
          description: message,
          variant: "default",
        });
      },

      showInfo: (title, message) => {
        get().addNotification({
          type: "info",
          title,
          message,
        });
        toast({
          title,
          description: message,
          variant: "default",
        });
      },
    }),
    {
      name: "app-store",
    }
  )
);
