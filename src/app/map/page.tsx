"use client";

import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function Map() {
    useEffect(() => {
        if (L.DomUtil.get('map') !== null) {
            L.DomUtil.get('map')._leaflet_id = null;
        }

        const map = L.map('map').setView([33.5902, 130.4017], 13); // 初期位置を福岡県に設定

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        const blueCircle = L.circleMarker([0, 0], {
            radius: 8,
            fillColor: "#007bff",
            color: "#007bff",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);

        if (navigator.geolocation) {
            const watchId = navigator.geolocation.watchPosition((position) => {
                const { latitude, longitude } = position.coords;
                blueCircle.setLatLng([latitude, longitude]);
                map.setView([latitude, longitude], 13);
            }, (error) => {
                console.error("Error getting location: ", error);
            }, {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 5000
            });

            return () => {
                navigator.geolocation.clearWatch(watchId);
            };
        }
    }, []);

    return <div id="map" style={{ height: '100vh' }}></div>;
}