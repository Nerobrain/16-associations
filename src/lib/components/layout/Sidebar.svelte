<script lang="ts">
    import { page } from "$app/state";
    import { resolve } from "$app/paths";
    import { m } from "$lib/paraglide/messages.js";
    import { setLocale, locales } from "$lib/paraglide/runtime";

    type Locale = (typeof locales)[number];

    type NavItem = {
        href: "/" | "/info" | "/history" | "/settings";
        icon: string;
    };

    const navItems: NavItem[] = [
        { icon: "📝", href: "/" },
        { icon: "📖", href: "/info" },
        { icon: "📊", href: "/history" },
        { icon: "⚙️", href: "/settings" },
    ];

    type LocaleBtn = {
        icon: string;
        name: Locale;
    };
    const localeBtns: LocaleBtn[] = [
        { icon: "🇷🇺", name: "ru" },
        { icon: "🇺🇸", name: "en" },
    ];

    function navLabel(href: string): string {
        switch (href) {
            case "/":
                return m.nav_new_analysis();
            case "/info":
                return m.nav_instructions();
            case "/history":
                return m.nav_history();
            case "/settings":
                return m.nav_settings();
            default:
                return "";
        }
    }

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
                {navLabel(item.href)}
            </a>
        {/each}
    </nav>

    <div class="text-xs text-gray-400 px-2 pt-4 pb-4">
        {m.all_data_is_local()}
    </div>
    <div
        class="text-xs text-gray-400 px-2 pt-4 border-t border-gray-200 dark:border-gray-700"
    >
        <div class="flex items-center justify-between">
            <span>v1.0.0</span>
            <div class="flex items-center gap-1">
                {#each localeBtns as btn (btn)}
                    <button class="px-1" onclick={() => setLocale(btn.name)}>
                        {btn.icon}
                    </button>
                {/each}
            </div>
        </div>
    </div>
</aside>
