<script lang="ts">
    import { v7 as uuidv7 } from "uuid";
    import { analysisStore } from "$lib/stores/analysis.svelte";

    import InputGroup from "$lib/components/ui/InputGroup.svelte";
    import Hint from "$lib/components/ui/Hint.svelte";
    import Tooltip from "../ui/Tooltip.svelte";
    import Progressbar from "../ui/Progressbar.svelte";
    import { saveRecord } from "$lib/stores/db.svelte";
    import { goto } from "$app/navigation";
    import { resolve } from "$app/paths";
    import Bubble from "../ui/Bubble.svelte";

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
            goto(resolve("/session/new"));
        } else {
            inputValue = analysisStore.popAnswer();
            step = analysisStore.step;
        }
    }

    function goNext() {
        analysisStore.pushAnswer(inputValue);
        step = analysisStore.step;
        if (step > 31) {
            const id = uuidv7();
            saveRecord(id, analysisStore.theme, [...analysisStore.ansvers])
                .then(() => analysisStore.flush())
                .catch(() => {});
            goto(resolve(`/goal/[id]`, { id }));
        }
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
    <p>Ваш запрос</p>
    <Bubble title={theme} />
</div>

<div class="mb-4 h-14">
    {#if step > 1 && step <= limit}
        <p>Предыдущее слово</p>
        <Bubble title={step > 1 ? `${analysisStore.ansvers[step - 2]}` : ""} />
    {:else if step > limit}
        <p><strong>Что объединяет</strong> эти два слова?</p>
        <div class="flex inset-s-full gap-1">
            <Bubble title={analysisStore.ansvers[offset - rowLimit * 2 + substep * 2 - 2]} />
            <p class="my-auto">и</p>
            <Bubble title={analysisStore.ansvers[offset - rowLimit * 2 + substep * 2 - 1]} />
        </div>
    {/if}
</div>

<div class="flex w-full gap-0 mb-4">
    <InputGroup bind:value={inputValue} onkeydown={handleKeydown} placeholder="Введите ассоциацию..." />
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
