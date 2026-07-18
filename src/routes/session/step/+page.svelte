<script lang="ts">
  import { analysisStore } from "$lib/stores/analysis.svelte";

  import InputGroup from "$lib/components/ui/InputGroup.svelte";
  import Hint from "$lib/components/ui/Hint.svelte";
  import Tooltip from "$lib/components/ui/Tooltip.svelte";
  import Progressbar from "$lib/components/ui/Progressbar.svelte";
  import { saveRecord } from "$lib/stores/db.svelte";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import Bubble from "$lib/components/ui/Bubble.svelte";
  import Label from "$lib/components/ui/Label.svelte";
  import { m } from "$lib/paraglide/messages.js";

  const limit = 16;

  let inputValue = $state("");
  let step = $state(analysisStore.step);

  const hints = [m.step_hint_1(), m.step_hint_2()];
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
      saveRecord(analysisStore.theme, [...analysisStore.answers])
        .then((id) => {
          analysisStore.flush();
          goto(resolve(`/goal/[id]`, { id }));
        })
        .catch(() => {});
    }
    inputValue = "";
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault(); // предотвращаем отправку формы, если есть
      goNext();
    }
  }

  function getSubstep(step: number, limit: number): { row: number; rowLimit: number; offset: number; substep: number } {
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

<div class="mb-4">
  <Label><strong>{m.step_label_topic()}</strong></Label>
  <Bubble title={theme} />
</div>

<div class="mb-4 min-h-14">
  {#if step > 1 && step <= limit}
    <Label><strong>{m.step_label_previous()}</strong></Label>
    <Bubble title={step > 1 ? `${analysisStore.answers[step - 2]}` : ""} />
  {:else if step > limit}
    <Label><strong>{m.step_combine_bold()}</strong>{m.step_combine_rest()}</Label>
    <div class="flex flex-wrap gap-1">
      <Bubble title={analysisStore.answers[offset - rowLimit * 2 + substep * 2 - 2]} />
      <p class="text-center my-auto">{m.step_and()}</p>
      <Bubble title={analysisStore.answers[offset - rowLimit * 2 + substep * 2 - 1]} />
    </div>
  {/if}
</div>

<div class="flex w-full gap-0 mb-4">
  <InputGroup bind:value={inputValue} onkeydown={handleKeydown} placeholder={m.step_input_placeholder()} />
  <Tooltip text={hints} containerClass="flex-1 px-2 py-2 m-auto" />
</div>

<Hint text={hints} />

<Progressbar title={m.step_progress({ substep, limit: rowLimit })} step={substep} limit={rowLimit} />

<div class="flex justify-between mt-4">
  <button
    onclick={() => goBack()}
    class="px-5 py-1.5 text-sm border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
  >
    {m.step_back()}
  </button>
  <button
    onclick={() => goNext()}
    disabled={!inputValue}
    class="px-5 py-1.5 text-sm rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {m.step_next()}
  </button>
</div>
