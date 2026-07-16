<script lang="ts">
  import { onMount } from "svelte";
  import { m } from "$lib/paraglide/messages.js";
  import { settingsStore } from "$lib/stores/settings.svelte";
  import { loadMore, saveRecord } from "$lib/stores/db.svelte";
  import { getLocale } from "$lib/paraglide/runtime.js";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import DatabaseUploadOutlineIcon from "@iconify-svelte/material-symbols-light/database-upload-outline";

  let records: { id: string; theme: string }[] = $state([]);
  let importJson = $state("");
  let importError = $state<string | null>(null);
  let loading = $state(true);
  let loadingMore = $state(false);

  let sentinel = $state<HTMLDivElement | null>(null);

  $effect(() => {
    const el = sentinel;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          loadNext();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  });

  onMount(async () => {
    records = await loadMore(null, 10);
    loading = false;
  });

  async function loadNext() {
    if (records.length === 0) return;
    loadingMore = true;
    const lastId = records[records.length - 1].id;
    const next = await loadMore(lastId, 10);
    records = [...records, ...next];
    loadingMore = false;
  }

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

  function importValid(): boolean {
    try {
      const obj = JSON.parse(importJson);
      return typeof obj.theme === "string" && Array.isArray(obj.words) && obj.words.length === 31;
    } catch {
      return false;
    }
  }

  async function handleImport() {
    try {
      const obj = JSON.parse(importJson);
      const id = await saveRecord(obj.theme, obj.words);
      records = [{ id, theme: obj.theme }, ...records];
      importJson = "";
      importError = null;
    } catch (e) {
      importError = String(e);
    }
  }
</script>

<h1 class="text-2xl font-bold mb-6">{m.title_history()}</h1>

<div class="flex items-center gap-2 mb-4">
  <input
    type="text"
    bind:value={importJson}
    placeholder="Вставьте JSON для импорта"
    class="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 outline-none focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors"
  />
  <button
    onclick={handleImport}
    disabled={!importValid()}
    class="p-2 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
    title="Импортировать запись"
  >
    <DatabaseUploadOutlineIcon class="w-5 h-5" />
  </button>
</div>

{#if importError}
  <p class="text-red-500 text-sm mb-4">{importError}</p>
{/if}

{#if loading}
  <p class="text-gray-500 text-sm py-8 text-center">{m.result_loading()}</p>
{:else if records.length === 0}
  <p class="text-gray-500">{m.history_empty()} <a href={resolve("/session")}>{m.history_empty_session()}</a>.</p>
{:else}
  {#each records as { id, theme } (id)}
    <div
      class="flex flex-col-reverse md:flex-row justify-between px-4 py-3 mb-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 w-full my-auto cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      onclick={() => goto(resolve("/goal/[id]", { id }))}
      onkeydown={(e) => e.key === "Enter" && goto(resolve("/goal/[id]", { id }))}
      role="link"
      tabindex="0"
    >
      <span class="font-medium text-gray-800 dark:text-gray-200">{theme}</span>
      <span class="text-xs align-text-bottom text-gray-500 dark:text-gray-400">{formatDate(dateFromUUID(id))}</span>
    </div>
  {/each}

  <div bind:this={sentinel} class="h-4"></div>

  {#if loadingMore}
    <p class="text-center text-sm text-gray-400 py-4">Загрузка...</p>
  {/if}
{/if}
