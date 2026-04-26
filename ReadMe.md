# 開發手冊 (Development Handbook)

> **版本：** `2.0.0`
> **最後更新：** 2026-04-25
> **適用技術棧：** Vue 3 + TypeScript + Vite + Pinia + Tailwind CSS
> **角色定位：** 資深前端架構師 (Senior Frontend Architect)

---

## 目錄

- [Rules — 常駐規則](#rules--常駐規則)
  - [Git 規範](#git-規範)
  - [TypeScript 規範](#typescript-規範)
  - [TypeScript 型別安全策略](#typescript-型別安全策略)
  - [Style 規範](#style-規範)
  - [Language 規範](#language-規範)
  - [Vue 3 規範](#vue-3-規範)
  - [Vue 3 工作流](#vue-3-工作流)
  - [專案架構與目錄](#專案架構與目錄)
  - [Code Review 檢核表](#code-review-檢核表)
- [Skills — 隨選技能](#skills--隨選技能)
- [版本紀錄](#版本紀錄)

---

## Rules — 常駐規則

以下規則於所有開發情境中**強制生效**，不可選擇性忽略。

---

### Git 規範

#### 分支策略（Google Git Flow）

```
main ← release ← develop ← feature/#xxx-desc
                          ← fix/#xxx-desc
         ↑
       hotfix/#xxx-desc（直接合併至 main + develop）
```

| 分支       | 用途                     | 合併目標            |
| ---------- | ------------------------ | ------------------- |
| `main`     | 正式環境，僅接受 release | —                   |
| `release`  | 預發佈，凍結功能         | `main` + `develop`  |
| `develop`  | 開發主線                 | `release`           |
| `feature`  | 新功能                   | `develop`           |
| `fix`      | 錯誤修復                 | `develop`           |
| `hotfix`   | 緊急修補                 | `main` + `develop`  |
| `refactor` | 重構                     | `develop`           |
| `chore`    | 雜務/工具鏈              | `develop`           |

#### 分支命名

格式：`[type-prefix]/#[task-id]-[description]`

```
feature/#123-user-login
fix/#456-null-pointer
hotfix/#789-prod-crash
refactor/#101-api-layer
chore/#202-update-eslint
```

#### Commit Message

採用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
<type>(<scope>): <subject>

feat(auth): 新增 OAuth2 登入流程
fix(cart): 修正數量為 0 時的渲染錯誤
refactor(api): 抽離 HTTP 攔截器至獨立模組
```

#### CI/CD 整合要點

- `develop` → 自動部署至 **Staging**
- `release` → 自動部署至 **Pre-production**，需人工審核
- `main` → 自動部署至 **Production**，需 Tag 觸發
- 所有 PR 必須通過 **ESLint + Type Check + Unit Test** 才可合併

---

### TypeScript 規範

| 規則                          | 說明                                           |
| ----------------------------- | ---------------------------------------------- |
| **禁止 `any`**                | 使用 `unknown` 搭配型別守衛，或定義明確介面     |
| **禁止 `as` 斷言**            | 使用型別守衛或泛型取代強制斷言                   |
| **啟用 `strict` 模式**        | `tsconfig.json` 中 `"strict": true`            |
| **優先使用 `interface`**      | 描述物件結構時優先於 `type`，除非需要聯合型別   |
| **Enum 使用 `const enum`**    | 減少編譯產出體積                                |
| **函式必須標註回傳型別**       | 禁止依賴隱式推導                                |
| **禁止冗餘型別標註**          | 當推導結果已明確時，不重複標註                   |

---

### TypeScript 型別安全策略

#### 全域型別定義

將共用型別集中於 `src/types/`，依領域分檔：

```
src/types/
├── api.d.ts        # API 回應通用結構
├── auth.d.ts       # 認證相關
├── user.d.ts       # 使用者領域
└── index.ts        # 統一匯出
```

#### API Response 型別定義

```typescript
// src/types/api.d.ts
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

interface PaginatedData<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 使用範例
type UserListResponse = ApiResponse<PaginatedData<UserProfile>>;
```

#### 禁止 `any` — 替代方案

```typescript
// ❌ 禁止
function parse(data: any): any { ... }

// ✅ 使用 unknown + 型別守衛
function isUserProfile(data: unknown): data is UserProfile {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data
  );
}

function parse(data: unknown): UserProfile {
  if (!isUserProfile(data)) {
    throw new TypeError('Invalid UserProfile');
  }
  return data;
}
```

#### 禁止 `as` — 替代方案

```typescript
// ❌ 禁止
const user = response.data as UserProfile;

// ✅ 使用泛型約束
async function fetchUser(id: string): Promise<ApiResponse<UserProfile>> {
  return http.get<ApiResponse<UserProfile>>(`/users/${id}`);
}

// ✅ 使用型別守衛驗證
const response = await fetchUser('123');
if (isUserProfile(response.data)) {
  // 此處 response.data 已被收窄為 UserProfile
}
```

#### 泛型應用範例

```typescript
// Composable 泛型封裝
function useAsyncData<T>(
  fetcher: () => Promise<T>,
): {
  data: Ref<T | null>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  execute: () => Promise<void>;
} {
  const data = ref<T | null>(null) as Ref<T | null>;
  const loading = ref(false);
  const error = ref<Error | null>(null);

  async function execute(): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      data.value = await fetcher();
    } catch (e: unknown) {
      error.value = e instanceof Error ? e : new Error(String(e));
    } finally {
      loading.value = false;
    }
  }

  return { data, loading, error, execute };
}
```

---

### Style 規範

- 使用 **ESLint + Prettier** 統一格式化。
- 縮排：**2 spaces**，禁止 Tab。
- 字串：統一使用**單引號** `'`。
- 結尾分號：**必須加上**。
- 每個檔案結尾保留**一個空行**。
- CSS 方案：**Tailwind CSS** 為主，組件私有樣式使用 **Scoped CSS**。
- Tailwind 類名排序：安裝 `prettier-plugin-tailwindcss` 自動排序。

---

### Language 規範

- 程式碼中的**變數、函式、類別命名**一律使用**英文**。
- **註解與文件**使用**繁體中文**。
- UI 顯示文字透過 **i18n** 管理，禁止硬編碼。

---

### Vue 3 規範

#### 組件風格

- 統一使用 **`<script setup lang="ts">`** 語法。
- Props 必須使用 `defineProps<T>()` 搭配介面定義。
- Emits 必須使用 `defineEmits<T>()` 明確宣告事件。
- 禁止在 `<script setup>` 中使用 Options API 混寫。

```vue
<script setup lang="ts">
interface Props {
  title: string;
  count?: number;
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
});

const emit = defineEmits<{
  (e: 'update', value: number): void;
}>();
</script>
```

#### 組件命名

| 類型       | 命名規則          | 範例                  |
| ---------- | ----------------- | --------------------- |
| 檔案名稱   | PascalCase        | `UserCard.vue`        |
| 模板引用   | PascalCase        | `<UserCard />`        |
| 路由名稱   | kebab-case        | `user-profile`        |

---

### Vue 3 工作流

#### SFC 結構順序

每個 `.vue` 檔案內部區塊**必須**依以下順序排列：

```vue
<script setup lang="ts">
// 1. 型別匯入
// 2. 外部依賴匯入（vue, vue-router, pinia...）
// 3. 內部模組匯入（composables, utils, components）
// 4. Props / Emits 定義
// 5. 響應式狀態（ref, reactive, computed）
// 6. 生命週期鉤子
// 7. 方法定義
</script>

<template>
  <!-- 模板內容 -->
</template>

<style scoped>
/* 組件私有樣式 */
</style>
```

#### Composables 提取時機

符合以下**任一條件**即應提取為 Composable：

| 條件                           | 說明                                 |
| ------------------------------ | ------------------------------------ |
| **跨組件共用邏輯**              | 兩個以上組件使用相同邏輯              |
| **單一組件邏輯過長**            | `<script setup>` 超過 **80 行**      |
| **可獨立測試的業務邏輯**        | 與 UI 無關的純邏輯                   |
| **副作用管理**                  | API 調用、WebSocket、計時器等         |

#### Composable 封裝標準

```typescript
// src/composables/useUser.ts
import { ref, onMounted } from 'vue';
import type { UserProfile } from '@/types/user';
import { fetchUserApi } from '@/api/user';

interface UseUserReturn {
  user: Ref<UserProfile | null>;
  loading: Ref<boolean>;
  refresh: () => Promise<void>;
}

export function useUser(userId: string): UseUserReturn {
  const user = ref<UserProfile | null>(null);
  const loading = ref(false);

  async function refresh(): Promise<void> {
    loading.value = true;
    try {
      const res = await fetchUserApi(userId);
      user.value = res.data;
    } finally {
      loading.value = false;
    }
  }

  onMounted(refresh);

  return { user, loading, refresh };
}
```

#### 狀態管理（Pinia）

```typescript
// src/stores/useAuthStore.ts
import { defineStore } from 'pinia';
import type { UserProfile } from '@/types/user';

interface AuthState {
  token: string | null;
  user: UserProfile | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    user: null,
  }),

  getters: {
    isAuthenticated: (state): boolean => state.token !== null,
  },

  actions: {
    async login(credentials: LoginPayload): Promise<void> {
      const res = await loginApi(credentials);
      this.token = res.data.token;
      this.user = res.data.user;
    },

    logout(): void {
      this.token = null;
      this.user = null;
    },
  },
});
```

---

### 專案架構與目錄

採用**模組化 + 領域分層**結構：

```
src/
├── api/                  # API 請求層（按領域分檔）
│   ├── http.ts           #   Axios 實例與攔截器
│   ├── user.ts           #   使用者相關 API
│   └── auth.ts           #   認證相關 API
│
├── assets/               # 靜態資源
│   ├── images/
│   └── styles/
│       └── tailwind.css  #   Tailwind 入口
│
├── components/           # 共用元件
│   ├── ui/               #   基礎 UI 元件（Button, Input, Modal...）
│   └── layout/           #   佈局元件（Header, Sidebar, Footer...）
│
├── composables/          # 組合式函式（跨組件共用邏輯）
│   ├── useUser.ts
│   └── useAsyncData.ts
│
├── constants/            # 常數定義
│   └── index.ts
│
├── plugins/              # Vue 插件（i18n, router, pinia 初始化）
│
├── router/               # 路由設定
│   ├── index.ts
│   └── guards.ts         #   導航守衛
│
├── stores/               # Pinia 狀態管理
│   └── useAuthStore.ts
│
├── types/                # 全域型別定義
│   ├── api.d.ts
│   ├── auth.d.ts
│   ├── user.d.ts
│   └── index.ts
│
├── utils/                # 工具函式（純函式，無副作用）
│   ├── format.ts
│   └── validate.ts
│
├── views/                # 頁面級元件（對應路由）
│   ├── HomeView.vue
│   └── LoginView.vue
│
├── App.vue
└── main.ts
```

| 資料夾         | 職責                                | 規則                              |
| -------------- | ----------------------------------- | --------------------------------- |
| `api/`         | 封裝所有 HTTP 請求                  | 禁止在組件中直接呼叫 Axios        |
| `components/`  | 可複用 UI 元件                      | 不含業務邏輯                      |
| `composables/` | 封裝可複用的響應式邏輯               | 以 `use` 前綴命名                 |
| `stores/`      | 全域狀態管理                        | 以 `use___Store` 命名             |
| `types/`       | 型別定義                            | 僅含 `interface` / `type`         |
| `utils/`       | 純工具函式                          | 無副作用、無框架依賴              |
| `views/`       | 頁面組件                            | 以 `___View.vue` 命名             |

---

### Code Review 檢核表

每次 PR 提交前，依以下項目逐一檢核：

#### 型別安全

- [ ] 無 `any` 使用
- [ ] 無 `as` 型別斷言
- [ ] 所有函式標註回傳型別
- [ ] API 回應已定義對應 `interface`

#### 程式碼精簡

- [ ] 無重複邏輯（已提取為 Composable 或 Util）
- [ ] 無未使用的變數、匯入或函式
- [ ] 單一函式不超過 **30 行**
- [ ] 單一 `<script setup>` 不超過 **80 行**
- [ ] 無巢狀超過 **3 層**的條件判斷

#### 組件品質

- [ ] Props 使用 `defineProps<T>()` 定義
- [ ] Emits 使用 `defineEmits<T>()` 定義
- [ ] 組件職責單一（不混合多個領域邏輯）
- [ ] 模板中無複雜表達式（已提取為 `computed`）

#### 命名一致性

- [ ] 組件檔名 PascalCase
- [ ] Composable 以 `use` 前綴
- [ ] Store 以 `use___Store` 命名
- [ ] 常數使用 `UPPER_SNAKE_CASE`
- [ ] 分支命名符合 `[type]/#[id]-[desc]`

---

## Skills — 隨選技能

以下技能模組依需求**手動啟用**，適用於特定開發情境。

| 技能名稱                  | 觸發時機                         | 資源連結                                                                                       |
| ------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------- |
| **UI/UX Pro Max**         | 進行介面設計或元件開發時          | [GitHub](https://github.com/anthropics/anthropic-cookbook)                                      |
| **API 整合指南**          | 串接後端 RESTful / GraphQL 時    | 依專案 OpenAPI Spec 引入                                                                        |
| **效能優化檢查表**         | 上線前效能審查時                  | Vue 3 [Performance Guide](https://vuejs.org/guide/best-practices/performance.html)              |
| **無障礙 (a11y) 檢核**    | 元件開發完成、進入 QA 階段時      | [Vue A11y](https://vuejs.org/guide/best-practices/accessibility.html)                           |

### 技能啟用方式

在開發對話中以 `#技能名稱` 引用即可載入對應指引，例如：

```
#UI/UX Pro Max — 請協助審查這個表單元件的互動設計
```

---

## 版本紀錄

| 版本    | 日期       | 說明                                                        |
| ------- | ---------- | ----------------------------------------------------------- |
| `1.0.0` | 2026-04-25 | 初版建立                                                     |
| `2.0.0` | 2026-04-25 | 升級為架構師等級：新增型別安全策略、工作流、目錄規範、CR 檢核表 |
