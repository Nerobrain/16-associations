<script lang="ts">
    import { analysisStore } from "$lib/stores/analysis.svelte";
    import Intro from "$lib/components/session/Intro.svelte";
    import StepOne from "$lib/components/session/StepOne.svelte";
</script>

{#if !analysisStore.states.theme}
    <Intro />
{:else if !analysisStore.states.ansvers || analysisStore.states.ansvers.length < 16}
    <StepOne />
{/if}
