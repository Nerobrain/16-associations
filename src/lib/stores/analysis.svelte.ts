import { browser } from "$app/environment";

const stateStorageKey = "analysis";

type Analysis = {
    theme: string;
    ansvers: string[];
};

// Создаём реактивное состояние
const saved = browser
    ? JSON.parse(localStorage.getItem(stateStorageKey) || "{}")
    : {};
const analysis = $state<Analysis>(saved);

// Функция для обновления
function setTheme(theme: string) {
    analysis.theme = theme;
    if (browser) {
        localStorage.setItem(stateStorageKey, JSON.stringify(analysis));
    }
}

function pushAnswer(answer: string): Analysis {
    analysis.ansvers.push(answer);
    return analysis;
}

function popAnswer(): string {
    return analysis.ansvers.pop() || "";
}

// Экспортируем состояние и функцию для его изменения
export const analysisStore = {
    get states() {
        return analysis;
    },
    setTheme,
    pushAnswer,
    popAnswer,
};
