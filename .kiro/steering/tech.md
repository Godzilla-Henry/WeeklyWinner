# Tech Stack

| Layer            | Technology                                      |
| ---------------- | ----------------------------------------------- |
| Framework        | Vue 3 (`<script setup>` SFC, Composition API)   |
| Language         | TypeScript 5 — `strict: true`, no `any`         |
| Build            | Vite 6                                          |
| State management | Pinia 2 + `pinia-plugin-persistedstate`         |
| Routing          | Vue Router 4 (HTML5 history mode)               |
| Styling          | Tailwind CSS 4 (`@tailwindcss/vite`) + shadcn-vue (CSS Variables) |
| UI Components    | shadcn-vue (Card, Table, Badge, Tabs, Separator) + reka-ui primitives |
| HTTP             | Native `fetch` wrapper (`src/api/http.ts`)      |
| Linting          | ESLint 9 (flat config) + `typescript-eslint` + `eslint-plugin-vue` |
| Formatting       | Prettier 3 + `prettier-plugin-tailwindcss`      |

## Path Alias

`@` → `src/` (configured in both `vite.config.ts` and `tsconfig.app.json`)

## Environment Variables

Prefixed with `VITE_`. See `.env.example`:

- `VITE_API_BASE_URL` — API base path (default `/api`)

## Common Commands

```bash
# Start dev server (port 5173)
npm run dev

# Type-check only
npm run type-check

# Production build (type-check then vite build)
npm run build

# Preview production build
npm run preview

# Lint and auto-fix
npm run lint

# Format source files
npm run format
```

## Key TypeScript Rules

- `strict: true` with `noUnusedLocals`, `noUnusedParameters`, `noUncheckedIndexedAccess`
- All functions must have explicit return types (ESLint enforced)
- Use `type` imports: `import type { Foo } from '...'` (ESLint enforced)
- No `any` — use `unknown` + type guards instead
- No `as` type assertions — use generics or type guards
- Prefer `interface` over `type` for object shapes

## Prettier Config

- Single quotes, semicolons required, trailing commas everywhere
- 2-space indent, 100 char print width, LF line endings

## ESLint Highlights

- `vue/block-order`: script → template → style
- `vue/define-macros-order`: defineProps before defineEmits
- `no-console`: warn (allow `console.warn` and `console.error`)
- `no-debugger`: error
