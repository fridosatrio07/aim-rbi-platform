export type AppTheme = "light" | "dark";
export type ThemeSource = "system" | "manual";

export const THEME_STORAGE_KEY = "assetIntegrityTheme";
export const THEME_SOURCE_STORAGE_KEY = "assetIntegrityThemeSource";

export function isAppTheme(value: string | null): value is AppTheme {
  return value === "light" || value === "dark";
}

function canUseDOM() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

export function getSystemTheme(): AppTheme {
  if (!canUseDOM()) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getStoredThemePreference(): { theme: AppTheme; source: ThemeSource } {
  if (!canUseDOM()) return { theme: "light", source: "system" };

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  const storedSource = window.localStorage.getItem(THEME_SOURCE_STORAGE_KEY);

  if (storedSource === "manual" && isAppTheme(storedTheme)) {
    return { theme: storedTheme, source: "manual" };
  }

  return { theme: getSystemTheme(), source: "system" };
}

export function getCurrentDocumentTheme(): AppTheme {
  if (!canUseDOM()) return "light";
  const theme = document.documentElement.dataset.theme;
  if (theme === "light" || theme === "dark") {
    return theme;
  }
  return getStoredThemePreference().theme;
}

export function applyTheme(theme: AppTheme, source: ThemeSource = "system") {
  if (!canUseDOM()) return;

  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.themeSource = source;
}

export function setManualTheme(theme: AppTheme) {
  if (!canUseDOM()) return;

  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  window.localStorage.setItem(THEME_SOURCE_STORAGE_KEY, "manual");
  applyTheme(theme, "manual");
}

export function syncThemeFromPreference() {
  const preference = getStoredThemePreference();
  applyTheme(preference.theme, preference.source);
  return preference;
}
