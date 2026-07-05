<script lang="ts">
    type ExternalLink = {
        href: string;
        label: string;
        icon: string;
    };

    const externalLinks: ExternalLink[] = [
        {
            icon: "🚀",
            href: "https://github.com/yourprofile",
            label: "Мои проекты",
        },
        {
            icon: "👤",
            href: "https://linkedin.com/in/yourprofile",
            label: "Обо мне",
        },
    ];

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
            aria-label="Toggle sidebar"
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

        <h1 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
            16 Ассоциаций
        </h1>
    </div>

    <div class="flex items-center gap-4">
        {#each externalLinks as link (link)}
            <!-- eslint-disable-next-line svelte/no-navigation-without-resolve --><a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400
                       hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
                <span>{link.icon}</span>
                <span class="hidden sm:inline">{link.label}</span>
            </a>
        {/each}
    </div>
</header>
