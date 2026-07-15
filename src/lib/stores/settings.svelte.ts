import { browser } from "$app/environment";

const storageKey = "settings";

export type DateFormat = "full" | "datetime" | "date" | "iso";
export type Theme = "system" | "light" | "dark";

type Settings = {
    dateFormat: DateFormat;
    theme: Theme;
};

const defaults: Settings = { dateFormat: "full", theme: "system" };
const saved = browser ? JSON.parse(localStorage.getItem(storageKey) || "null") : null;
const settings = $state<Settings>({ ...defaults, ...saved });

function persist() {
    if (browser) {
        localStorage.setItem(storageKey, JSON.stringify(settings));
    }
}

export const settingsStore = {
    get dateFormat(): DateFormat {
        return settings.dateFormat;
    },
    setDateFormat(format: DateFormat) {
        settings.dateFormat = format;
        persist();
    },
    get theme(): Theme {
        return settings.theme;
    },
    setTheme(theme: Theme) {
        settings.theme = theme;
        persist();
    },
};
