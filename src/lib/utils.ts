import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** 合併 Tailwind 類名，處理衝突 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
