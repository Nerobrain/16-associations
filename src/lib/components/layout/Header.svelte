<script lang="ts">
    import { m } from "$lib/paraglide/messages.js";
    import Cognition2Icon from "@iconify-svelte/material-symbols-light/cognition-2";
    import { resolve } from "$app/paths";

    let {
        ontogglesidebar = () => {},
        sidebaropen = false,
    }: {
        ontogglesidebar: () => void;
        sidebaropen: boolean;
    } = $props();
</script>

<header
    class="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700
           flex items-center justify-between px-4 md:px-6"
>
    <div class="flex items-center gap-3">
        <button
            onclick={ontogglesidebar}
            class="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-400
                   hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={m.toggle_sidebar()}
        >
            {#if sidebaropen}
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            {:else}
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            {/if}
        </button>

        <Cognition2Icon height="2em" class="text-gray-600 dark:text-gray-200" />

        <h1 class="text-lg font-semibold text-gray-800 dark:text-gray-200">{m.app_title()}</h1>
    </div>

    <div class="flex items-center gap-4">
        <a
            href={resolve("/")}
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400
                       hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
            <!-- @ts-ignore -->
            <enhanced:img src="$lib/assets/nerobrain.png?w=24" alt="nerobrain" />
            <span class="hidden sm:inline">{m.about_me()}</span>
        </a>
    </div>
</header>
