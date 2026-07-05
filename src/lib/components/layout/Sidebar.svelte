<script lang="ts">
    import { page } from "$app/state";
    import { resolve } from "$app/paths";

    type NavItem = {
        href: string;
        label: string;
        icon: string;
    };

    const navItems: NavItem[] = [
        { icon: "📝", href: "/", label: "Новый анализ" },
        { icon: "📖", href: "/info", label: "Инструкция" },
        { icon: "📊", href: "/history", label: "История" },
        { icon: "⚙️", href: "/settings", label: "Настройки" },
    ];

    // Функция проверки активности
    function isActive(itemHref: string): boolean {
        const currentPath = page.url.pathname;
        if (itemHref === "/") {
            return currentPath === "/" || currentPath.startsWith("/step");
        }
        return currentPath === itemHref;
    }
</script>

<aside
    class="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
                  flex flex-col p-4 overflow-y-auto"
>
    <nav class="flex-1 space-y-1">
        {#each navItems as item (item)}
            <a
                href={resolve(item.href)}
                class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
          {isActive(item.href)
                    ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'}"
            >
                <span>{item.icon}</span>
                {item.label}
            </a>
        {/each}
    </nav>

    <div
        class="text-xs text-gray-400 px-2 pt-4 border-t border-gray-200 dark:border-gray-700"
    >
        v1.0.0
    </div>
</aside>
