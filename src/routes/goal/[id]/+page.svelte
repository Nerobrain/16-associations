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

    // Панорамирование и масштабирование
    let panX = $state(0);
    let panY = $state(0);
    let zoom = $state(1);

    let lastTouchX = $state(0);
    let lastTouchY = $state(0);
    let lastDist = $state(0);
    let panning = $state(false);

    function dist(a: Touch, b: Touch): number {
        return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    }

    function handleTouchStart(e: TouchEvent) {
        if (e.touches.length === 1) {
            panning = true;
            lastTouchX = e.touches[0].clientX;
            lastTouchY = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
            panning = false;
            lastDist = dist(e.touches[0], e.touches[1]);
        }
    }

    function handleTouchMove(e: TouchEvent) {
        e.preventDefault();
        if (e.touches.length === 1 && panning) {
            panX += e.touches[0].clientX - lastTouchX;
            panY += e.touches[0].clientY - lastTouchY;
            lastTouchX = e.touches[0].clientX;
            lastTouchY = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
            const d = dist(e.touches[0], e.touches[1]);
            zoom *= d / lastDist;
            zoom = Math.max(0.3, Math.min(3, zoom));
            lastDist = d;
        }
    }

    function handleTouchEnd() {
        panning = false;
    }

    let showTree = $state(false);
</script>

{#if loading}
    <p>Загрузка...</p>
{:else if error}
    <p style="color: red;">{error}</p>
{:else}
    <button
        onclick={() => (showTree = !showTree)}
        class="mb-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg cursor-pointer"
    >
        {showTree ? "Скрыть дерево" : "Показать дерево ассоциаций"}
    </button>

    {#if showTree}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            style="overflow: hidden; touch-action: none; width: 100%; height: 100dvh; position: relative;"
            ontouchstart={handleTouchStart}
            ontouchmove={handleTouchMove}
            ontouchend={handleTouchEnd}
        >
            <div style="transform: translate({panX}px, {panY}px) scale({zoom}); transform-origin: 0 0;">
                <Tree nodes={treeData} />
            </div>
        </div>
    {/if}
{/if}
