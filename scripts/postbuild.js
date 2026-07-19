import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const buildDir = resolve(__dirname, "..", "build");
const base = process.env.BASE_PATH || "";
const normalizedBase = base && !base.startsWith("/") ? `/${base}` : base;

// Copy index.html → 404.html (SPA fallback)
const indexHtml = readFileSync(resolve(buildDir, "index.html"), "utf-8");

// Inject fallback redirect: если SPA не загрузился за 5 секунд — редирект на главную
const fallbackScript = `<script>!function(){var t=setTimeout(function(){location.replace("${normalizedBase}/")},5e3);window.__cancel404Redirect=function(){clearTimeout(t)}}()</script>`;

const patched = indexHtml.replace("</body>", fallbackScript + "</body>");

writeFileSync(resolve(buildDir, "404.html"), patched);
