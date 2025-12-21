/** API endpoints */
export const API_ENDPOINTS = {
  /** URL списка модов для конкретной версии */
  getModsJson: (version: string) =>
    `https://raw.githubusercontent.com/epserv-ru/modpack/refs/heads/meta/mods-${version}.json`,
  /** URL списка версий Minecraft */
  MINECRAFT_VERSIONS:
    "https://raw.githubusercontent.com/epserv-ru/modpack/refs/heads/meta/minecraft_versions.json",
  /** URL списка серверов для IPS */
  SERVERS_JSON:
    "https://raw.githubusercontent.com/epserv-ru/modpack/refs/heads/meta/servers.json",
} as const;

export const APP_LINKS = {
  /** Ссылки на скачивание приложения для разных систем */
  WINDOWS:
    "https://github.com/epserv-ru/modpack-app/releases/download/v2.1.1/EP.Modpack.2.1.0-Windows-X64.exe",
  LINUX:
    "https://github.com/epserv-ru/modpack-app/releases/download/v2.1.1/EP.Modpack-2.1.0-Linux-X64.AppImage",
  MACOS:
    "https://github.com/epserv-ru/modpack-app/releases/download/v2.1.1/EP.Modpack-2.1.0-arm64-macOS-ARM64.dmg",
} as const;
