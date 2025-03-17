// import React from 'react';
// import MapView from 'react-native-maps';
// import { StyleSheet, View } from 'react-native';

// const initialRegion = {
// 	latitude: 58,
// 	longtude: 56

// }

// const coords = [
// 	{
// 		latitude: 58,
// 		longtude: 56,
// 	},
// 	{
// 		latitude: 58.1,
// 		longtude: 56.1,
// 	}
// ]


// //прошли по массиву, сформировали разметку
// export default function Index() {

//     const onMapPress =(e) => {
//         //const {coordinate} = e.nativeEvent; //так все всегда пишут, принятый вариант
//         const coordinate = e.nativeEvent.coordinate;    //получили
//         //исходные массивы не меняем, формируем новый на основе старого (старый + новый)
//         //оператор деструктиризации
//         const newMarkerState = [... myMarkerCoords, coordinate]; //формируем новое состояние
//         setMyMarkerCoords(newMarkerState);

//     }


//     const onMarkerPress = (e) => {
//         const {coordinate} = e.nativeEvent;
//         console.log("marker", coordinate);
//     }


// 	const markers = myMarkerCoords.map((coord, index) => (
// 		<Marker
// 			key=(index)
// 			coordinate=(coord)
// 			title = {'Marker ${index}'}
//             onPress={}
// 		/>
//     ));

// 	return (
// 		<View style=(styles.container)>
// 			<MapView
// 				onPress={onMapPress}
//                 //onPress={e => console.log(e)}
// 				initialRegion={initialRegion}
// 				style={styles.map}>
			
// 				{markers}
// 			</MapView>
// 		</View>
// 	)
// }


// const styles = StyleSheet.create{{
//     container: {
//         flex: 1,
//     },
//     map: {
//         width: '100%',
//         height: '100%',
//     },
// }};

