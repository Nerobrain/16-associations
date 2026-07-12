<script lang="ts">
    import { analysisStore } from "$lib/stores/analysis.svelte";
    import { m } from "$lib/paraglide/messages.js";
    import InputGroup from "$lib/components/ui/InputGroup.svelte";
    import { goto } from "$app/navigation";
    import { resolve } from "$app/paths";

    let inputValue = $state(analysisStore.theme);

    function goNext() {
        analysisStore.setTheme(inputValue);
        goto(resolve("/session/step"));
    }
    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            event.preventDefault();
            goNext();
        }
    }
</script>

<h1 class="text-2xl font-bold">{m.intro_heading()}</h1>

<div class="text-base">{m.intro_description()}</div>

<InputGroup bind:value={inputValue} onkeydown={handleKeydown} placeholder={m.intro_placeholder()} />

<button
    disabled={!inputValue}
    onclick={goNext}
    class="mt-4 w-20 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
>
    {m.intro_start_button()}
</button>
