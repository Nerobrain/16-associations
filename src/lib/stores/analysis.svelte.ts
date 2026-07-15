import { browser } from "$app/environment";

const stateStorageKey = "analysis";

type Analysis = {
    theme: string;
    answers: string[];
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
    if (analysis.answers == undefined) {
        analysis.answers = [answer];
    } else {
        analysis.answers.push(answer);
    }
    if (browser) {
        localStorage.setItem(stateStorageKey, JSON.stringify(analysis));
    }
    return analysis;
}

function popAnswer(): string {
    const result = analysis.answers.pop() || "";
    if (browser) {
        localStorage.setItem(stateStorageKey, JSON.stringify(analysis));
    }
    return result;
}

// Экспортируем состояние и функцию для его изменения
export const analysisStore = {
    get answers(): string[] {
        return analysis.answers;
    },
    get theme(): string {
        return analysis.theme;
    },
    get step(): number {
        return !analysis.answers ? 1 : analysis.answers.length + 1;
    },
    setTheme,
    pushAnswer,
    popAnswer,
    flush() {
        analysis.theme = "";
        analysis.answers = [];
        if (browser) {
            localStorage.removeItem(stateStorageKey);
        }
    },
};
