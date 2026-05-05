<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import StockAutocomplete from '../components/StockAutocomplete.vue';
import type { ProfitRecordForm } from '@/types/module/records';

interface Props {
  open: boolean;
  defaultYear: number;
  defaultMonth: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  submit: [form: ProfitRecordForm];
}>();

const form = ref<ProfitRecordForm>({
  year: props.defaultYear,
  month: props.defaultMonth,
  stockName: '',
  profitLoss: 0,
  note: '',
});

/** Select 需要 string，做雙向轉換 */
const selectedMonthStr = computed({
  get: () => String(form.value.month),
  set: (val: string) => { form.value.month = Number(val); },
});

/** 當 dialog 開啟時重置表單 */
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      form.value = {
        year: props.defaultYear,
        month: props.defaultMonth,
        stockName: '',
        profitLoss: 0,
        note: '',
      };
    }
  },
);

function handleSubmit(): void {
  if (!form.value.stockName.trim()) return;
  emit('submit', { ...form.value, stockName: form.value.stockName.trim() });
  emit('update:open', false);
}

const months = Array.from({ length: 12 }, (_, i) => i + 1);
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-md">
      <DialogHeader class="p-6">
        <DialogTitle>新增收益記錄</DialogTitle>
        <DialogDescription class="text-xs">記錄每月個股損益，追蹤投資績效</DialogDescription>
      </DialogHeader>

      <form class="flex flex-col gap-4 px-6 pb-6" @submit.prevent="handleSubmit">
        <!-- 年份 / 月份 -->
        <div class="grid grid-cols-2 gap-3">
          <label class="flex flex-col gap-1.5">
            <span class="text-xs font-medium text-muted-foreground">年份</span>
            <input
              v-model.number="form.year"
              type="number"
              min="2020"
              max="2030"
              class="rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </label>
          <label class="flex flex-col gap-1.5">
            <span class="text-xs font-medium text-muted-foreground">月份</span>
            <Select v-model="selectedMonthStr">
              <SelectTrigger class="w-full">
                <SelectValue>{{ form.month }} 月</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="m in months" :key="m" :value="String(m)">
                  {{ m }} 月
                </SelectItem>
              </SelectContent>
            </Select>
          </label>
        </div>

        <!-- 股票名稱 -->
        <div class="flex flex-col gap-1.5">
          <span class="text-xs font-medium text-muted-foreground">股票名稱</span>
          <StockAutocomplete v-model="form.stockName" />
        </div>

        <!-- 損益金額 -->
        <label class="flex flex-col gap-1.5">
          <span class="text-xs font-medium text-muted-foreground">損益金額（NT$）</span>
          <input
            v-model.number="form.profitLoss"
            type="number"
            placeholder="正數為獲利，負數為虧損"
            class="rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-1 focus:ring-brand"
          />
        </label>

        <!-- 備註 -->
        <label class="flex flex-col gap-1.5">
          <span class="text-xs font-medium text-muted-foreground">備註</span>
          <input
            v-model="form.note"
            type="text"
            placeholder="選填，例：獲利了結。"
            class="rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-1 focus:ring-brand"
          />
        </label>

        <!-- 送出按鈕 -->
        <button
          type="submit"
          class="mt-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-brand-foreground transition hover:opacity-90 disabled:opacity-50"
          :disabled="!form.stockName.trim()"
        >
          新增記錄
        </button>
      </form>
    </DialogContent>
  </Dialog>
</template>
