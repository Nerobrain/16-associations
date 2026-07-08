<script lang="ts">
    import { analysisStore } from "$lib/stores/analysis.svelte";
    import { m } from "$lib/paraglide/messages.js";

    let inputValue = $state("");

    function handleSave() {
        analysisStore.setTheme(inputValue);
    }
</script>

<h1 class="text-2xl font-bold">{m.intro_heading()}</h1>

<div class="text-base">{m.intro_description()}</div>

<textarea
    name="theme"
    id="theme"
    bind:value={inputValue}
    placeholder={m.intro_placeholder()}
    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
></textarea>

<button
    onclick={handleSave}
    class="mt-4 w-20 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
>
    {m.intro_start_button()}
</button>
