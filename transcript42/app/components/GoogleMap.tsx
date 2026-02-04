"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { mapStyles } from "../constants/mapData";
import { City } from "../types/city";
import { getCityData } from "../actions/getCityData";
import "../styles/map.css";

declare global {
    interface Window {
        google: any;
    }
}

export default function GoogleMap() {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const [cities, setCities] = useState<City[]>([]);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    const createMarker = (map: any, city: City) => {
        const marker = new window.google.maps.Marker({
            position: { lat: city.lat, lng: city.lng },
            map,
            icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 15,
                fillColor: "#00babc",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2,
            },
            label: {
                text: city.value.toString(),
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: "bold",
            },
        });

        const infoWindow = new window.google.maps.InfoWindow({
            content: `
        <div style="color: #454545ff; font-family: Arial, sans-serif; padding: 8px;">
          <strong style="color: #00babc; font-size: 16px;">${city.name}</strong><br>
          <div style="margin-top: 4px; font-size: 14px;">Students: <strong>${city.value}</strong></div>
        </div>
      `,
        });

        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });

        return marker;
    };

    const initMap = () => {
        if (!mapRef.current || !window.google || mapInstance.current) return;

        mapInstance.current = new window.google.maps.Map(mapRef.current, {
            center: { lat: 30, lng: -35 },
            zoom: 3.1,
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
            styles: mapStyles,
            backgroundColor: "#1d2028",
        });

        setIsMapLoaded(true);
    };

    useEffect(() => {
        const loadData = async () => {
            const data = await getCityData();
            setCities(data);
        };
        loadData();

        if (window.google) {
            initMap();
        }
    }, []);

    useEffect(() => {
        if (isMapLoaded && cities.length > 0 && mapInstance.current) {
            cities.forEach((city) => createMarker(mapInstance.current, city));
        }
    }, [isMapLoaded, cities]);

    return (
        <>
            <Script
                src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=geometry,drawing,places`}
                onLoad={initMap}
            />
            <div className="map-wrapper">
                <div id="map" ref={mapRef} />
            </div>
        </>
    );
}

