<script lang="ts">
    import { analysisStore } from "$lib/stores/analysis.svelte";
    import Intro from "$lib/components/session/Intro.svelte";
    import StepOne from "$lib/components/session/StepOne.svelte";
</script>

{#if !analysisStore.theme}
    <Intro />
{:else if !analysisStore.ansvers || analysisStore.ansvers.length < 32}
    <StepOne />
{/if}
