<script lang="ts">
    import { analysisStore } from "$lib/stores/analysis.svelte";
    import { m } from "$lib/paraglide/messages.js";
    import MicIcon from "@iconify-svelte/material-symbols-light/mic";
    import Hint from "$lib/components/ui/Hint.svelte";
    import Tooltip from "../ui/Tooltip.svelte";

    const limit = 16;
    let inputValue = $state("");

    let step = !analysisStore.states.ansvers ? 1 : analysisStore.states.ansvers.length + 1;

    const hints = [
        "Записывайте первое слово, которое прийдёт в голову",
        "Не анализируйте. Не ищите «правильный» ответ.",
    ];
</script>

<h1 class="text-2xl font-bold">{analysisStore.states.theme}</h1>

<h2>
    {#if step > 1 && step < limit}
        {step}.{analysisStore.states.ansvers[step - 1]}
    {/if}
</h2>

<div class="mt-6 mb-4">
    <h2 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Ассоциация {step} из {limit}</h2>
    <div class="flex rounded-full overflow-hidden">
        {#each { length: limit }, i}
            <div
                class="h-2 flex-1 transition-colors {i < step
                    ? 'bg-indigo-500 rounded-full'
                    : 'bg-gray-200 dark:bg-gray-700'}"
            ></div>
        {/each}
    </div>
</div>

<div class="flex w-full gap-0 mb-4">
    <input
        type="text"
        bind:value={inputValue}
        placeholder="Введите ассоциацию..."
        class="flex-11/12 md:flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600"
    />
    <button
        disabled
        class="px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 text-gray-400 cursor-not-allowed"
    >
        <MicIcon class="w-5 h-5" />
    </button>
    <Tooltip text={hints} containerClass="flex-1 px-2 py-2 m-auto" />
</div>

<Hint text={hints} />
