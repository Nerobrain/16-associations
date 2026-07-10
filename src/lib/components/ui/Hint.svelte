<script lang="ts">
    import LightbulbIcon from "@iconify-svelte/material-symbols-light/lightbulb-outline";

    let { text }: { text: string | string[] } = $props();
</script>

<div
    class="hidden md:flex justify-content-center items-start gap-2 p-3 bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 rounded-lg"
>
    <LightbulbIcon class="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
    {#if Array.isArray(text)}
        <p class="text-sm text-gray-500 dark:text-gray-400">
            {#each text, i}
                {text[i]}{#if i < text.length - 1}<br />{/if}
            {/each}
        </p>
    {:else}
        <p class="text-sm text-gray-500 dark:text-gray-400">{text}</p>
    {/if}
</div>
