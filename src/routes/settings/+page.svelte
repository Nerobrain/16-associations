<script lang="ts">
    import { m } from "$lib/paraglide/messages.js";
    import { settingsStore, type DateFormat, type Theme } from "$lib/stores/settings.svelte";

    const formats: { value: DateFormat; label: string }[] = [
        { value: "full", label: m.settings_date_format_full() },
        { value: "datetime", label: m.settings_date_format_datetime() },
        { value: "date", label: m.settings_date_format_date() },
        { value: "iso", label: m.settings_date_format_iso() },
    ];

    const themes: { value: Theme; label: string }[] = [
        { value: "system", label: m.settings_theme_system() },
        { value: "light", label: m.settings_theme_light() },
        { value: "dark", label: m.settings_theme_dark() },
    ];
</script>

<h1 class="text-2xl font-bold">{m.title_settings()}</h1>

<div class="mt-6 space-y-6">
    <div>
        <label for="date-format" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {m.settings_date_format()}
        </label>
        <select
            id="date-format"
            class="px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 text-gray-700 dark:text-gray-200"
            onchange={(e) => settingsStore.setDateFormat((e.target as HTMLSelectElement).value as DateFormat)}
        >
            {#each formats as { value, label } (value)}
                <option {value} selected={settingsStore.dateFormat === value}>{label}</option>
            {/each}
        </select>
    </div>

    <div>
        <span class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {m.settings_theme()}
        </span>
        <div class="flex flex-wrap gap-2">
            {#each themes as { value, label } (value)}
                <button
                    class="px-4 py-2 rounded-lg text-sm font-medium border transition-colors
                        {settingsStore.theme === value
                            ? 'bg-indigo-100 dark:bg-indigo-900 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}"
                    onclick={() => settingsStore.setTheme(value)}
                >
                    {label}
                </button>
            {/each}
        </div>
    </div>
</div>
