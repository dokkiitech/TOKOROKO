"use client";

import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { logout } from '../login/actions'; // logout関数をインポート

export default function Map() {
    const [activeTab, setActiveTab] = useState('map');

    useEffect(() => {
        let map;
        if (activeTab === 'map') {
            if (L.DomUtil.get('map') !== null) {
                L.DomUtil.get('map')._leaflet_id = null;
            }

            map = L.map('map').setView([33.5902, 130.4017], 13); // 初期位置を福岡県に設定

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
                right: '10px', // ボタンを右端に配置
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column', // ボタンを縦に並べる
                gap: '10px' // ボタン間の余白
            }}>
                <button onClick={() => setActiveTab('map')} style={{ marginBottom: '10px' }}>マップ</button>
                <button onClick={() => setActiveTab('gallery')} style={{ marginBottom: '10px' }}>ギャラリー</button>
                <button onClick={handleLogout}>ログアウト</button>
            </div>
            {activeTab === 'map' && <div id="map" style={{ height: '100%' }}></div>}
            {activeTab === 'gallery' && (
                <div style={{ padding: '20px' }}>
                    <h2>ギャラリー</h2>
                    <ul>
                        <li>皿倉山</li>
                        <li>糸島</li>
                        <li>宮地嶽神社</li>
                    </ul>
                </div>
            )}
        </div>
    );
}
