/**
 * 投資記事 TanStack Query Composables
 */

import { computed, type Ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { getInvestNotes, getInvestNoteDetail, queryKeys } from '@/api';
import { useIsLiffLoggedIn } from '@/composables/shared/useLiffToken';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import type { NotesResponse, NoteDetailResponse, NoteCategory } from '@/types/api';

/** 記事列表 */
export function useInvestNotesQuery(
  page: Ref<number>,
  limit: Ref<number> | number = DEFAULT_PAGE_SIZE,
  category?: Ref<NoteCategory | undefined>,
): ReturnType<typeof useQuery<NotesResponse>> {
  const isLoggedIn = useIsLiffLoggedIn();
  const resolvedLimit = computed(() => (typeof limit === 'number' ? limit : limit.value));

  return useQuery<NotesResponse>({
    queryKey: computed(() =>
      queryKeys.investNotes.list(page.value, resolvedLimit.value, category?.value),
    ),
    queryFn: () => getInvestNotes(page.value, resolvedLimit.value, category?.value),
    enabled: isLoggedIn,
  });
}

/** 記事詳情 */
export function useInvestNoteDetailQuery(
  noteId: Ref<string>,
): ReturnType<typeof useQuery<NoteDetailResponse>> {
  const isLoggedIn = useIsLiffLoggedIn();

  return useQuery<NoteDetailResponse>({
    queryKey: computed(() => queryKeys.investNotes.detail(noteId.value)),
    queryFn: () => getInvestNoteDetail(noteId.value),
    enabled: computed(() => !!noteId.value && isLoggedIn.value),
  });
}
