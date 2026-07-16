<script lang="ts">
  import { page } from "$app/state";
  import { resolve } from "$app/paths";
  import { m } from "$lib/paraglide/messages.js";
  import { setLocale, locales } from "$lib/paraglide/runtime";
  import MenuBookOutlineIcon from "@iconify-svelte/material-symbols-light/menu-book-outline";
  import AddNotesOutlineIcon from "@iconify-svelte/material-symbols-light/add-notes-outline";
  import SourceNotesOutlineIcon from "@iconify-svelte/material-symbols-light/source-notes-outline";
  import SettingsOutlineIcon from "@iconify-svelte/material-symbols-light/settings-outline";
  type Locale = (typeof locales)[number];

  type NavItem = {
    icon: typeof MenuBookOutlineIcon;
    route: "/" | "/session" | "/history" | "/settings";
    label: string;
  };

  const navItems: NavItem[] = [
    { icon: MenuBookOutlineIcon, route: "/", label: m.nav_info() },
    { icon: AddNotesOutlineIcon, route: "/session", label: m.nav_session() },
    { icon: SourceNotesOutlineIcon, route: "/history", label: m.nav_history() },
    { icon: SettingsOutlineIcon, route: "/settings", label: m.nav_settings() },
  ];

  type LocaleBtn = {
    icon: string;
    name: Locale;
  };
  const localeBtns: LocaleBtn[] = [
    { icon: "🇷🇺", name: "ru" },
    { icon: "🇺🇸", name: "en" },
  ];

  function isActive(itemRoute: string): boolean {
    const currentPath = page.url.pathname;
    if (itemRoute === "/") {
      return currentPath === resolve("/") || currentPath.startsWith(resolve("/session"));
    }
    return currentPath === resolve(itemRoute as "/");
  }
</script>

<aside
  class="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
                  flex flex-col p-4 overflow-y-auto"
>
  <nav class="flex-1 space-y-1">
    {#each navItems as item (item)}
      <a
        href={resolve(item.route)}
        class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
          {isActive(item.route)}
                    ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'}"
      >
        <span><item.icon height="1.3em" /></span>
        {item.label}
      </a>
    {/each}
  </nav>

  <div class="text-xs text-gray-400 px-2 pt-4 pb-4">
    {m.all_data_is_local()}
  </div>
  <div class="text-xs text-gray-400 px-2 pt-4 border-t border-gray-200 dark:border-gray-700">
    <div class="flex items-center justify-between">
      <span>v1.0.1</span>
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
