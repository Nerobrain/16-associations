<script lang="ts">
    import { m } from "$lib/paraglide/messages.js";
    import { page } from "$app/state";
    import { getRecord } from "$lib/stores/db.svelte";
    import { resolve } from "$app/paths";

    let theme = $state("");
    let words = $state<string[]>([]);
    let loading = $state(true);
    let error = $state<string | null>(null);
    let copied = $state(false);

    $effect(() => {
        const id = page.params.id;
        if (!id) return;
        getRecord(id)
            .then((record) => {
                if (record) {
                    theme = record.theme;
                    words = record.words;
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

    let markdown = $derived(buildMarkdown());

    function buildMarkdown(): string {
        if (words.length < 31) return "";
        let md = `# ${m.markdown_prompt_role()}\n\n`;
        md += `# ${m.markdown_prompt_context({ theme: theme })}\n\n`;
        md += `## ${m.markdown_row1()}\n`;
        for (let i = 0; i < 16; i++) {
            md += `${i + 1}. ${words[i]}\n`;
        }
        md += `\n## ${m.markdown_row2()}\n`;
        for (let i = 16; i < 24; i++) {
            md += `${i - 15}. ${words[i]}\n`;
        }
        md += `\n## ${m.markdown_row3()}\n`;
        for (let i = 24; i < 28; i++) {
            md += `${i - 23}. ${words[i]}\n`;
        }
        md += `\n## ${m.markdown_row4()}\n`;
        for (let i = 28; i < 30; i++) {
            md += `${i - 27}. ${words[i]}\n`;
        }
        md += `\n## ${m.markdown_final()}\n`;
        md += `**${words[30]}**\n\n`;
        md += m.markdown_prompt_task();
        return md;
    }

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(markdown);
            copied = true;
            setTimeout(() => (copied = false), 2000);
        } catch {
            const ta = document.createElement("textarea");
            ta.value = markdown;
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
</script>

{#if loading}
    <p>{m.result_loading()}</p>
{:else if error}
    <p class="text-red-500">{error}</p>
{:else}
    <h1 class="text-2xl font-bold">{m.title_markdown()}</h1>

    <section class="mt-6 space-y-6 text-gray-700 leading-relaxed">
        <div>
            <h2 class="text-lg font-semibold text-gray-800 mb-2">{m.markdown_ai_title()}</h2>
            <p>{m.markdown_ai_intro()}</p>
        </div>

        <details class="group bg-amber-50 border border-amber-200 rounded-lg p-4">
            <summary class="text-lg font-semibold text-amber-800 cursor-pointer list-none flex items-center justify-between">
                {m.markdown_warning_title()}
                <span class="text-amber-600 text-sm transition-transform group-open:rotate-180">▼</span>
            </summary>
            <p class="text-amber-700 mt-3">{m.markdown_warning_text()}</p>
        </details>

        <div class="pt-4 border-t border-gray-200">
            <div class="flex items-center justify-between mb-3">
                <h2 class="text-lg font-semibold text-gray-800">{m.markdown_preview()}</h2>
                <button
                    onclick={handleCopy}
                    class="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800 rounded-lg cursor-pointer text-sm font-medium transition-colors"
                >
                    {copied ? m.markdown_copied() : m.markdown_copy_button()}
                </button>
            </div>
            <pre
                class="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-sm overflow-x-auto whitespace-pre-wrap">{markdown}</pre>
        </div>

        <div class="pt-4 border-t border-gray-200">
            <a
                href={page.params.id ? resolve("/goal/[id]", { id: page.params.id }) : "#"}
                class="text-indigo-600 hover:text-indigo-800 underline"
            >
                {m.markdown_back_to_result()}
            </a>
        </div>
    </section>
{/if}
