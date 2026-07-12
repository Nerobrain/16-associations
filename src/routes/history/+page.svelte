<script lang="ts">
    import { onMount } from "svelte";
    import { m } from "$lib/paraglide/messages.js";
    import { settingsStore } from "$lib/stores/settings.svelte";
    import { loadMore } from "$lib/stores/db.svelte";
    import { getLocale } from "$lib/paraglide/runtime.js";

    let records: { id: string; theme: string }[] = $state([]);

    onMount(async () => {
        records = await loadMore(null, 10);
    });

    function dateFromUUID(id: string): Date {
        const hex = id.replace(/-/g, "");
        const ms = Number.parseInt(hex.slice(0, 12), 16);
        return new Date(ms);
    }

    function formatDate(date: Date): string {
        const locale = getLocale();
        switch (settingsStore.dateFormat) {
            case "full":
                return new Intl.DateTimeFormat(locale, {
                    dateStyle: "long",
                    timeStyle: "medium",
                }).format(date);
            case "datetime":
                return new Intl.DateTimeFormat(locale, {
                    dateStyle: "short",
                    timeStyle: "short",
                }).format(date);
            case "date":
                return new Intl.DateTimeFormat(locale, { dateStyle: "short" }).format(date);
            case "iso":
                return date.toISOString();
        }
    }
</script>

<h1 class="text-2xl font-bold mb-6">{m.title_history()}</h1>

{#if records.length === 0}
    <p class="text-gray-500">{m.page_under_development()}</p>
{:else}
    <ul class="space-y-2">
        {#each records as { id, theme } (id)}
            <li
                class="flex justify-between items-center px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
            >
                <span class="font-medium text-gray-800 dark:text-gray-200">{theme}</span>
                <span class="text-sm text-gray-500 dark:text-gray-400">{formatDate(dateFromUUID(id))}</span>
            </li>
        {/each}
    </ul>
{/if}
