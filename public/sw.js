/**
 * Weekly Winner — Service Worker
 * 基礎資產快取策略：Cache First + Network Fallback
 */

const CACHE_NAME = 'weekly-winner-v1';

/** 預快取的靜態資源 */
const PRECACHE_ASSETS = ['/', '/index.html', '/manifest.json'];

/** 安裝階段：預快取核心資源 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS)),
  );
  /* 跳過等待，立即啟用 */
  self.skipWaiting();
});

/** 啟用階段：清除舊版快取 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
    ),
  );
  /* 立即接管所有頁面 */
  self.clients.claim();
});

/**
 * 攔截 fetch 請求
 * - 靜態資源（JS/CSS/圖片）：Cache First
 * - API 請求：Network Only（不快取動態資料）
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  /* API 請求不快取 */
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/twse')) {
    return;
  }

  /* 僅處理 GET 請求 */
  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(request).then((response) => {
        /* 僅快取成功的同源回應 */
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseClone);
        });
        return response;
      });
    }),
  );
});
