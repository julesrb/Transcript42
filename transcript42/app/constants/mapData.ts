export interface City {
    name: string;
    lat: number;
    lng: number;
    value: number;
}

export const cityData: City[] = [
    { name: "Berlin", lat: 52.52, lng: 13.405, value: 54 },
    { name: "Heilbronn", lat: 49.1427, lng: 9.2109, value: 35 },
    { name: "Malaga", lat: 36.7213, lng: -4.4214, value: 28 },
    { name: "São Paulo", lat: -23.559902, lng: -46.697669, value: 14 },
    { name: "Amsterdam", lat: 52.3741881, lng: 4.9156938, value: 12 },
    { name: "Paris", lat: 48.8566, lng: 2.3522, value: 12 },
    { name: "Tétouan", lat: 35.5889, lng: -5.3626, value: 8 },
    { name: "Wolfsburg", lat: 52.4227, lng: 10.7865, value: 5 },
    { name: "Beirut", lat: 33.8938, lng: 35.5018, value: 4 },
    { name: "Madrid", lat: 40.4168, lng: -3.7038, value: 3 },
    { name: "Brussels", lat: 50.84635, lng: 4.35515, value: 3 },
    { name: "Le Havre", lat: 49.4944, lng: 0.1079, value: 3 },
    { name: "Luxembourg", lat: 49.49719, lng: 5.98519, value: 3 },
    { name: "Amman", lat: 31.9454, lng: 35.9284, value: 3 },
    { name: "Barcelona", lat: 41.3851, lng: 2.1734, value: 3 },
    { name: "Rabat", lat: 34.0209, lng: -6.8416, value: 2 },
    { name: "Lyon", lat: 45.780556, lng: 4.749167, value: 2 },
    { name: "Porto", lat: 41.149102, lng: -8.612968, value: 2 },
    { name: "Urduliz", lat: 43.38025, lng: -2.960389, value: 1 },
    { name: "Benguerir", lat: 32.2622, lng: -7.9511, value: 1 },
    { name: "Bangkok", lat: 13.72979, lng: 100.77665, value: 1 },
    { name: "Antananarivo", lat: -18.88339, lng: 47.51342, value: 1 },
    { name: "Luanda", lat: -8.84221, lng: 13.26577, value: 1 },
    { name: "Singapore", lat: 1.341103, lng: 103.957582, value: 1 },
    { name: "Quebec", lat: 46.8139, lng: -71.208, value: 1 },
    { name: "Rome", lat: 41.9028, lng: 12.4964, value: 1 },
    { name: "Istanbul", lat: 41.09670, lng: 28.99595, value: 1 },
    { name: "Khouribga", lat: 32.8847, lng: -6.9066, value: 1 },
    { name: "Helsinki", lat: 60.1807809, lng: 24.9582435, value: 1 },
    { name: "Warsaw", lat: 52.23467, lng: 20.97059, value: 1 },
    { name: "Vienna", lat: 48.24584, lng: 16.37682, value: 1 },
    { name: "Nice", lat: 43.68338, lng: 7.2028, value: 1 }
];

export const mapStyles = [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
    { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#263c3f' }] },
    { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#6b9a76' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#746855' }] },
    { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1f2835' }] },
    { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#f3d19c' }] },
    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f3948' }] },
    { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] },
    { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#17263c' }] }
];
