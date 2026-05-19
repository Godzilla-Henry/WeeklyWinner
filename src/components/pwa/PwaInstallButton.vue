<script setup lang="ts">
/**
 * PWA 懸浮安裝按鈕（可拖曳 + 左右吸附）
 * 三種情境：
 * 1. LINE 內建瀏覽器 → 提示用 Safari / Chrome 開啟
 * 2. iOS Safari → 圖解導引（分享 → 加入主畫面）
 * 3. Android / 桌面 Chrome → 攔截 beforeinstallprompt 原生安裝
 *    若尚未觸發 beforeinstallprompt → 顯示通用說明
 */
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { Download, X, Share } from 'lucide-vue-next';

/** 按鈕尺寸（px） */
const BTN_SIZE = 48;
/** 邊緣間距（px） */
const EDGE_MARGIN = 16;

/** beforeinstallprompt 事件暫存 */
let deferredPrompt: Event | null = null;

/** 彈窗顯示狀態 */
const showIosGuide = ref(false);
const showLineGuide = ref(false);
const showFallbackGuide = ref(false);

/** 複製網址狀態 */
const copied = ref(false);

/** 複製當前網址 */
async function copyUrl(): Promise<void> {
  try {
    await navigator.clipboard.writeText(window.location.href);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch {
    /* clipboard API 不可用時 fallback */
    const input = document.createElement('input');
    input.value = window.location.href;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  }
}

/** 按鈕位置 */
const posX = ref(0);
const posY = ref(0);

/** 拖曳狀態 */
const isDragging = ref(false);
const isSnapping = ref(false);

let startX = 0;
let startY = 0;
let offsetX = 0;
let offsetY = 0;
let hasMoved = false;

/** 偵測 LINE 內建瀏覽器 */
const isLineBrowser = computed((): boolean => /line\//i.test(navigator.userAgent));

/** 偵測 iOS 裝置 */
const isIos = computed((): boolean => /iphone|ipad|ipod/i.test(navigator.userAgent));

/** 偵測 iOS Safari（排除 LINE / Chrome / Firefox） */
const isIosSafari = computed(
  (): boolean =>
    isIos.value &&
    !isLineBrowser.value &&
    /safari/i.test(navigator.userAgent) &&
    !/crios|fxios|opios/i.test(navigator.userAgent),
);

/** 按鈕動態樣式 */
const buttonStyle = computed(() => ({
  left: `${posX.value}px`,
  top: `${posY.value}px`,
  transition: isSnapping.value
    ? 'left 0.3s cubic-bezier(0.25, 1, 0.5, 1), top 0.05s ease'
    : 'none',
}));

function initPosition(): void {
  posX.value = window.innerWidth - BTN_SIZE - EDGE_MARGIN;
  posY.value = window.innerHeight - BTN_SIZE - 120;
}

function clampY(y: number): number {
  return Math.max(EDGE_MARGIN, Math.min(window.innerHeight - BTN_SIZE - EDGE_MARGIN, y));
}

function snapToEdge(): void {
  isSnapping.value = true;
  posX.value =
    posX.value + BTN_SIZE / 2 < window.innerWidth / 2
      ? EDGE_MARGIN
      : window.innerWidth - BTN_SIZE - EDGE_MARGIN;
  setTimeout(() => {
    isSnapping.value = false;
  }, 300);
}

/* ── 觸控事件 ── */
function onTouchStart(e: TouchEvent): void {
  const touch = e.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
  offsetX = touch.clientX - posX.value;
  offsetY = touch.clientY - posY.value;
  hasMoved = false;
  isDragging.value = true;
  isSnapping.value = false;
}

function onTouchMove(e: TouchEvent): void {
  if (!isDragging.value) return;
  const touch = e.touches[0];
  if (!hasMoved && Math.abs(touch.clientX - startX) < 4 && Math.abs(touch.clientY - startY) < 4)
    return;
  hasMoved = true;
  posX.value = touch.clientX - offsetX;
  posY.value = clampY(touch.clientY - offsetY);
}

function onTouchEnd(): void {
  isDragging.value = false;
  if (hasMoved) snapToEdge();
}

/* ── 滑鼠事件 ── */
function onMouseDown(e: MouseEvent): void {
  startX = e.clientX;
  startY = e.clientY;
  offsetX = e.clientX - posX.value;
  offsetY = e.clientY - posY.value;
  hasMoved = false;
  isDragging.value = true;
  isSnapping.value = false;
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

function onMouseMove(e: MouseEvent): void {
  if (!isDragging.value) return;
  if (!hasMoved && Math.abs(e.clientX - startX) < 4 && Math.abs(e.clientY - startY) < 4) return;
  hasMoved = true;
  posX.value = e.clientX - offsetX;
  posY.value = clampY(e.clientY - offsetY);
}

function onMouseUp(): void {
  isDragging.value = false;
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
  if (hasMoved) snapToEdge();
}

/** 處理 beforeinstallprompt（Android / 桌面 Chrome） */
function handleBeforeInstallPrompt(e: Event): void {
  e.preventDefault();
  deferredPrompt = e;
}

/** 點擊安裝按鈕 */
async function handleInstallClick(): Promise<void> {
  if (hasMoved) return;

  /* 情境 1：LINE 內建瀏覽器 */
  if (isLineBrowser.value) {
    showLineGuide.value = true;
    return;
  }

  /* 情境 2：iOS Safari */
  if (isIosSafari.value) {
    showIosGuide.value = true;
    return;
  }

  /* 情境 3a：已攔截到 beforeinstallprompt → 原生安裝 */
  if (deferredPrompt) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const promptEvent = deferredPrompt as any;
    promptEvent.prompt();
    await promptEvent.userChoice;
    deferredPrompt = null;
    return;
  }

  /* 情境 3b：不支援或尚未觸發 → 通用說明 */
  showFallbackGuide.value = true;
}

function closeAll(): void {
  showIosGuide.value = false;
  showLineGuide.value = false;
  showFallbackGuide.value = false;
}

function handleResize(): void {
  snapToEdge();
  posY.value = clampY(posY.value);
}

onMounted(() => {
  initPosition();
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
});
</script>

<template>
  <!-- 懸浮安裝按鈕 -->
  <button
    :style="buttonStyle"
    class="fixed z-9990 flex h-12 w-12 select-none items-center justify-center rounded-full bg-brand text-brand-foreground shadow-liquid active:scale-95"
    :class="{ 'opacity-70 scale-95': isDragging }"
    aria-label="安裝應用程式至主畫面"
    @touchstart="onTouchStart"
    @touchmove.prevent="onTouchMove"
    @touchend="onTouchEnd"
    @mousedown.prevent="onMouseDown"
    @click="handleInstallClick"
  >
    <Download class="pointer-events-none h-5 w-5" />
  </button>

  <Teleport to="body">
    <!-- iOS Safari 導引彈窗 -->
    <Transition name="pwa-fade">
      <div
        v-if="showIosGuide"
        class="fixed inset-0 z-9999 flex items-end justify-center bg-black/40 backdrop-blur-sm"
        @click.self="closeAll"
      >
        <div class="mx-4 mb-6 w-full max-w-sm rounded-3xl bg-card p-6 shadow-float">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-foreground">新增至主畫面</h3>
            <button
              class="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground"
              aria-label="關閉"
              @click="closeAll"
            >
              <X class="h-4 w-4" />
            </button>
          </div>
          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                <span class="text-sm font-bold">1</span>
              </div>
              <p class="flex-1 text-sm text-foreground">
                點擊 Safari 底部工具列的
                <Share class="inline-block h-4 w-4 text-brand" />
                <span class="font-medium text-brand">「分享」</span>按鈕
              </p>
            </div>
            <div class="flex items-start gap-3">
              <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                <span class="text-sm font-bold">2</span>
              </div>
              <p class="flex-1 text-sm text-foreground">
                向下滑動選單，點擊<span class="font-medium text-brand">「加入主畫面」</span>
              </p>
            </div>
            <div class="flex items-start gap-3">
              <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                <span class="text-sm font-bold">3</span>
              </div>
              <p class="flex-1 text-sm text-foreground">
                點擊右上角<span class="font-medium text-brand">「新增」</span>即可完成安裝
              </p>
            </div>
          </div>
          <p class="mt-4 text-center text-xs text-muted-foreground">
            安裝後可從主畫面直接開啟，享受完整 App 體驗
          </p>
        </div>
      </div>
    </Transition>

    <!-- LINE 瀏覽器導引彈窗 -->
    <Transition name="pwa-fade">
      <div
        v-if="showLineGuide"
        class="fixed inset-0 z-9999 flex items-end justify-center bg-black/40 backdrop-blur-sm"
        @click.self="closeAll"
      >
        <div class="mx-4 mb-6 w-full max-w-sm rounded-3xl bg-card p-6 shadow-float">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-foreground">安裝 App 至主畫面</h3>
            <button
              class="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground"
              aria-label="關閉"
              @click="closeAll"
            >
              <X class="h-4 w-4" />
            </button>
          </div>
          <p class="mb-4 text-sm text-muted-foreground">
            LINE 瀏覽器不支援安裝 App，請依以下步驟操作：
          </p>
          <div class="space-y-3">
            <div class="flex items-start gap-3">
              <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                <span class="text-sm font-bold">1</span>
              </div>
              <p class="flex-1 text-sm text-foreground">
                點擊下方按鈕複製網址
              </p>
            </div>
            <button
              class="w-full rounded-2xl bg-brand py-3 text-sm font-medium text-brand-foreground transition-opacity active:opacity-70"
              @click="copyUrl"
            >
              {{ copied ? '✓ 已複製！' : '複製網址' }}
            </button>
            <div class="flex items-start gap-3">
              <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                <span class="text-sm font-bold">2</span>
              </div>
              <p class="flex-1 text-sm text-foreground">
                開啟 <span class="font-medium text-brand">Safari</span>，將網址貼到網址列並前往
              </p>
            </div>
            <div class="flex items-start gap-3">
              <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                <span class="text-sm font-bold">3</span>
              </div>
              <p class="flex-1 text-sm text-foreground">
                在 Safari 中點擊下載按鈕，即可安裝至主畫面
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 通用說明彈窗（不支援 beforeinstallprompt 的瀏覽器） -->
    <Transition name="pwa-fade">
      <div
        v-if="showFallbackGuide"
        class="fixed inset-0 z-9999 flex items-end justify-center bg-black/40 backdrop-blur-sm"
        @click.self="closeAll"
      >
        <div class="mx-4 mb-6 w-full max-w-sm rounded-3xl bg-card p-6 shadow-float">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-foreground">安裝 App</h3>
            <button
              class="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground"
              aria-label="關閉"
              @click="closeAll"
            >
              <X class="h-4 w-4" />
            </button>
          </div>
          <p class="mb-3 text-sm text-muted-foreground">
            請使用以下方式將 App 加入主畫面：
          </p>
          <div class="space-y-2 rounded-2xl bg-muted p-4 text-sm text-foreground">
            <p><span class="font-medium text-brand">Android Chrome：</span>點選網址列右側選單 → 「新增至主畫面」</p>
            <p><span class="font-medium text-brand">iOS Safari：</span>底部分享按鈕 → 「加入主畫面」</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.pwa-fade-enter-active,
.pwa-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.pwa-fade-enter-from,
.pwa-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
