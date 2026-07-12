const dbName = "16Associations";
const tableName = "sessions";

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);
        request.onupgradeneeded = () => {
            const db = request.result;
            // Создаём хранилище, если его нет
            if (!db.objectStoreNames.contains(tableName)) {
                db.createObjectStore(tableName, { keyPath: "id" });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Сохранить запись (добавить или обновить)
export async function saveRecord(id: string, theme: string, words: string[]): Promise<void> {
    const db = await openDB();
    const tx = db.transaction(tableName, "readwrite");
    const store = tx.objectStore(tableName);
    store.put({ id, theme, words });
    return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

// Прочитать запись по UUID
export async function getRecord(id: string): Promise<{ id: string; theme: string; words: string[] } | undefined> {
    const db = await openDB();
    const tx = db.transaction(tableName, "readonly");
    const store = tx.objectStore(tableName);
    const request = store.get(id);
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Удалить запись по UUID
export async function deleteRecord(id: string): Promise<void> {
    const db = await openDB();
    const tx = db.transaction(tableName, "readwrite");
    const store = tx.objectStore(tableName);
    store.delete(id);
    return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

// Чтение следующих N записей, начиная с lastID (исключительно)
export async function loadMore(lastID: string | null, limit: number) {
    const db = await openDB();
    const tx = db.transaction(tableName, "readonly");
    const store = tx.objectStore(tableName);

    const range = lastID
        ? IDBKeyRange.upperBound(lastID, true) // все < lastID
        : null; // если нет lastID, берём с конца

    const request = store.openCursor(range, "prev"); // сортировка по убыванию
    const results: { id: string; theme: string }[] = [];
    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            const cursor = request.result;
            if (cursor && results.length < limit) {
                results.push(cursor.value);
                cursor.continue();
            } else {
                resolve(results);
            }
        };
        request.onerror = () => reject(request.error);
    });
}
