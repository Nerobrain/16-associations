<script lang="ts">
  import { m } from "$lib/paraglide/messages.js";
  import { page } from "$app/state";
  import { getRecord } from "$lib/stores/db.svelte";
  import ContentCopyIcon from "@iconify-svelte/material-symbols-light/content-copy";
  import { resolve } from "$app/paths";

  let loading = $state(true);
  let error = $state<string | null>(null);
  let jsonText = $state("");
  let copied = $state(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(jsonText);
      copied = true;
      setTimeout(() => (copied = false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = jsonText;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.append(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      copied = true;
      setTimeout(() => (copied = false), 2000);
    }
  }

  $effect(() => {
    const id = page.params.id;
    if (!id) return;
    getRecord(id)
      .then((record) => {
        if (record) {
          jsonText = JSON.stringify({ theme: record.theme, words: record.words }, null, 2);
        } else {
          error = m.result_not_found();
        }
      })
      .catch((e) => {
        error = String(e);
      })
      .finally(() => {
        loading = false;
      });
  });
</script>

<h1 class="text-2xl font-bold">{m.title_json()}</h1>

{#if loading}
  <p>{m.result_loading()}</p>
{:else if error}
  <p class="text-red-500">{error}</p>
{:else}
  <p class="mt-4 text-gray-500 dark:text-gray-400">
    Здесь вы можете скопировать данные в формате JSON для переноса на другое устройство. Например, если закончили сессию
    на компьютере, но захотели перенести на смартфон
  </p>

  <div class="relative mt-4">
    <textarea
      readonly
      class="w-full h-96 font-mono text-sm p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 resize-y"
      >{jsonText}</textarea
    >
    <button
      onclick={handleCopy}
      class="absolute top-2 right-2 p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
      title={copied ? m.text_copied() : m.text_copy_button()}
    >
      {#if copied}
        <span class="text-xs text-indigo-500 font-medium">{m.text_copied()}</span>
      {:else}
        <ContentCopyIcon class="w-5 h-5" />
      {/if}
    </button>
  </div>
  <div class="pt-4 border-t border-gray-200">
    <a
      href={page.params.id ? resolve("/goal/[id]", { id: page.params.id }) : "#"}
      class="text-indigo-600 hover:text-indigo-800 underline"
    >
      {m.markdown_back_to_result()}
    </a>
  </div>
{/if}
