<script setup lang="ts">
import { ref, computed } from 'vue';
import { Target, Pencil, Check, X } from 'lucide-vue-next';
import { Card, CardContent } from '@/components/ui/card';
import type { GoalProgress } from '@/types/module/records';

interface Props {
  progress: GoalProgress | null;
  year: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  setGoal: [amount: number];
}>();

/* ── 編輯模式 ── */
const isEditing = ref(false);
const editAmount = ref(0);

function startEdit(): void {
  editAmount.value = props.progress?.targetAmount ?? 300000;
  isEditing.value = true;
}

function confirmEdit(): void {
  if (editAmount.value > 0) {
    emit('setGoal', editAmount.value);
  }
  isEditing.value = false;
}

function cancelEdit(): void {
  isEditing.value = false;
}

function formatCurrency(value: number): string {
  return `$${value.toLocaleString()}`;
}

/** 進度百分比文字 */
const percentText = computed((): string => {
  if (!props.progress) return '0';
  return props.progress.percentage.toFixed(1);
});

/** 是否達標 */
const isAchieved = computed((): boolean => {
  return (props.progress?.percentage ?? 0) >= 100;
});
</script>

<template>
  <Card class="relative overflow-hidden">
    <!-- 裝飾光暈 -->
    <div class="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-amber-400/10 blur-2xl" />
    <div class="pointer-events-none absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-orange-400/8 blur-2xl" />

    <CardContent class="relative p-5">
      <!-- 標題列 -->
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div class="flex h-8 w-8 items-center justify-center rounded-full bg-brand-muted">
            <Target
              :size="15"
              :stroke-width="2"
              class="text-brand"
            />
          </div>
          <div>
            <p class="text-sm font-semibold text-foreground">
              {{ year }} 年度目標
            </p>
            <p class="text-[11px] text-muted-foreground">
              投資收益追蹤
            </p>
          </div>
        </div>
        <button
          v-if="!isEditing"
          class="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-muted-foreground transition hover:bg-muted hover:text-foreground"
          @click="startEdit"
        >
          <Pencil
            :size="11"
            :stroke-width="2"
          />
          <span>{{ progress ? '編輯' : '設定' }}</span>
        </button>
      </div>

      <!-- 編輯模式 -->
      <div
        v-if="isEditing"
        class="flex items-center gap-2"
      >
        <span class="text-xs text-muted-foreground">目標金額</span>
        <input
          v-model.number="editAmount"
          type="number"
          min="1"
          step="10000"
          class="w-36 rounded-lg border border-border bg-white px-3 py-1.5 text-sm outline-none transition focus:border-brand focus:ring-1 focus:ring-brand"
        >
        <button
          class="rounded-md p-1.5 text-gain transition hover:bg-gain/10"
          @click="confirmEdit"
        >
          <Check
            :size="14"
            :stroke-width="2.5"
          />
        </button>
        <button
          class="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted"
          @click="cancelEdit"
        >
          <X
            :size="14"
            :stroke-width="2.5"
          />
        </button>
      </div>

      <!-- 進度顯示 -->
      <template v-else-if="progress">
        <!-- 大數字展示 -->
        <div class="mb-4 flex items-end justify-between">
          <div>
            <p class="text-[11px] text-muted-foreground">
              已實現收益
            </p>
            <p
              class="text-2xl font-bold tracking-tight"
              :class="progress.currentAmount >= 0 ? 'text-foreground' : 'text-loss'"
            >
              {{ formatCurrency(progress.currentAmount) }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-[11px] text-muted-foreground">
              目標
            </p>
            <p class="text-sm font-medium text-muted-foreground">
              {{ formatCurrency(progress.targetAmount) }}
            </p>
          </div>
        </div>

        <!-- 進度條 -->
        <div class="mb-2 h-2.5 w-full overflow-hidden rounded-full bg-brand-muted">
          <div
            class="h-full rounded-full transition-all duration-700 ease-out"
            :class="isAchieved ? 'bg-gain' : 'bg-brand'"
            :style="{ width: `${Math.min(progress.percentage, 100)}%` }"
          />
        </div>

        <!-- 底部資訊 -->
        <div class="flex items-center justify-between">
          <span class="text-[11px] text-muted-foreground">
            {{ isAchieved ? '🎉 恭喜達標！' : `還差 ${formatCurrency(progress.remaining)}` }}
          </span>
          <span
            class="text-xs font-semibold"
            :class="isAchieved ? 'text-gain' : 'text-brand'"
          >
            {{ percentText }}%
          </span>
        </div>
      </template>

      <!-- 尚未設定目標 -->
      <div
        v-else
        class="flex flex-col items-center gap-3 py-4"
      >
        <p class="text-sm text-muted-foreground">
          尚未設定年度收益目標
        </p>
        <button
          class="rounded-lg bg-brand px-4 py-1.5 text-xs font-medium text-brand-foreground transition hover:opacity-90"
          @click="startEdit"
        >
          立即設定
        </button>
      </div>
    </CardContent>
  </Card>
</template>
