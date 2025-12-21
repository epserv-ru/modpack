/** Длительность кэша в миллисекундах */
export const CACHE_DURATION = {
  /** Длительность кэша модов (1 минута) */
  MODS: 60000,
} as const;

/** Генератор ключей для localStorage/sessionStorage */
export const STORAGE_KEYS = {
  /** Получить ключ для хранения модов версии */
  getModsKey: (version: string) => `mods${version}`,
  /** Получить ключ для timestamp кэша модов */
  getModsTimestamp: (version: string) => `modsTimestamp${version}`,
  /** Получить ключ для хранения выбранных модов версии */
  getCheckedMods: (version: string) => `checkedMods${version}`,
  /** Ключ для хранения версии Minecraft */
  MINECRAFT_VERSION: "minecraftVersion",
  /** Ключ для хранения флага просмотра about */
  HAS_SEEN_ABOUT: "hasSeenAbout",
  /** Ключ для хранения флага просмотра тура select-mods */
  SELECT_MODS_TOUR_SEEN: "selectModsTourSeen",
} as const;
