"use client";

import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { logout } from '../login/actions'; 


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Map() {
    const [activeTab, setActiveTab] = useState('map');

    useEffect(() => {
        if (activeTab === 'map') {
            if (L.DomUtil.get('map') !== null) {
                L.DomUtil.get('map')._leaflet_id = null;
            }

            const map = L.map('map').setView([33.5902, 130.4017], 10); // 初期位置を福岡県に設定

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            
            const locations = [
                { name: '皿倉山', coords: [33.84786079278701, 130.79703742303604] },
                { name: 'seven x seven糸島', coords: [33.642520255780724, 130.2021625519222] },
                { name: '宮地嶽神社', coords: [33.78003904204504, 130.48621472695646] },
            ];

            locations.forEach(location => {
                L.marker(location.coords)
                    .addTo(map)
                    .bindPopup(location.name);
            });

            // 現在地
            const blueCircle = L.circleMarker([0, 0], {
                radius: 8,
                fillColor: "#007bff",
                color: "#007bff",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(map);

            // 現在地の追跡
            if (navigator.geolocation) {
                const watchId = navigator.geolocation.watchPosition((position) => {
                    const { latitude, longitude } = position.coords;
                    blueCircle.setLatLng([latitude, longitude]);
                }, (error) => {
                    console.error("Error getting location: ", error.message || error);
                }, {
                    enableHighAccuracy: true,
                    maximumAge: 0,
                    timeout: 10000
                });

                return () => {
                    navigator.geolocation.clearWatch(watchId);
                };
            }
        }
    }, [activeTab]);

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div style={{ position: 'relative', height: '100vh' }}>
            <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px', 
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'row',
                gap: '10px'
            }}>
                <button onClick={() => setActiveTab('map')}>マップ</button>
                <button onClick={() => setActiveTab('gallery')}>ギャラリー</button>
                <button onClick={handleLogout}>ログアウト</button>
            </div>
            {activeTab === 'map' && <div id="map" style={{ height: '100%' }}></div>}
            {activeTab === 'gallery' && (
                <div style={{ padding: '20px' }}>
                    <h2>ギャラリー</h2>
                    {/* ギャラリーのコンテンツ */}
                </div>
            )}
        </div>
    );
}
