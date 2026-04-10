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
