<script lang="ts">
    import { m } from "$lib/paraglide/messages.js";
    import Tree from "$lib/components/ui/Tree.svelte";
    import PictureAsPdfIcon from "@iconify-svelte/material-symbols-light/picture-as-pdf";
    import MarkdownIcon from "@iconify-svelte/material-symbols-light/markdown";

    import { page } from "$app/state";
    import { getRecord } from "$lib/stores/db.svelte";

    let theme = $state("");
    let treeData = $state<string[]>([]);
    let loading = $state(true);
    let error = $state<string | null>(null);

    $effect(() => {
        const id = page.params.id;
        if (!id) return;
        getRecord(id)
            .then((record) => {
                if (record) {
                    theme = record.theme;
                    treeData = record.words;
                } else {
                    error = m.result_not_found();
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
    <p>{m.result_loading()}</p>
{:else if error}
    <p style="color: red;">{error}</p>
{:else}
    <div class="flex flex-col items-center gap-4 max-w-xl mx-auto">
        <p class="text-sm text-gray-400">{m.result_theme({ theme })}</p>
        
        <p class="text-4xl text-center font-bold mt-8">{treeData[treeData.length - 1]}</p>
        <p class="text-sm text-gray-400 -mt-3">{m.result_deep_image()}</p>

        <div class="flex gap-4 mt-4 text-xl">
            <span>{treeData[treeData.length - 2]}</span>
            <span>{treeData[treeData.length - 3]}</span>
        </div>
        <p class="text-sm text-gray-400 -mt-3">{m.result_two_keys()}</p>

        <ul class="text-sm space-y-1 mt-4 list-disc list-inside text-gray-600 dark:text-gray-300">
            <li>{m.result_q1()}</li>
            <li>{m.result_q2()}</li>
            <li>{m.result_q3()}</li>
        </ul>

        <p class="text-sm text-gray-500 italic mt-4 text-center">
            {@html m.result_recommendation()}
        </p>

        <div class="flex items-center gap-3 mt-6">
            <button
                onclick={() => (showTree = !showTree)}
                class="px-4 py-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg cursor-pointer text-sm"
            >
                {showTree ? m.result_hide_tree() : m.result_show_tree()}
            </button>
            <button
                title={m.result_export_pdf()}
                class="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
            >
                <PictureAsPdfIcon class="w-5 h-5" />
            </button>
            <button
                title={m.result_export_md()}
                class="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
            >
                <MarkdownIcon class="w-5 h-5" />
            </button>
        </div>
    </div>

    {#if showTree}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class="mt-4"
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
