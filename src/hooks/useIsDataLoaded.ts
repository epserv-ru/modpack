import { STORAGE_KEYS } from "@/constants/cache";

/**
 * Хук для получения версии Minecraft из sessionStorage
 * @returns Версия Minecraft или null
 */
export function useMinecraftVersion(): string | null {
  return typeof window !== 'undefined'
    ? window.sessionStorage.getItem(STORAGE_KEYS.MINECRAFT_VERSION)
    : null;
}

/**
 * Хук для записи версии Minecraft в sessionStorage
 */
export function setMinecraftVersion(version: string) {
  window.sessionStorage.setItem(STORAGE_KEYS.MINECRAFT_VERSION, version)
}

export function useSeenTour(): string | null {
  return typeof window !== 'undefined'
    ? window.sessionStorage.getItem(STORAGE_KEYS.SELECT_MODS_TOUR_SEEN)
    : null;
}

export function setHasSeenTour(seen: string): void {
  window.sessionStorage.setItem(STORAGE_KEYS.SELECT_MODS_TOUR_SEEN, seen)
}
