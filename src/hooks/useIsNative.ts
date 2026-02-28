import { useMemo } from "react";

/**
 * Проверяет, запущено приложение в нативном режиме (Electron)
 * @returns true если запущено в Electron
 */
export function useIsNative(): boolean {
  return useMemo(() => typeof window !== 'undefined' && !!(window as any).electronAPI, []);
}
