# Product Overview

Vue 3 + TypeScript starter application with authentication and a role-based dashboard.

- Login flow with JWT token auth (Bearer token via `localStorage`)
- Auth-guarded routes (dashboard requires login; logged-in users are redirected away from login)
- User roles: `admin`, `editor`, `viewer`
- API layer backed by a generic `ApiResponse<T>` envelope (`{ code, message, data }`)
- UI language is Traditional Chinese (zh-Hant); all code identifiers are English
- Comments and documentation are written in Traditional Chinese
