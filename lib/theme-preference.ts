import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ColorScheme } from "@/constants/theme";

const THEME_KEY = "behisabi:theme";

export async function loadThemePreference(): Promise<ColorScheme | null> {
  const value = await AsyncStorage.getItem(THEME_KEY);
  return value === "light" || value === "dark" ? value : null;
}

export function saveThemePreference(value: ColorScheme) {
  return AsyncStorage.setItem(THEME_KEY, value);
}
