import ServerIp from "../types/ServerIp.tsx";

declare global {
  interface Window {
    electronAPI?: {
      chooseDirectory: () => Promise<string | null>;
      ensureFolder: (folderPath: string) => Promise<boolean>;
      saveFile: (filePath: string, buffer: Uint8Array) => Promise<boolean>;
      addServers: (dir: string, newServers: ServerIp[]) => Promise<{ success: boolean; error?: string }>;
      getDefaultDir: () => Promise<string>;
    }
  }
}