import { Marker, MarkerImage } from '../types';
import * as SQLite from 'expo-sqlite';

//создание маркера
export const addMarker = async (db: SQLite.SQLiteDatabase, latitude: number, longitude: number): Promise<number> => {
    try {
        const result = await db.runAsync(
            'INSERT INTO markers (latitude, longitude) VALUES (?, ?);',
            [latitude, longitude]
        );
        console.log('создан маркер:', latitude, longitude);
        return result.lastInsertRowId as number;    //возвращаем айдишник последнего добавленного маркера (т.е. текущего)
    } catch (error) {
        console.error('алярм! ошибка при добавлении маркера:', error);
        throw error;
    }
};

//удаление маркера
export const deleteMarker = async (db: SQLite.SQLiteDatabase, id: number): Promise<void> => {
    try {
        await db.runAsync('DELETE FROM markers WHERE id = ?;', [id]);
        console.log('маркер удалён:', id);
    } catch (error) {
        console.error('алярм! ошибка при удалении маркера:', error);
        throw error;
    }
};

//добавление изображения к маркеру
export const addImage = async (db: SQLite.SQLiteDatabase, marker_id: number, uri: string): Promise<void> => {
    try {
        await db.runAsync(
            'INSERT INTO marker_images (marker_id, uri) VALUES (?, ?);',
            [marker_id, uri]
        );
        console.log('изображение добавлено к маркеру:', marker_id);
    } catch (error) {
        console.error('алярм! ошибка при добавлении изображения:', error);
        throw error;
    }
};

//удаление изображения
export const deleteImage = async (db: SQLite.SQLiteDatabase, marker_id: number, uri: string): Promise<void> => {
    try {
        await db.runAsync('DELETE FROM marker_images WHERE uri = ? AND marker_id = ?;', [uri, marker_id]);
        console.log('изображение удалено:', marker_id);
    } catch (error) {
        console.error('алярм! ошибка при удалении изображения:', error);
        throw error;
    }
};

//получение всех маркеров
export const getMarkers = async (db: SQLite.SQLiteDatabase): Promise<Marker[]> => {
    try {
        const result = await db.getAllAsync('SELECT * FROM markers;');
        console.log('все маркеры:', JSON.stringify(result, null, 2));       //для красивого вывода
        return result as Marker[];
    } catch (error) {
        console.error('алярм! ошибка при получении маркеров:', error);
        throw error;
    }
};

//получение всех изображений для конкретного маркера
export const getMarkerImages = async (db: SQLite.SQLiteDatabase, marker_id: number): Promise<MarkerImage[]> => {
    try {
        const result = await db.getAllAsync(
            'SELECT * FROM marker_images WHERE marker_id = ?;',
            [marker_id]
        );
        return result as MarkerImage[];
    } catch (error) {
        console.error('алярм! ошибка при получении изображений:', error);
        throw error;
    }
};

//проверка наличия изображений у маркера
export const hasMarkerImages = async (db: SQLite.SQLiteDatabase, marker_id: number): Promise<boolean> => {
    try {
        const images = await getMarkerImages(db, marker_id);
        return images.length > 0; //то есть если есть изображения
    } catch (error) {
        console.error('алярм! ошибка при проверке изображений:', error);
        throw error;
    }
};

//для полного сноса бд
export const clearDatabase = async (db: SQLite.SQLiteDatabase) => {
    try {
        await db.withTransactionAsync(async () => {
            await db.execAsync('DROP TABLE IF EXISTS marker_images;');
            console.log('таблица marker_images удалена.');

            await db.execAsync('DROP TABLE IF EXISTS markers;');
            console.log('таблица markers удалена.');
        });
        console.log('база данных успешно очищена: таблицы удалены.');
    } catch (error) {
        console.error('алярм! ошибка при удалении таблиц:', error);
    }
};
