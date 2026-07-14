<script lang="ts">
    import { ParaglideMessage } from "@inlang/paraglide-js-svelte";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let props: Record<string, any> = $props();
    const strongClass = "font-bold";
    const emClass = "italic";
</script>

<ParaglideMessage message={props.message} inputs={props.inputs}>
    {#snippet strong({ children })}
        <span class={strongClass}>{@render children?.()}</span>
    {/snippet}
    {#snippet em({ children })}
        <span class={emClass}>{@render children?.()}</span>
    {/snippet}
    {#snippet br()}
        <br />
    {/snippet}
</ParaglideMessage>
