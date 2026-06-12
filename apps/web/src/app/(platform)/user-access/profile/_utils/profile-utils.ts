import type { PreferredLanguage } from "../_types/profile.types";

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function getTitleOptions(language: PreferredLanguage) {
  if (language === "English") {
    return ["Mr.", "Mrs."];
  }

  if (language === "Bahasa Indonesia") {
    return ["Pak", "Bu"];
  }

  return ["Mr.", "Mrs.", "Pak", "Bu"];
}

export function normalizeTitleForLanguage(
  currentTitle: string,
  language: PreferredLanguage,
) {
  const options = getTitleOptions(language);

  if (options.includes(currentTitle)) {
    return currentTitle;
  }

  if (language === "English") {
    return currentTitle === "Bu" ? "Mrs." : "Mr.";
  }

  if (language === "Bahasa Indonesia") {
    return currentTitle === "Mrs." ? "Bu" : "Pak";
  }

  return currentTitle || "Mr.";
}