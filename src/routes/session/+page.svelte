<script lang="ts">
    import { analysisStore } from "$lib/stores/analysis.svelte";
    import { goto } from "$app/navigation";
    import { resolve } from "$app/paths";
    import { onMount } from "svelte";

    onMount(() => {
        if (!analysisStore.theme) {
            goto(resolve("/session/new"));
        } else {
            goto(resolve("/session/step"));
        }
    });
</script>
