<script lang="ts">
    import type { Snippet } from "svelte";

    let { children, addClass }: { children: Snippet; addClass?: string } = $props();
</script>

<h2 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 {addClass}">
    {@render children()}
</h2>
