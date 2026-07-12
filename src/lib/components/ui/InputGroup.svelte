<script lang="ts">
    import MicIcon from "@iconify-svelte/material-symbols-light/mic";

    let {
        value = $bindable(),
        placeholder,
        onkeydown,
    }: { value: string; placeholder?: string; onkeydown?: (e: KeyboardEvent) => void } = $props();
</script>

<div class="flex w-full gap-0">
    <input
        type="text"
        bind:value
        {onkeydown}
        {placeholder}
        class="flex-11/12 md:flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600"
    />
    <button
        disabled
        class="px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 text-gray-400 cursor-not-allowed"
    >
        <MicIcon class="w-5 h-5" />
    </button>
</div>
