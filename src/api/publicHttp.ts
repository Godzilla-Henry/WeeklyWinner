/**
 * 公開 API 請求封裝
 * 用於證交所等不需認證的外部 API
 * 基於 fetch API，不帶 Authorization header
 */

/** 公開 API 請求 */
export async function publicGet<T>(url: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url);
  } catch {
    throw new Error('網路連線異常');
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return (await response.json()) as T;
}
