declare global {
  interface Window {
    electronAPI?: {
      chooseDirectory: () => Promise<string | null>;
    }
  }
}