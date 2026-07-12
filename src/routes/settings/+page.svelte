<script lang="ts">
    import { m } from "$lib/paraglide/messages.js";
    import { settingsStore, type DateFormat } from "$lib/stores/settings.svelte";

    const formats: { value: DateFormat; label: string }[] = [
        { value: "full", label: m.settings_date_format_full() },
        { value: "datetime", label: m.settings_date_format_datetime() },
        { value: "date", label: m.settings_date_format_date() },
        { value: "iso", label: m.settings_date_format_iso() },
    ];
</script>

<h1 class="text-2xl font-bold">{m.title_settings()}</h1>

<div class="mt-6">
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
