<script lang="ts">
    import { analysisStore } from "$lib/stores/analysis.svelte";

    import MicIcon from "@iconify-svelte/material-symbols-light/mic";
    import Hint from "$lib/components/ui/Hint.svelte";
    import Tooltip from "../ui/Tooltip.svelte";

    const limit = 16;

    let inputValue = $state("");
    let step = $state(analysisStore.step);

    const hints = [
        "Записывайте первое слово, которое прийдёт в голову.",
        "Не анализируйте. Не ищите «правильный» ответ.",
    ];
    const theme = analysisStore.theme;

    function goBack() {
        if (step == 1) {
            analysisStore.setTheme("");
        } else {
            inputValue = analysisStore.popAnswer();
            step = analysisStore.step;
        }
    }

    function goNext() {
        step = analysisStore.step;
        analysisStore.pushAnswer(inputValue);
        inputValue = "";
    }

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        event.preventDefault(); // предотвращаем отправку формы, если есть
        goNext();
      }
    }
</script>

<h1 class="text-2xl font-bold">Тема: {theme}</h1>

{#if step > 1 && step < limit}
    <h2>{step}.{analysisStore.ansvers[step - 2]}</h2>
{/if}

<div class="mt-6 mb-4">
    <h2 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Ассоциация {step} из {limit}</h2>
    <div class="flex rounded-full overflow-hidden">
        {#each { length: limit }, i}
            <div
                class="h-2 flex-1 transition-colors {i < step ? 'bg-indigo-500 ' : 'bg-gray-200 dark:bg-gray-700'}
                    {i == step - 1 ? 'rounded-r-full' : ''}"
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

<div class="flex justify-between mt-4">
    <button
        onclick={() => goBack()}
        class="px-5 py-1.5 text-sm border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
        Назад
    </button>
    <button
        onclick={() => goNext()}
        disabled={!inputValue}
        class="px-5 py-1.5 text-sm rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
        Далее
    </button>
</div>
