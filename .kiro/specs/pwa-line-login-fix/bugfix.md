# Bugfix Requirements Document

## Introduction

在行動裝置（iOS/Android）上，無論是 PWA Standalone 模式或一般手機瀏覽器（Safari/Chrome），按下 LINE 登入按鈕後，`liff.login()` 會跳轉到 LINE App 進行認證。認證完成後，callback 在**新的瀏覽器視窗/分頁**開啟，而非回到原本的 PWA 或瀏覽器分頁，導致使用者被困在新視窗，原視窗仍停留在未登入狀態。

現有的 BroadcastChannel 橋接機制（`usePwaAuthBridge.ts`）在 iOS 15.4 以前不支援，且即使廣播成功，使用者仍需手動切回原視窗，體驗極差。

修正策略：行動裝置上改用 `line://app/{LIFF_ID}` 深層連結直接開啟 LINE App，LINE App 會在其內建 WebView 中開啟 LIFF URL，LIFF SDK 在 WebView 中 `init()` 後自動完成授權（因為使用者已在 LINE App 中登入），整個流程都在 LINE App 內完成，不會開新瀏覽器視窗。

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN 使用者在行動裝置（iPhone/iPad/Android）的 PWA Standalone 模式按下 LINE 登入 THEN the system 呼叫 `liff.login()` 導致跳轉至 LINE App 認證，認證完成後 callback 在系統瀏覽器的新分頁開啟，原 PWA 視窗仍停留在未登入狀態

1.2 WHEN 使用者在行動裝置的一般手機瀏覽器（Safari/Chrome）按下 LINE 登入 THEN the system 呼叫 `liff.login()` 導致跳轉至 LINE App 認證，認證完成後 callback 在新的瀏覽器分頁開啟，而非回到原本的分頁

1.3 WHEN 行動裝置上 LINE 認證完成後 callback 開啟新視窗 THEN the system 的 BroadcastChannel 橋接機制在 iOS 15.4 以前無法運作，且即使廣播成功使用者仍需手動切回原視窗

### Expected Behavior (Correct)

2.1 WHEN 使用者在行動裝置的 PWA Standalone 模式按下 LINE 登入 THEN the system SHALL 使用 `line://app/{LIFF_ID}` 深層連結開啟 LINE App，LINE App 在其內建 WebView 中完成 LIFF 初始化與登入同步，不開啟新的瀏覽器視窗

2.2 WHEN 使用者在行動裝置的一般手機瀏覽器（Safari/Chrome）按下 LINE 登入 THEN the system SHALL 使用 `line://app/{LIFF_ID}` 深層連結開啟 LINE App，LINE App 在其內建 WebView 中完成 LIFF 初始化與登入同步，不開啟新的瀏覽器分頁

2.3 WHEN LINE App WebView 開啟 LIFF URL 且 `liff.init()` 完成後 `liff.isLoggedIn()` 為 true THEN the system SHALL 自動執行後端登入同步（`fetchProfile()` + `POST /auth/login` + `authStore.setProfile()`）

### Unchanged Behavior (Regression Prevention)

3.1 WHEN 使用者在桌面瀏覽器按下 LINE 登入 THEN the system SHALL CONTINUE TO 使用現有 `liff.login({ redirectUri })` + BroadcastChannel 流程完成登入

3.2 WHEN 後端登入同步執行時 THEN the system SHALL CONTINUE TO 使用現有 `POST /auth/login`（帶 LINE Access Token 作為 Bearer）不改動後端 API

3.3 WHEN 登入完成後 THEN the system SHALL CONTINUE TO 使用 LIFF SDK 管理的 Access Token + Pinia persisted profile 儲存登入狀態，不新增額外 Token 記錄機制

3.4 WHEN `plugins/liff.ts` 的 `initLiff()` 偵測到 `liff.isInClient()` 為 true 且 `liff.isLoggedIn()` 為 true THEN the system SHALL CONTINUE TO 自動呼叫 `syncBackendLogin()` 完成登入同步

---

## Bug Condition (Pseudocode)

```pascal
FUNCTION isBugCondition(X)
  INPUT: X of type LoginAttempt { userAgent: string, maxTouchPoints: number, loginMethod: string }
  OUTPUT: boolean

  // 行動裝置判斷
  LET isMobile = /iPhone|iPad|iPod|Android/i.test(X.userAgent) OR X.maxTouchPoints > 1

  // Bug 觸發條件：行動裝置 + 使用 liff.login() 進行登入
  RETURN isMobile AND X.loginMethod = "liff.login()"
END FUNCTION
```

```pascal
// Property: Fix Checking — 行動裝置使用深層連結登入
FOR ALL X WHERE isBugCondition(X) DO
  result ← login'(X)
  ASSERT result.method = "line://app/{LIFF_ID}" AND NOT result.opensNewBrowserWindow
END FOR
```

```pascal
// Property: Preservation Checking — 桌面流程不受影響
FOR ALL X WHERE NOT isBugCondition(X) DO
  ASSERT F(X) = F'(X)
  // 桌面瀏覽器繼續使用 liff.login({ redirectUri }) + BroadcastChannel
END FOR
```
