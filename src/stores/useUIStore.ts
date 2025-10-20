import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";
export type ReadingMode = "normal" | "focus";
export type ViewMode = "cards" | "table";

interface UIStore {
  // Theme and Display
  theme: Theme;
  readingMode: ReadingMode;
  viewMode: ViewMode;
  sidebarCollapsed: boolean;

  // User Preferences
  language: string;
  audioEnabled: boolean;
  autoSave: boolean;
  showWordCount: boolean;
  showReadingTime: boolean;

  // Dashboard Preferences
  dashboardLayout: "compact" | "comfortable";
  postsPerPage: number;

  // Editor Preferences
  editorPreview: boolean;
  editorSplitView: boolean;
  editorLineNumbers: boolean;
  editorWordWrap: boolean;

  // Notification Preferences
  showNotifications: boolean;
  notificationPosition:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left";

  // Actions
  setTheme: (theme: Theme) => void;
  setReadingMode: (mode: ReadingMode) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // User Preference Actions
  setLanguage: (language: string) => void;
  toggleAudio: () => void;
  toggleAutoSave: () => void;
  toggleWordCount: () => void;
  toggleReadingTime: () => void;

  // Dashboard Actions
  setDashboardLayout: (layout: "compact" | "comfortable") => void;
  setPostsPerPage: (count: number) => void;

  // Editor Actions
  toggleEditorPreview: () => void;
  toggleEditorSplitView: () => void;
  toggleEditorLineNumbers: () => void;
  toggleEditorWordWrap: () => void;

  // Notification Actions
  toggleNotifications: () => void;
  setNotificationPosition: (
    position: "top-right" | "top-left" | "bottom-right" | "bottom-left"
  ) => void;

  // Bulk Actions
  resetToDefaults: () => void;
  updatePreferences: (
    preferences: Partial<
      Omit<
        UIStore,
        | "setTheme"
        | "setReadingMode"
        | "setViewMode"
        | "toggleSidebar"
        | "setSidebarCollapsed"
        | "setLanguage"
        | "toggleAudio"
        | "toggleAutoSave"
        | "toggleWordCount"
        | "toggleReadingTime"
        | "setDashboardLayout"
        | "setPostsPerPage"
        | "toggleEditorPreview"
        | "toggleEditorSplitView"
        | "toggleEditorLineNumbers"
        | "toggleEditorWordWrap"
        | "toggleNotifications"
        | "setNotificationPosition"
        | "resetToDefaults"
        | "updatePreferences"
      >
    >
  ) => void;
}

const defaultState = {
  theme: "system" as Theme,
  readingMode: "normal" as ReadingMode,
  viewMode: "table" as ViewMode,
  sidebarCollapsed: false,
  language: "en",
  audioEnabled: false,
  autoSave: true,
  showWordCount: true,
  showReadingTime: true,
  dashboardLayout: "comfortable" as const,
  postsPerPage: 20,
  editorPreview: true,
  editorSplitView: true,
  editorLineNumbers: false,
  editorWordWrap: true,
  showNotifications: true,
  notificationPosition: "top-right" as const,
};

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set) => ({
        // Initial State
        ...defaultState,

        // Theme and Display Actions
        setTheme: (theme) => set({ theme }, false, "setTheme"),

        setReadingMode: (readingMode) =>
          set({ readingMode }, false, "setReadingMode"),

        setViewMode: (viewMode) => set({ viewMode }, false, "setViewMode"),

        toggleSidebar: () =>
          set(
            (state) => ({
              sidebarCollapsed: !state.sidebarCollapsed,
            }),
            false,
            "toggleSidebar"
          ),

        setSidebarCollapsed: (sidebarCollapsed) =>
          set({ sidebarCollapsed }, false, "setSidebarCollapsed"),

        // User Preference Actions
        setLanguage: (language) => set({ language }, false, "setLanguage"),

        toggleAudio: () =>
          set(
            (state) => ({
              audioEnabled: !state.audioEnabled,
            }),
            false,
            "toggleAudio"
          ),

        toggleAutoSave: () =>
          set(
            (state) => ({
              autoSave: !state.autoSave,
            }),
            false,
            "toggleAutoSave"
          ),

        toggleWordCount: () =>
          set(
            (state) => ({
              showWordCount: !state.showWordCount,
            }),
            false,
            "toggleWordCount"
          ),

        toggleReadingTime: () =>
          set(
            (state) => ({
              showReadingTime: !state.showReadingTime,
            }),
            false,
            "toggleReadingTime"
          ),

        // Dashboard Actions
        setDashboardLayout: (dashboardLayout) =>
          set({ dashboardLayout }, false, "setDashboardLayout"),

        setPostsPerPage: (postsPerPage) =>
          set({ postsPerPage }, false, "setPostsPerPage"),

        // Editor Actions
        toggleEditorPreview: () =>
          set(
            (state) => ({
              editorPreview: !state.editorPreview,
            }),
            false,
            "toggleEditorPreview"
          ),

        toggleEditorSplitView: () =>
          set(
            (state) => ({
              editorSplitView: !state.editorSplitView,
            }),
            false,
            "toggleEditorSplitView"
          ),

        toggleEditorLineNumbers: () =>
          set(
            (state) => ({
              editorLineNumbers: !state.editorLineNumbers,
            }),
            false,
            "toggleEditorLineNumbers"
          ),

        toggleEditorWordWrap: () =>
          set(
            (state) => ({
              editorWordWrap: !state.editorWordWrap,
            }),
            false,
            "toggleEditorWordWrap"
          ),

        // Notification Actions
        toggleNotifications: () =>
          set(
            (state) => ({
              showNotifications: !state.showNotifications,
            }),
            false,
            "toggleNotifications"
          ),

        setNotificationPosition: (notificationPosition) =>
          set({ notificationPosition }, false, "setNotificationPosition"),

        // Bulk Actions
        resetToDefaults: () => set(defaultState, false, "resetToDefaults"),

        updatePreferences: (preferences) =>
          set(
            (state) => ({
              ...state,
              ...preferences,
            }),
            false,
            "updatePreferences"
          ),
      }),
      {
        name: "ui-preferences",
        // Persist all UI preferences
        partialize: (state) => {
          // Only persist state properties, not action functions
          return {
            theme: state.theme,
            readingMode: state.readingMode,
            viewMode: state.viewMode,
            sidebarCollapsed: state.sidebarCollapsed,
            language: state.language,
            audioEnabled: state.audioEnabled,
            autoSave: state.autoSave,
            showWordCount: state.showWordCount,
            showReadingTime: state.showReadingTime,
            dashboardLayout: state.dashboardLayout,
            postsPerPage: state.postsPerPage,
            editorPreview: state.editorPreview,
            editorSplitView: state.editorSplitView,
            editorLineNumbers: state.editorLineNumbers,
            editorWordWrap: state.editorWordWrap,
            showNotifications: state.showNotifications,
            notificationPosition: state.notificationPosition,
          };
        },
      }
    ),
    {
      name: "ui-store",
    }
  )
);
