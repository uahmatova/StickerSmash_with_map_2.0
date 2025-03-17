//РАБОТАЕТ
// import * as SQLite from 'expo-sqlite';
// import { Marker, MarkerImage } from '../types';

// //открываем бд для работы
// const db = SQLite.openDatabaseSync('DataBase.db');

// // Создание нового маркера
// export const addMarker = async (latitude: number, longitude: number): Promise<number> => {
//     try {
//         const result = await db.runAsync(
//             'INSERT INTO markers (latitude, longitude) VALUES (?, ?);',
//             [latitude, longitude]
//         );
//         console.log('создан маркер:', latitude, longitude);
//         return result.lastInsertRowId as number;
//     }
//     catch (error) {
//         console.error('алярм! ошибка при добавлении маркера:', error);
//         throw error;
//     }
// };


// // Удаление маркера (включая связанные изображения)
// export const deleteMarker = async (id: number, latitude: number, longitude: number): Promise<void> => {
//     try {
//         // await db.runAsync('DELETE FROM marker_images WHERE marker_id = ?;', [id]);
//         // console.log('удалены фотографии для маркера:', id);

//         await db.runAsync('DELETE FROM markers WHERE id = ?;', [id]);
//         console.log('маркер удален:', id, latitude, longitude);
//     } catch (error) {
//         console.error('алярм! ошибка при удалении маркера:', error);
//         throw error;
//     }
// };

// // Добавление изображения к маркеру
// export const addImage = async (marker_id: number, uri: string): Promise<void> => {
//     try {
//         await db.runAsync(
//             'INSERT INTO marker_images (marker_id, uri) VALUES (?, ?);',
//             [marker_id, uri]
//         );
//         console.log('изображение добавлено к маркеру:', marker_id);
//     } catch (error) {
//         console.error('алярм! ошибка при добавлении изображения:', error);
//         throw error;
//     }
// };

// // Удаление изображения
// export const deleteImage = async (marker_id: number, uri: string): Promise<void> => {
//     try {
//         await db.runAsync('DELETE FROM marker_images WHERE uri = ? AND marker_id = ?;', [uri, marker_id]);

//         const result = await db.runAsync('SELECT count(uri) FROM marker_images WHERE marker_id = ?;', [marker_id]);
//         console.log('количество фоток маркера:', result);        
//         console.log('изображение удалено:', marker_id);
//     } catch (error) {
//         console.error('алярм! ошибка при удалении изображения:', error);
//         throw error;
//     }
// };



// // Получение всех маркеров
// export const getMarkers = async (): Promise<Marker[]> => {
//     try {
//         const result = await db.getAllAsync('SELECT * FROM markers;');
//         console.log('все маркеры:', JSON.stringify(result, null, 2));
//         return result as Marker[];
//     } catch (error) {
//         console.error('алярм! ошибка при получении маркеров:', error);
//         throw error;
//     }
// };



// // Получение всех изображений для конкретного маркера
// export const getMarkerImages = async (marker_id: number): Promise<MarkerImage[]> => {
//     try {
//         const result = await db.getAllAsync(
//             'SELECT * FROM marker_images WHERE marker_id = ?;',
//             [marker_id]
//         );
//         return result as MarkerImage[];
//     } catch (error) {
//         console.error('алярм! ошибка при получении изображений:', error);
//         throw error;
//     }
// };

// // Проверка наличия изображений у маркера
// export const hasMarkerImages = async (marker_id: number): Promise<boolean> => {
//     try {
//         const images = await getMarkerImages(marker_id);
//         return images.length > 0; // Если есть изображения, возвращаем true
//     } catch (error) {
//         console.error('алярм! ошибка при проверке изображений:', error);
//         throw error;
//     }
// };


// // Функция для полного удаления таблиц
// export const clearDatabase = async () => {
//     try {
//         await db.withTransactionAsync(async () => {
//             // Удаляем таблицу marker_images
//             await db.execAsync('DROP TABLE IF EXISTS marker_images;');
//             console.log('таблица marker_images удалена.');

//             // Удаляем таблицу markers
//             await db.execAsync('DROP TABLE IF EXISTS markers;');
//             console.log('таблица markers удалена.');
//         });
//         console.log('база данных успешно очищена: таблицы удалены.');
//     } catch (error) {
//         console.error('алярм! ошибка при удалении таблиц:', error);
//     }
// };
