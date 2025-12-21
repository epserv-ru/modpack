import { useMemo } from "react";
import { useModsContext } from "@/components/ModsContext";
import { STORAGE_KEYS } from "@/constants/cache";

/**
 * Хук для проверки загруженности данных модов
 * @param version - Версия Minecraft для проверки
 * @returns true если данные ещё не загружены
 */
export function useIsDataLoaded(version: string | null): boolean {
  const modsContext = useModsContext();

  return useMemo(() => {
    return !version || !modsContext.loaded[version];
  }, [version, modsContext.loaded]);
}

/**
 * Хук для получения версии Minecraft из sessionStorage
 * @returns Версия Minecraft или null
 */
export function useMinecraftVersion(): string | null {
  return typeof window !== 'undefined'
    ? window.sessionStorage.getItem(STORAGE_KEYS.MINECRAFT_VERSION)
    : null;
}
