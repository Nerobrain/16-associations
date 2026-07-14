<script lang="ts">
    import { m } from "$lib/paraglide/messages.js";
    import Tree from "$lib/components/ui/Tree.svelte";

    import { page } from "$app/state";
    import { getRecord } from "$lib/stores/db.svelte";

    let treeData = $state<string[]>([]);
    let loading = $state(true);
    let error = $state<string | null>(null);

    $effect(() => {
        const id = page.params.id;
        if (!id) return;
        getRecord(id)
            .then((record) => {
                if (record) {
                    treeData = record.words;
                } else {
                    error = "Запись не найдена";
                }
            })
            .catch((e) => {
                error = String(e);
            })
            .finally(() => {
                loading = false;
            });
    });
</script>

{#if loading}
    <p>Загрузка...</p>
{:else if error}
    <p style="color: red;">{error}</p>
{:else}
    <Tree nodes={treeData} />
{/if}
