import { browser } from "$app/environment";

const storageKey = "settings";

export type DateFormat = "full" | "datetime" | "date" | "iso";

type Settings = {
    dateFormat: DateFormat;
};

const defaults: Settings = { dateFormat: "full" };
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
};
