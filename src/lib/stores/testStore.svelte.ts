import { browser } from "$app/environment";

type Answers = Record<string, string>;

// Создаём реактивное состояние
const saved = browser
    ? JSON.parse(localStorage.getItem("testResults") || "{}")
    : {};
let answers = $state<Answers>(saved);

// Функция для обновления
function updateAnswers(newAnswers: Answers) {
    answers = newAnswers;
    if (browser) {
        localStorage.setItem("testResults", JSON.stringify(answers));
    }
}

// Экспортируем состояние и функцию для его изменения
export const testStore = {
    get answers() {
        return answers;
    },
    updateAnswers,
};
