<script lang="ts">
    import InfoIcon from "@iconify-svelte/material-symbols-light/info-outline";
    import LightbulbIcon from "@iconify-svelte/material-symbols-light/lightbulb-outline";

    let { text, containerClass }: { text: string | string[]; containerClass: string } = $props();

    let open = $state(false);

    function toggle() {
        open = !open;
    }
</script>

<div class="flex-1 group relative md:hidden {containerClass}">
    <button
        class="md:hidden flex text-indigo-600 hover:text-indigo-400 transition-colors"
        onclick={toggle}
        onmouseenter={() => (open = true)}
        onmouseleave={() => (open = false)}
    >
        <InfoIcon class="w-5 h-5" />
    </button>

    {#if open}
        <div
            id="tooltip"
            class="absolute left-full -translate-x-full top-full mt-2 z-50 flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 rounded-lg shadow-lg w-max max-w-[calc(100vw-4rem)]"
        >
            <LightbulbIcon class="w-5 h-5 text-indigo-600  shrink-0 mt-0.5" />
            <div class="text-sm text-gray-700 dark:text-gray-300">
                {#if Array.isArray(text)}
                    <ul>
                        {#each text, i}
                            <li>{text[i]}</li>
                        {/each}
                    </ul>
                {:else}
                    {text}
                {/if}
            </div>
        </div>
    {/if}
</div>
