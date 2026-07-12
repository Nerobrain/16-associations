<script lang="ts">
    import { analysisStore } from "$lib/stores/analysis.svelte";

    import MicIcon from "@iconify-svelte/material-symbols-light/mic";
    import Hint from "$lib/components/ui/Hint.svelte";
    import Tooltip from "../ui/Tooltip.svelte";
    import Progressbar from "../ui/Progressbar.svelte";

    const limit = 16;

    let inputValue = $state("");
    let step = $state(analysisStore.step);

    const hints = [
        "Записывайте первое слово или словосочетание, которое прийдёт в голову.",
        "Не анализируйте. Не ищите «правильный» ответ. Старайтесь не повторяться",
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
        analysisStore.pushAnswer(inputValue);
        step = analysisStore.step;
        inputValue = "";
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            event.preventDefault(); // предотвращаем отправку формы, если есть
            goNext();
        }
    }

    function getSubstep(
        step: number,
        limit: number,
    ): { row: number; rowLimit: number; offset: number; substep: number } {
        const limit_1 = limit; // 16
        const limit_2 = limit_1 / 2; // 8
        const limit_3 = limit_2 / 2; // 4
        const limit_4 = limit_3 / 2; // 2
        const limit_5 = limit_4 / 2; // 1
        const offset_1 = 0;
        const offset_2 = offset_1 + limit_1; // 0 + 16 = 16
        const offset_3 = offset_2 + limit_2; // 16 + 8 = 24
        const offset_4 = offset_3 + limit_3; // 24 + 4 = 28
        const offset_5 = offset_4 + limit_4; // 28 + 2 = 30

        if (step > offset_5) {
            return { row: 5, rowLimit: limit_5, offset: offset_5, substep: step - offset_5 };
        } else if (step > offset_4) {
            return { row: 4, rowLimit: limit_4, offset: offset_4, substep: step - offset_4 };
        } else if (step > offset_3) {
            return { row: 3, rowLimit: limit_3, offset: offset_3, substep: step - offset_3 };
        } else if (step > offset_2) {
            return { row: 2, rowLimit: limit_2, offset: offset_2, substep: step - offset_2 };
        }

        return { row: 1, rowLimit: limit_1, offset: offset_1, substep: step - offset_1 };
    }

    let { rowLimit, offset, substep } = $derived(getSubstep(step, limit));
</script>

<!-- {$inspect(" row=", row, " step=", step, " offset=", offset, " rowLimit=", rowLimit, " substep=", substep)} -->

<div class="mb-4">
    <p>Тема</p>
    <p
        class="w-fit py-1 px-3 bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 rounded-lg"
    >
        {theme}
    </p>
</div>

<div class="mb-4 h-14">
    {#if step > 1 && step <= limit}
        <p>Предыдущее слово</p>
        <p
            class="w-fit py-1 px-3 bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 rounded-lg"
        >
            {step > 1 ? `${analysisStore.ansvers[step - 2]}` : ""}
        </p>
    {:else}
        <p><strong>Что объединяет</strong> эти два слова?</p>
        <div class="flex inset-s-full gap-1">
            <p
                class="w-fit py-1 px-3 bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 rounded-lg"
            >
                {analysisStore.ansvers[offset - rowLimit * 2 + substep * 2 - 2]}
            </p>
            <p class="my-auto">и</p>
            <p
                class="w-fit py-1 px-3 bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 rounded-lg"
            >
                {analysisStore.ansvers[offset - rowLimit * 2 + substep * 2 - 1]}
            </p>
        </div>
    {/if}
</div>

<div class="flex w-full gap-0 mb-4">
    <input
        type="text"
        bind:value={inputValue}
        onkeydown={handleKeydown}
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

<Progressbar title="Ассоциация {substep} из {rowLimit}" step={substep} limit={rowLimit} />

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
