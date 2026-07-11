<script lang="ts">
    let { title, step, limit }: { title: string; step: number; limit: number } = $props();
</script>

<div class="mt-6 mb-4">
    <h2 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{title}</h2>
    <div class="flex rounded-full overflow-hidden">
        {#each { length: limit }, i}
            <div
                class="h-2 flex-1 transition-colors {i < step ? 'bg-indigo-500 ' : 'bg-gray-200 dark:bg-gray-700'}
                    {i == step - 1 ? 'rounded-r-full' : ''}"
            ></div>
        {/each}
    </div>
</div>
