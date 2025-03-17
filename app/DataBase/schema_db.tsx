import * as SQLite from 'expo-sqlite';

//создаем/открываем БД
const db = SQLite.openDatabaseSync('DataBase.db');


//создание таблиц
export const createTables = () => {
    try {
        db.withTransactionAsync(async () => {
            db.execAsync(
                `CREATE TABLE IF NOT EXISTS markers (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    latitude REAL NOT NULL,
                    longitude REAL NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                );`
            );

            db.execAsync(
                `CREATE TABLE IF NOT EXISTS marker_images (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    marker_id INTEGER NOT NULL,
                    uri TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY(marker_id) REFERENCES markers(id)
                );`
            );
        }),
            console.log('успешный успех: таблицы созданы/открыты');
    } catch (error) {
        console.error('алярм! ошибка:', error);
    }
};



