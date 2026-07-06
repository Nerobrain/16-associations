<script lang="ts">
    import { resolve } from "$app/paths";
    import { m } from "$lib/paraglide/messages.js";
</script>

<h1 class="text-3xl font-bold underline">{m.greeting()}</h1>

<h1>{m.welcome_message()}</h1>
<p>
    {m.visit_prefix()} <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> {m.visit_suffix()}
</p>

<a href={resolve("/demo/paraglide")}>{m.paraglide_link()}</a>
