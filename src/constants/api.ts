/** API endpoints */
export const API_ENDPOINTS = {
  /** URL списка модов для конкретной версии */
  getModsJson: (version: string) =>
    `https://raw.githubusercontent.com/epserv-ru/modpack/refs/heads/meta/${version}.toml`,
  /** URL списка версий Minecraft */
  MINECRAFT_VERSIONS:
    "https://raw.githubusercontent.com/epserv-ru/modpack/refs/heads/meta/minecraft_versions.toml",
} as const;

export const APP_LINKS = {
  /** Ссылки на скачивание приложения для разных систем */
  WINDOWS:
    "https://github.com/epserv-ru/modpack-app/releases/download/v2.1.2/EP.Modpack-2.1.0-win-x64.exe",
  LINUX:
    "https://github.com/epserv-ru/modpack-app/releases/download/v2.1.2/EP.Modpack-2.1.0-linux-x86_64.AppImage",
  MACOS:
    "https://github.com/epserv-ru/modpack-app/releases/download/v2.1.2/EP.Modpack-2.1.0-mac-arm64.dmg",
} as const;

/** Размеры файлов приложения для разных систем (в МБ) */
export const APP_SIZES = {
  WINDOWS: 78,
  LINUX: 112,
  MACOS: 106,
} as const;
