import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Modal, FlatList, Image, Text, Button, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createTables } from '../DataBase/schema_db';
import { addMarker, deleteMarker, getMarkers, addImage, deleteImage, getMarkerImages, hasMarkerImages } from '../DataBase/operations_db';
import { Marker as MarkerType } from '../types';
import { useDatabase } from '../Context/context'; 

const Map = () => {
    const db = useDatabase(); //для получения бд
    const [modalVisible, setModalVisible] = useState<boolean>(false);   //для модальных окон
    const [markersListVisible, setMarkersListVisible] = useState<boolean>(false);   //модальное со списком маркеров
    const [currentMarkerId, setCurrentMarkerId] = useState<number | null>(null);       //хук для выбранного маркера
    const [markers, setMarkers] = useState<MarkerType[]>([]);       //хук для маркеров
    const [currentPhotos, setCurrentPhotos] = useState<string[]>([]);       //хук для изображений

    //Пермь
    const initialRegion = {
        latitude: 58,
        longitude: 56,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
    };

    //загрузка данных из бд
    useEffect(() => {
        const loadData = async () => {
            await createTables(db);
            await fetchMarkers();
        };
        loadData();
    }, [db]);

    //загрузка маркеров и их изображений
    const fetchMarkers = async () => {
        const markersFromDB = await getMarkers(db); 
        const markersWithPhotos = await Promise.all(markersFromDB.map(async (marker) => {
            const photos = await getMarkerImages(db, marker.id);
            return { ...marker, photos: photos.map(photo => photo.uri) };
        }));
        setMarkers(markersWithPhotos);
    };

    //нажатие на карту - добавление маркера
    const onMapPress = async (e: { nativeEvent: { coordinate: { latitude: number, longitude: number } } }) => {
        const coordinate = e.nativeEvent.coordinate;
        await addMarker(db, coordinate.latitude, coordinate.longitude);
        await fetchMarkers();
    };

    //нажатие на маркер - получения списка изображений
    const onMarkerPress = async (marker_id: number) => {
        setCurrentMarkerId(marker_id);
        const photos = await getMarkerImages(db, marker_id);
        setCurrentPhotos(photos.map(photo => photo.uri));
        setModalVisible(true);
    };

    //загрузка изображения
    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && currentMarkerId !== null) {
            const uri = result.assets[0].uri;
            await addImage(db, currentMarkerId, uri);
            const photos = await getMarkerImages(db, currentMarkerId);
            setCurrentPhotos(photos.map(photo => photo.uri));
            await fetchMarkers();
        } else {
            alert('алярм! вы не выбрали фото');
        }
    };

    //удаление фотографии
    const handleDeletePhoto = async (photoUri: string) => {
        if (currentMarkerId !== null) {
            await deleteImage(db, currentMarkerId, photoUri); 
            const photos = await getMarkerImages(db, currentMarkerId); 
            setCurrentPhotos(photos.map(photo => photo.uri));
            await fetchMarkers();
        }
    };

    //удаление маркера
    const handleDeleteMarker = async () => {
        if (currentMarkerId !== null) {
            const hasImages = await hasMarkerImages(db, currentMarkerId); 
            if (hasImages) {
                Alert.alert(
                    'алярм!',
                    'сначала удалите все изображения из этого маркера',
                    [{ text: 'OK' }]
                );
            } else {
                await deleteMarker(db, currentMarkerId); 
                await fetchMarkers();
                setModalVisible(false);
                setCurrentMarkerId(null);
            }
        }
    };

    //закрытие окна с изображениями
    const handleCloseModal = () => {
        setModalVisible(false);
        setCurrentMarkerId(null);
    };

    //закрытие окна со списком маркеров
    const handleCloseMarkersListModal = () => {
        setMarkersListVisible(false);
    };

    //открытие окна со списком маркеров
    const showMarkersList = () => {
        setMarkersListVisible(true);
    };

    //выбор маркера из списка
    const selectMarker = async (markerId: number) => {
        setCurrentMarkerId(markerId);
        const photos = await getMarkerImages(db, markerId); //загружаем фотографии
        setCurrentPhotos(photos.map(photo => photo.uri));
        setMarkersListVisible(false); //закрываем список
        setModalVisible(true); //открываем окно с фотографиями
    };

    return (
        <View style={styles.container}>
            <MapView
                onPress={onMapPress}
                initialRegion={initialRegion}
                style={styles.map}
            >
                {markers.map((marker) => (
                    <Marker
                        key={marker.id}
                        coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                        onPress={() => onMarkerPress(marker.id)}
                    />
                ))}
            </MapView>

            <View style={styles.buttonContainer}>
                <Button title="Показать маркеры списком" onPress={showMarkersList} color="#fdd43e" />
            </View>

            <Modal
                animationType="slide"
                transparent={false}
                visible={markersListVisible}
                onRequestClose={handleCloseMarkersListModal}
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Список маркеров</Text>
                    <FlatList
                        data={markers}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.markerItem}
                                onPress={() => selectMarker(item.id)}
                            >
                                <Text style={styles.markerText}>
                                    Маркер ID: {item.id}, Широта: {item.latitude}, Долгота: {item.longitude}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                    <Button title="Закрыть" onPress={handleCloseMarkersListModal} color="#fdd43e" />
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Фотографии метки</Text>
                    <Button title="Добавить фото" onPress={pickImageAsync} color="#fdd43e" />
                    <FlatList
                        data={currentPhotos}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.photoContainer}>
                                <Image source={{ uri: item }} style={styles.image} />
                                <Button title="Удалить" color="#fdd43e" onPress={() => handleDeletePhoto(item)} />
                            </View>
                        )}
                    />
                    <Button title="Удалить маркер" onPress={handleDeleteMarker} color="#ff4444" />
                    <Button title="Назад" onPress={() => { setModalVisible(false); setMarkersListVisible(true); }} color="#fdd43e" />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#25292e',
        padding: 20,
    },
    modalTitle: {
        fontSize: 22,
        color: '#ffffff',
        marginBottom: 20,
    },
    image: {
        width: 100,
        height: 100,
        margin: 10,
    },
    photoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
    },
    markerItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
    },
    markerText: {
        color: '#ffffff',
        fontSize: 16,
    },
});

export default Map;