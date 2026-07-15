<script lang="ts">
    import StyledMessage from "$lib/components/ui/StyledMessage.svelte";
    import { m } from "$lib/paraglide/messages.js";
</script>

<h1 class="text-2xl font-bold">{m.nerobrain_title()}</h1>
<p class="mt-4 text-gray-500 leading-relaxed">
    {m.nerobrain_text()}
    <StyledMessage message={m.nerobrain_philosophy} />
</p>
###
