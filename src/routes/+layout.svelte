<script lang="ts">
    import type { Pathname } from "$app/types";
    import { resolve } from "$app/paths";
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
</svelte:head>

<MainLayout>
    {@render children()}
</MainLayout>

<div style="display:none">
    {#each locales as locale (locale)}
        <a href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}>{locale}</a>
    {/each}
</div>
