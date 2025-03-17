// //РАБОТАЕТ
// import React, { useEffect, useState } from 'react';
// import MapView, { Marker } from 'react-native-maps';
// import { StyleSheet, View, Modal, FlatList, Image, Text, Button, Alert } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { createTables } from '../DataBase/schema_db';
// import { addMarker, deleteMarker, getMarkers, addImage, deleteImage, getMarkerImages, hasMarkerImages, clearDatabase } from '../DataBase/operations_db';
// import { Marker as MarkerType, MarkerImage } from '../types'; // Импортируем типы

// //clearDatabase();

// const Map = () => {
//     const [myMarkerCoords, setMyMarkerCoords] = useState<MarkerType[]>([]); // Типизация состояния маркеров
//     const [modalVisible, setModalVisible] = useState<boolean>(false);
//     const [currentMarkerId, setCurrentMarkerId] = useState<number | null>(null);
//     const [isLoading, setIsLoading] = useState<boolean>(true);
//     const [isTableEmpty, setIsTableEmpty] = useState<boolean>(false); // Состояние для проверки пустой таблицы

//     // Для Перми
//     const initialRegion = {
//         latitude: 58,
//         longitude: 56,
//         latitudeDelta: 0.5,
//         longitudeDelta: 0.5,
//     };

//     // Загрузка маркеров при монтировании компонента
//     useEffect(() => {
//         const loadData = async () => {
//             await createTables(); // Создаем/открываем базу данных
//             const markers = await getMarkers(); // Загружаем маркеры из базы данных

//             if (markers.length === 0) {
//                 setIsTableEmpty(true); // Если таблица пуста, устанавливаем флаг
//             } else {
//                 const markersWithPhotos = await Promise.all(markers.map(async (marker) => {
//                     const photos = await getMarkerImages(marker.id);
//                     return { ...marker, photos: photos.map(photo => photo.uri) };
//                 }));
//                 setMyMarkerCoords(markersWithPhotos);
//             }

//             setIsLoading(false);
//         };
//         loadData();
//     }, []);

//     const onMapPress = async (e: { nativeEvent: { coordinate: { latitude: number, longitude: number } } }) => {
//         const coordinate = e.nativeEvent.coordinate;
//         const newMarkerId = await addMarker(coordinate.latitude, coordinate.longitude);
//         const newMarker: MarkerType = {
//             id: newMarkerId,
//             latitude: coordinate.latitude,
//             longitude: coordinate.longitude,
//             created_at: new Date().toISOString(), // Добавляем дату создания
//             photos: [], // Инициализируем массив фотографий
//         };
//         setMyMarkerCoords([...myMarkerCoords, newMarker]);
//         setIsTableEmpty(false); // Если добавляем маркер, таблица больше не пуста
//     };

//     const onMarkerPress = async (marker_id: number) => {
//         setCurrentMarkerId(marker_id);
//         setModalVisible(true);
//     };

//     const pickImageAsync = async () => {
//         let result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             allowsEditing: true,
//             quality: 1,
//         });

//         if (!result.canceled && currentMarkerId !== null) {
//             const uri = result.assets[0].uri;
//             await addImage(currentMarkerId, uri);
//             const updatedMarkers = myMarkerCoords.map(marker => {
//                 if (marker.id === currentMarkerId) {
//                     return { ...marker, photos: [...marker.photos, uri] };
//                 }
//                 return marker;
//             });
//             setMyMarkerCoords(updatedMarkers);
//         } else {
//             alert('Вы не выбрали фото');
//         }
//     };


//     const handleDeletePhoto = async (photoUri: string) => {
//         if (currentMarkerId !== null) {
//             // Находим ID изображения по его URI
//             const markerImages = await getMarkerImages(currentMarkerId);
//             const imageToDelete = markerImages.find(image => image.uri === photoUri);
    
//             if (imageToDelete) {
//                 await deleteImage(currentMarkerId, photoUri); // Удаляем изображение из базы данных
//                 const updatedMarkers = myMarkerCoords.map(marker => {
//                     if (marker.id === currentMarkerId) {
//                         return { ...marker, photos: marker.photos.filter(photo => photo !== photoUri) };
//                     }
//                     return marker;
//                 });
//                 setMyMarkerCoords(updatedMarkers); // Обновляем локальное состояние
//             } else {
//                 console.error('Изображение не найдено в базе данных.');
//             }
//         }
//     };


//     // const handleDeletePhoto = async (marker_id: number, photoUri: string) => {
//     //     if (currentMarkerId !== null) {
//     //         await deleteImage(marker_id, photoUri);
//     //         const updatedMarkers = myMarkerCoords.map(marker => {
//     //             if (marker.id === currentMarkerId) {
//     //                 return { ...marker, photos: marker.photos.filter(photo => photo !== photoUri) };
//     //             }
//     //             return marker;
//     //         });
//     //         setMyMarkerCoords(updatedMarkers);
//     //     }
//     // };

//     const handleDeleteMarker = async () => {
//         if (currentMarkerId !== null) {
//             const hasImages = await hasMarkerImages(currentMarkerId); // Проверяем, есть ли изображения
//             if (hasImages) {
//                 Alert.alert(
//                     'алярм!',
//                     'сначала надо удалить все изображения из этого маркера',
//                     [{ text: 'OK' }]
//                 );
//             } else {
//                 await deleteMarker(currentMarkerId);
//                 const updatedMarkers = myMarkerCoords.filter(marker => marker.id !== currentMarkerId);
//                 setMyMarkerCoords(updatedMarkers);
//                 setModalVisible(false);
//                 setCurrentMarkerId(null);
//             }
//         }
//     };

//     const handleCloseModal = () => {
//         setModalVisible(false);
//         setCurrentMarkerId(null);
//     };

//     const currentPhotos = currentMarkerId !== null
//         ? myMarkerCoords.find(marker => marker.id === currentMarkerId)?.photos || []
//         : [];

//     if (isLoading) {
//         return <Text>Загрузка...</Text>;
//     }


//     return (
//         <View style={styles.container}>
//             <MapView
//                 onPress={onMapPress}
//                 initialRegion={initialRegion}
//                 style={styles.map}
//             >
//                 {myMarkerCoords.map((marker) => (
//                     <Marker
//                         key={marker.id}
//                         coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
//                         onPress={() => onMarkerPress(marker.id)}
//                     />
//                 ))}
//             </MapView>

//             <Modal
//                 animationType="slide"
//                 transparent={false}
//                 visible={modalVisible}
//                 onRequestClose={handleCloseModal}
//             >
//                 <View style={styles.modalContainer}>
//                     <Text style={styles.modalTitle}>Фотографии метки</Text>
//                     <Button title="Добавить фото" onPress={pickImageAsync} color="#fdd43e" />
//                     <FlatList
//                         data={currentPhotos}
//                         keyExtractor={(item, index) => index.toString()}
//                         renderItem={({ item }) => (
//                             <View style={styles.photoContainer}>
//                                 <Image source={{ uri: item }} style={styles.image} />
//                                 <Button title="Удалить" color="#fdd43e" onPress={() => handleDeletePhoto(item)} />
//                             </View>
//                         )}
//                     />
//                     <Button title="Удалить маркер" onPress={handleDeleteMarker} color="#ff4444"/>
//                     <Button title="Закрыть" onPress={handleCloseModal} color="#fdd43e" />
//                 </View>
//             </Modal>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#25292e',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     map: {
//         width: '100%',
//         height: '100%',
//     },
//     modalContainer: {
//         flex: 1,
//         backgroundColor: '#25292e',
//         padding: 20,
//     },
//     modalTitle: {
//         fontSize: 22,
//         color: '#ffffff',
//         marginBottom: 20,
//     },
//     image: {
//         width: 100,
//         height: 100,
//         margin: 10,
//     },
//     photoContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     emptyContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#25292e',
//     },
//     emptyText: {
//         fontSize: 18,
//         color: '#ffffff',
//     },
// });

// export default Map;