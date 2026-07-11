import { browser } from "$app/environment";

const stateStorageKey = "analysis";

type Analysis = {
    theme: string;
    ansvers: string[];
};

// Создаём реактивное состояние
const saved = browser ? JSON.parse(localStorage.getItem(stateStorageKey) || "{}") : {};
const analysis = $state<Analysis>(saved);

// Функция для обновления
function setTheme(theme: string) {
    analysis.theme = theme;
    if (browser) {
        localStorage.setItem(stateStorageKey, JSON.stringify(analysis));
    }
}

function pushAnswer(answer: string): Analysis {
    if (analysis.ansvers == undefined) {
        analysis.ansvers = [answer];
    } else {
        analysis.ansvers.push(answer);
    }
    return analysis;
}

function popAnswer(): string {
    return analysis.ansvers.pop() || "";
}

// Экспортируем состояние и функцию для его изменения
export const analysisStore = {
    get ansvers(): string[] {
        return analysis.ansvers;
    },
    get theme(): string {
        return analysis.theme;
    },
    get step(): number {
        return !analysis.ansvers ? 1 : analysis.ansvers.length + 1;
    },
    setTheme,
    pushAnswer,
    popAnswer,
};
