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
    answer = answer.toLowerCase();
    if (analysis.ansvers == undefined) {
        analysis.ansvers = [answer];
    } else {
        analysis.ansvers.push(answer);
    }
    if (browser) {
        localStorage.setItem(stateStorageKey, JSON.stringify(analysis));
    }
    return analysis;
}

function popAnswer(): string {
    const result = analysis.ansvers.pop() || "";
    if (browser) {
        localStorage.setItem(stateStorageKey, JSON.stringify(analysis));
    }
    return result;
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
    flush() {
        analysis.theme = "";
        analysis.ansvers = [];
        if (browser) {
            localStorage.removeItem(stateStorageKey);
        }
    },
};
