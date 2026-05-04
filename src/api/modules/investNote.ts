/**
 * 投資記事 API（需認證）
 */

import { http } from '@/api/http';
import type { NotesResponse, NoteDetailResponse, NoteCategory } from '@/types/api';

/** 取得記事列表 */
export function getInvestNotes(
  page = 1,
  limit = 20,
  category?: NoteCategory,
): Promise<NotesResponse> {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('limit', String(limit));
  if (category) params.set('category', category);
  return http.get<NotesResponse>(`/invest-notes?${params.toString()}`);
}

/** 取得記事詳情 */
export function getInvestNoteDetail(noteId: string): Promise<NoteDetailResponse> {
  return http.get<NoteDetailResponse>(`/invest-notes/${noteId}`);
}
