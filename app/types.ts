//описание структур объектов

//маркер
export interface Marker {
  id: number;
  latitude: number;
  longitude: number;
  created_at: string;
}

//изображение маркера
export interface MarkerImage {
  id: number;
  marker_id: number;
  uri: string;
  created_at: string;
}


