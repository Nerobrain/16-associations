<script lang="ts">
  import { onMount } from "svelte";
  import { m } from "$lib/paraglide/messages.js";
  import { settingsStore } from "$lib/stores/settings.svelte";
  import { loadMore } from "$lib/stores/db.svelte";
  import { getLocale } from "$lib/paraglide/runtime.js";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";

  import AccountTreeIcon from "@iconify-svelte/material-symbols-light/account-tree";
  import PictureAsPdfIcon from "@iconify-svelte/material-symbols-light/picture-as-pdf";
  import MarkdownIcon from "@iconify-svelte/material-symbols-light/markdown";
  import FileJsonIcon from "@iconify-svelte/material-symbols-light/file-json";

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
  <p class="text-gray-500">{m.history_empty()} <a href={resolve("/session")}>{m.history_empty_session()}</a>.</p>
{:else}
  <ul class="space-y-2">
    {#each records as { id, theme } (id)}
      <li
        class="flex flex-col-reverse md:flex-row px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
      >
        <div class="flex flex-col-reverse md:flex-row justify-between w-full my-auto">
          <span class="font-medium text-gray-800 dark:text-gray-200">{theme}</span>
          <span class="text-xs align-text-bottom text-gray-500 dark:text-gray-400">{formatDate(dateFromUUID(id))}</span>
        </div>
        <div class="flex items-center gap-0">
          <button
            title={m.result_view()}
            onclick={() => goto(resolve(`/goal/[id]`, { id: id }))}
            class="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
          >
            <AccountTreeIcon class="w-5 h-5" />
          </button>
          <button
            title={m.result_export_pdf()}
            onclick={() => goto(resolve("/pdf/[id]", { id }))}
            class="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
          >
            <PictureAsPdfIcon class="w-5 h-5" />
          </button>
          <button
            title={m.result_export_md()}
            onclick={() => goto(resolve("/markdown/[id]", { id }))}
            class="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
          >
            <MarkdownIcon class="w-5 h-5" />
          </button>
          <button
            title={m.result_export_json()}
            onclick={() => goto(resolve("/json/[id]", { id }))}
            class="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
          >
            <FileJsonIcon class="w-5 h-5" />
          </button>
        </div>
      </li>
    {/each}
  </ul>
{/if}
