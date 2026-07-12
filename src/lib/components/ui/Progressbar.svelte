<script lang="ts">
    import Label from "./Label.svelte";

    let { title, step, limit }: { title: string; step: number; limit: number } = $props();
</script>

<div class="mt-6 mb-4">
    <Label>{title}</Label>
    <div class="flex rounded-full overflow-hidden">
        {#each { length: limit }, i}
            <div
                class="h-2 flex-1 transition-colors {i < step ? 'bg-indigo-500 ' : 'bg-gray-200 dark:bg-gray-700'}
                    {i == step - 1 ? 'rounded-r-full' : ''}"
            ></div>
        {/each}
    </div>
</div>
