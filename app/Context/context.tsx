import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';

//создаем контекст для базы данных
const DatabaseContext = createContext<SQLite.SQLiteDatabase | null>(null);
//контекст - объект, который будет хранить бд; по умолчанию значение контекст нул, т.к. в самом начале бд не открыта

//провайдер для контекста бд (будет предоставлять доступ к бд компонентам)
//чилдрен - все компоненты, которые будут обернуты в провайдер
//юзстейт для состояния бд
export const DatabaseProvider = ({ children }: { children: React.ReactNode }) => {
    const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

    useEffect(() => {
        //открыли бд, когда компонент монтируется на экране
        const database = SQLite.openDatabaseSync('DataBase.db');
        setDb(database);

        //закрыли бд, когда компонент исчез с экрана
        return () => {
            if (db) {
                db.closeAsync().catch((error) => {
                    console.error('алярм! ошибка при закрытии базы данных:', error);
                });
            }
        };
    }, []);

    return (
        //компонент, который передает db всем дочерним
        <DatabaseContext.Provider value={db}>   
            {children}
        </DatabaseContext.Provider>
    );
};

//хук для использования контекста
export const useDatabase = () => {
    const db = useContext(DatabaseContext); //получение бд
    if (!db) { //если db=null, то компонент не находится в провайдере, кидаем ошибку
        throw new Error('useDatabase must be used within a DatabaseProvider');
    }
    return db;
};