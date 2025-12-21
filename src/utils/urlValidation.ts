/**
 * Проверяет валидность URL
 * @param url - Строка URL для проверки
 * @returns true если URL валиден и использует http/https протокол
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Безопасно открывает внешнюю ссылку в новой вкладке
 * @param url - URL для открытия
 */
export function openExternalUrl(url: string): void {
  if (!isValidUrl(url)) {
    console.warn(`Попытка открыть небезопасный URL: ${url}`);
    return;
  }
  window.open(url, '_blank', 'noopener,noreferrer');
}
