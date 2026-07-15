import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { enhancedImages } from "@sveltejs/enhanced-img";

const base = process.env.BASE_PATH || "";
const normalizedBase = base && (!base.startsWith("/") ? `/${base}` : base);

export default defineConfig({
    plugins: [
        enhancedImages(),
        tailwindcss(),
        sveltekit({
            compilerOptions: {
                // Force runes mode for the project, except for libraries. Can be removed in svelte 6.
                runes: ({ filename }) => (filename.split(/[/\\]/).includes("node_modules") ? undefined : true),
            },
            adapter: adapter({
                precompress: true,
                fallback: "404.html",
            }),
            paths: {
                base: process.argv.includes("dev") ? "" : (normalizedBase as "" | `/${string}`),
            },
            prerender: {
                handleUnseenRoutes: "ignore",
            },
        }),
        paraglideVitePlugin({
            project: "./project.inlang",
            outdir: "./src/lib/paraglide",
        }),
    ],
    server: {
        watch: {
            // Включаем опрос файлов вместо использования системных событий
            usePolling: true,
            // Интервал опроса в миллисекундах (меньше — быстрее, но больше нагрузка)
            interval: 500,
            // Если папка с проектом большая, можно исключить node_modules из опроса
            ignored: ["**/node_modules/**"],
        },
    },
});
