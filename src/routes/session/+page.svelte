<script lang="ts">
    import { analysisStore } from "$lib/stores/analysis.svelte";
    import Intro from "$lib/components/session/Intro.svelte";
</script>

{#if !analysisStore.states.theme}
    <Intro />
{/if}
