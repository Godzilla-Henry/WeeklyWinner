<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Compass, BookOpen, Zap, ChevronRight } from 'lucide-vue-next';
import type { Component } from 'vue';
import type { InvestNote, NoteCategory } from '../types';
import { noteCategoryLabel } from '../types';

interface Props {
  note: InvestNote;
}

const props = defineProps<Props>();
const router = useRouter();

const categoryIcon: Record<NoteCategory, Component> = {
  direction: Compass,
  note: BookOpen,
  event: Zap,
};

const iconBg: Record<NoteCategory, string> = {
  direction: 'bg-brand-muted',
  note: 'bg-gain/8',
  event: 'bg-chart-3/8',
};

const iconColor: Record<NoteCategory, string> = {
  direction: 'text-brand',
  note: 'text-gain',
  event: 'text-chart-3',
};

const categoryVariant: Record<NoteCategory, 'brand' | 'gain' | 'secondary'> = {
  direction: 'brand',
  note: 'gain',
  event: 'secondary',
};

function navigateToNote(): void {
  void router.push({ name: 'invest-note', params: { id: props.note.id } });
}
</script>

<template>
  <Card
    class="group cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-(--shadow-card-hover)"
    @click="navigateToNote"
  >
    <CardHeader class="pb-2">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-2xl"
            :class="iconBg[props.note.category]"
          >
            <component
              :is="categoryIcon[props.note.category]"
              :size="18"
              :stroke-width="1.75"
              :class="iconColor[props.note.category]"
            />
          </div>
          <div>
            <CardTitle class="text-[15px]">{{ props.note.title }}</CardTitle>
            <p class="mt-0.5 text-xs text-muted-foreground">{{ props.note.date }}</p>
          </div>
        </div>
        <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary transition-all duration-300 group-hover:bg-brand/10">
          <ChevronRight
            :size="14"
            class="text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-brand"
          />
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <p class="mb-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {{ props.note.content }}
      </p>
      <Badge :variant="categoryVariant[props.note.category]" class="text-[10px]">
        {{ noteCategoryLabel[props.note.category] }}
      </Badge>
    </CardContent>
  </Card>
</template>
