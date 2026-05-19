<script setup lang="ts">
/**
 * PWA 懸浮安裝按鈕（可拖曳 + 左右吸附）
 * - 支援觸控拖曳與滑鼠拖曳
 * - 放開後自動吸附至最近的左側或右側邊緣
 * - Android：攔截 beforeinstallprompt 觸發原生安裝
 * - iOS：顯示圖解導引彈窗
 * - standalone 模式下完全隱藏
 */
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { Download, X, Share } from 'lucide-vue-next';

/** 按鈕尺寸（px） */
const BTN_SIZE = 48;
/** 邊緣間距（px） */
const EDGE_MARGIN = 16;

/** 是否已在 standalone 模式（已安裝） */
const isStandalone = ref(false);

/** beforeinstallprompt 事件暫存 */
let deferredPrompt: Event | null = null;

/** 是否顯示安裝按鈕 */
const showButton = ref(false);

/** 是否顯示 iOS 導引彈窗 */
const showIosGuide = ref(false);

/** 按鈕位置 */
const posX = ref(0);
const posY = ref(0);

/** 是否正在拖曳中 */
const isDragging = ref(false);

/** 是否啟用吸附動畫 */
const isSnapping = ref(false);

/** 拖曳相關暫存 */
let startX = 0;
let startY = 0;
let offsetX = 0;
let offsetY = 0;
let hasMoved = false;

/** 偵測是否為 iOS */
const isIos = computed((): boolean => {
  const ua = navigator.userAgent;
  return /iphone|ipad|ipod/i.test(ua);
});

/** 偵測是否為 iOS Safari */
const isIosSafari = computed((): boolean => {
  const ua = navigator.userAgent;
  return isIos.value && /safari/i.test(ua) && !/crios|fxios|opios/i.test(ua);
});

/** 按鈕動態樣式 */
const buttonStyle = computed(() => ({
  left: `${posX.value}px`,
  top: `${posY.value}px`,
  transition: isSnapping.value ? 'left 0.3s cubic-bezier(0.25, 1, 0.5, 1), top 0.05s ease' : 'none',
}));

/** 初始化按鈕位置（右下角） */
function initPosition(): void {
  posX.value = window.innerWidth - BTN_SIZE - EDGE_MARGIN;
  posY.value = window.innerHeight - BTN_SIZE - 120;
}

/** 限制 Y 軸範圍 */
function clampY(y: number): number {
  const minY = EDGE_MARGIN;
  const maxY = window.innerHeight - BTN_SIZE - EDGE_MARGIN;
  return Math.max(minY, Math.min(maxY, y));
}

/** 吸附至最近邊緣 */
function snapToEdge(): void {
  const centerX = posX.value + BTN_SIZE / 2;
  const screenMid = window.innerWidth / 2;

  isSnapping.value = true;
  if (centerX < screenMid) {
    posX.value = EDGE_MARGIN;
  } else {
    posX.value = window.innerWidth - BTN_SIZE - EDGE_MARGIN;
  }

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
  e.preventDefault();
  const touch = e.touches[0];
  const dx = touch.clientX - startX;
  const dy = touch.clientY - startY;

  if (!hasMoved && Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
  hasMoved = true;

  posX.value = touch.clientX - offsetX;
  posY.value = clampY(touch.clientY - offsetY);
}

function onTouchEnd(): void {
  isDragging.value = false;
  if (hasMoved) {
    snapToEdge();
  }
}

/* ── 滑鼠事件（桌面端） ── */
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
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;

  if (!hasMoved && Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
  hasMoved = true;

  posX.value = e.clientX - offsetX;
  posY.value = clampY(e.clientY - offsetY);
}

function onMouseUp(): void {
  isDragging.value = false;
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
  if (hasMoved) {
    snapToEdge();
  }
}

/** 處理 beforeinstallprompt 事件（Android Chrome） */
function handleBeforeInstallPrompt(e: Event): void {
  e.preventDefault();
  deferredPrompt = e;
  showButton.value = true;
}

/** 處理 appinstalled 事件 */
function handleAppInstalled(): void {
  showButton.value = false;
  deferredPrompt = null;
}

/** 點擊安裝按鈕（僅在未拖曳時觸發） */
async function handleInstallClick(): Promise<void> {
  if (hasMoved) return;

  if (isIos.value) {
    showIosGuide.value = true;
    return;
  }

  if (!deferredPrompt) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const promptEvent = deferredPrompt as any;
  promptEvent.prompt();
  const result = await promptEvent.userChoice;

  if (result.outcome === 'accepted') {
    showButton.value = false;
  }
  deferredPrompt = null;
}

/** 關閉 iOS 導引彈窗 */
function closeIosGuide(): void {
  showIosGuide.value = false;
}

/** 視窗 resize 時重新吸附 */
function handleResize(): void {
  snapToEdge();
  posY.value = clampY(posY.value);
}

onMounted(() => {
  const mq = window.matchMedia('(display-mode: standalone)');
  isStandalone.value =
    mq.matches ||
    ('standalone' in navigator &&
      (navigator as unknown as { standalone: boolean }).standalone);

  if (isStandalone.value) return;

  initPosition();

  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  window.addEventListener('appinstalled', handleAppInstalled);
  window.addEventListener('resize', handleResize);

  if (isIos.value && isIosSafari.value) {
    showButton.value = true;
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  window.removeEventListener('appinstalled', handleAppInstalled);
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
});
</script>

<template>
  <!-- 可拖曳懸浮安裝按鈕 -->
  <Transition name="pwa-fade">
    <button
      v-if="showButton && !isStandalone"
      :style="buttonStyle"
      class="fixed z-9990 flex h-12 w-12 select-none items-center justify-center rounded-full bg-brand text-brand-foreground shadow-liquid active:scale-95"
      :class="{ 'opacity-70 scale-95': isDragging }"
      aria-label="安裝應用程式至主畫面"
      @touchstart.passive="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @mousedown.prevent="onMouseDown"
      @click="handleInstallClick"
    >
      <Download class="h-5 w-5 pointer-events-none" />
    </button>
  </Transition>

  <!-- iOS 導引彈窗 -->
  <Teleport to="body">
    <Transition name="pwa-fade">
      <div
        v-if="showIosGuide"
        class="fixed inset-0 z-9999 flex items-end justify-center bg-black/40 backdrop-blur-sm"
        @click.self="closeIosGuide"
      >
        <div class="mx-4 mb-6 w-full max-w-sm rounded-3xl bg-card p-6 shadow-float">
          <!-- 標題 -->
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-foreground">新增至主畫面</h3>
            <button
              class="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-secondary"
              aria-label="關閉"
              @click="closeIosGuide"
            >
              <X class="h-4 w-4" />
            </button>
          </div>

          <!-- 步驟說明 -->
          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                <span class="text-sm font-bold">1</span>
              </div>
              <div class="flex-1">
                <p class="text-sm text-foreground">
                  點擊 Safari 底部工具列的
                  <Share class="inline-block h-4 w-4 text-brand" />
                  <span class="font-medium text-brand">「分享」</span>按鈕
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                <span class="text-sm font-bold">2</span>
              </div>
              <div class="flex-1">
                <p class="text-sm text-foreground">
                  向下滑動選單，點擊
                  <span class="font-medium text-brand">「加入主畫面」</span>
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                <span class="text-sm font-bold">3</span>
              </div>
              <div class="flex-1">
                <p class="text-sm text-foreground">
                  點擊右上角
                  <span class="font-medium text-brand">「新增」</span>即可完成安裝
                </p>
              </div>
            </div>
          </div>

          <p class="mt-4 text-center text-xs text-muted-foreground">
            安裝後可從主畫面直接開啟，享受完整 App 體驗
          </p>
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
