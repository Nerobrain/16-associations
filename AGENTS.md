# AGENTS.md

Общение на русском языке.

## Команды

| Команда | Что делает |
|---|---|
| `npm run dev` | Vite dev server (file polling включён для WSL) |
| `npm run build` | production build (adapter-static, SPA) |
| `npm run preview` | preview собранного сайта |
| `npm run check` | `svelte-kit sync && svelte-check` — **единственный typecheck** |
| `npm run lint` | ESLint — единственный линтер |

Тестов и форматтера (`prettier`) нет. Перед коммитом: `npm run lint && npm run check`.

## Svelte 5

- **Runes mode включён принудительно** во всех файлах, кроме node_modules (`vite.config.ts:18`). Не используй `export let`, `$:`, `on:click` и т.п.
- Состояние: `.svelte.ts` модули с `$state`, `$derived`, `$effect` (не Svelte stores).
- `npm run prepare` = `svelte-kit sync` (генерация типов `.svelte-kit/`). Запускается автоматически при `npm install`.

## Проект

- **i18n**: Paraglide, базовая локаль `ru`, вторая `en`. Сгенерированные файлы: `src/lib/paraglide/` (gitignored).
- **CSS**: Tailwind v4 — `@import 'tailwindcss'` в `src/routes/layout.css`. `tailwind.config.js` нет.
- **Тёмная тема**: class-based через `@variant dark (&:where(.dark, .dark *))` в `layout.css`. Переключение в настройках (system/light/dark), по умолчанию `system`. Класс `.dark` на `<html>` управляется из `+layout.svelte`.
- **Хранение**: текущая сессия — `localStorage` (ключ `analysis`), история — IndexedDB (`16Associations` / `sessions`).
- **Роутинг**: SPA (adapter-static, `fallback: "404.html"`), `trailingSlash: "always"`.
- **Сборка**: `postbuild` копирует `build/index.html` → `build/404.html` для SPA fallback. `handleUnseenRoutes: 'ignore'` в `vite.config.ts` — динамические `[id]` маршруты не пререндерятся.

## Окружение

- `engine-strict=true` в `.npmrc` — требует Node >=22.
- TypeScript strict mode, `rewriteRelativeImportExtensions: true`.
- `BASE_PATH` env var для деплоя не в корень.
