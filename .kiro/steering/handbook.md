---
inclusion: manual
description: 完整開發手冊 — Git 規範、型別安全策略、Code Review 檢核表
---

# 開發手冊補充規範

> 核心技術棧與專案結構已由 `product.md`、`tech.md`、`structure.md` 常駐載入。
> 本檔案為進階規範，需要時以 `#handbook` 引用。

---

## Git 規範

### 分支策略（Google Git Flow）

```
main ← release ← develop ← feature/#xxx-desc
                          ← fix/#xxx-desc
         ↑
       hotfix/#xxx-desc（直接合併至 main + develop）
```

| 分支       | 用途                     | 合併目標           |
| ---------- | ------------------------ | ------------------ |
| `main`     | 正式環境，僅接受 release | —                  |
| `release`  | 預發佈，凍結功能         | `main` + `develop` |
| `develop`  | 開發主線                 | `release`          |
| `feature`  | 新功能                   | `develop`          |
| `fix`      | 錯誤修復                 | `develop`          |
| `hotfix`   | 緊急修補                 | `main` + `develop` |

### 分支命名

格式：`[type-prefix]/#[task-id]-[description]`

### Commit Message

採用 Conventional Commits：`<type>(<scope>): <subject>`

### CI/CD

- `develop` → Staging（自動）
- `release` → Pre-production（人工審核）
- `main` → Production（Tag 觸發）
- PR 必須通過 ESLint + Type Check + Unit Test

---

## TypeScript 型別安全策略

### 禁止 `any` — 使用 `unknown` + 型別守衛

```typescript
function isUserProfile(data: unknown): data is UserProfile {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data
  );
}
```

### 禁止 `as` — 使用泛型約束

```typescript
async function fetchUser(id: string): Promise<ApiResponse<UserProfile>> {
  return http.get<ApiResponse<UserProfile>>(`/users/${id}`);
}
```

---

## Code Review 檢核表

### 型別安全

- [ ] 無 `any` 使用
- [ ] 無 `as` 型別斷言
- [ ] 所有函式標註回傳型別
- [ ] API 回應已定義對應 `interface`

### 程式碼精簡

- [ ] 無重複邏輯（已提取為 Composable 或 Util）
- [ ] 無未使用的變數、匯入或函式
- [ ] 單一函式不超過 30 行
- [ ] 單一 `<script setup>` 不超過 80 行
- [ ] 無巢狀超過 3 層的條件判斷

### 組件品質

- [ ] Props 使用 `defineProps<T>()` 定義
- [ ] Emits 使用 `defineEmits<T>()` 定義
- [ ] 組件職責單一
- [ ] 模板中無複雜表達式（已提取為 `computed`）

### 命名一致性

- [ ] 組件檔名 PascalCase
- [ ] Composable 以 `use` 前綴
- [ ] Store 以 `use___Store` 命名
- [ ] 常數使用 `UPPER_SNAKE_CASE`
- [ ] 分支命名符合 `[type]/#[id]-[desc]`
