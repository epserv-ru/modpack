export {};

declare global {
  interface Window {
    electronAPI?: {
      minimizeWindow: () => void;
      maximizeWindow: () => void;
      closeWindow: () => void;
      chooseDirectory: () => Promise<string | null>;
      ensureFolder: (folderPath: string) => Promise<boolean>;
      saveFile: (filePath: string, buffer: ArrayBuffer) => Promise<boolean>;
      getDefaultDir: () => Promise<string>;
    };
  }
}