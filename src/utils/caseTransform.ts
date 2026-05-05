/**
 * snake_case → camelCase 轉換工具
 * 遞迴處理物件與陣列中的所有 key
 */

/** 將單一 snake_case 字串轉為 camelCase */
function snakeToCamelStr(str: string): string {
  return str.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase());
}

/** 遞迴轉換物件 key 為 camelCase */
export function snakeToCamel<T>(data: unknown): T {
  if (Array.isArray(data)) {
    return data.map((item: unknown) => snakeToCamel<unknown>(item)) as T;
  }

  if (data !== null && typeof data === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      result[snakeToCamelStr(key)] = snakeToCamel<unknown>(value);
    }
    return result as T;
  }

  return data as T;
}

/** 將單一 camelCase 字串轉為 snake_case */
function camelToSnakeStr(str: string): string {
  return str.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);
}

/** 遞迴轉換物件 key 為 snake_case（用於 POST/PUT 送出） */
export function camelToSnake<T>(data: unknown): T {
  if (Array.isArray(data)) {
    return data.map((item: unknown) => camelToSnake<unknown>(item)) as T;
  }

  if (data !== null && typeof data === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      result[camelToSnakeStr(key)] = camelToSnake<unknown>(value);
    }
    return result as T;
  }

  return data as T;
}
