<script lang="ts">
  import { asset } from "$app/paths";
  import { page } from "$app/state";
  import { locales, localizeHref } from "$lib/paraglide/runtime";
  import { settingsStore } from "$lib/stores/settings.svelte";
  import "./layout.css";
  import MainLayout from "$lib/components/layout/MainLayout.svelte";

  let { children } = $props();

  function applyTheme(theme: string) {
    const isDark =
      theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
    document.querySelector('meta[name="color-scheme"]')?.setAttribute("content", isDark ? "dark" : "light");
  }

  $effect(() => {
    const t = settingsStore.theme;
    applyTheme(t);

    if (t !== "system") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  });
</script>

<svelte:head>
  <meta name="color-scheme" content="light" />
  <meta name="theme-color" content="#6366f1" />
  <meta name="application-name" content="16 Associations" />
  <link rel="apple-touch-icon" sizes="180x180" href={asset("/apple-touch-icon.png")} />
  <link rel="icon" type="image/png" sizes="32x32" href={asset("/favicon-32x32.png")} />
  <link rel="icon" type="image/png" sizes="16x16" href={asset("/favicon-16x16.png")} />
  <link rel="icon" type="image/svg+xml" href={asset("/logo.svg")} />
  <link rel="manifest" href={asset("/site.webmanifest")} />
</svelte:head>

<MainLayout>
  {@render children()}
</MainLayout>

<div style="display:none">
  {#each locales as locale (locale)}
    <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
    <a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
  {/each}
</div>
