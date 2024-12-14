"use client";

import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { logout } from '../login/actionsLogout';
import Image from 'next/image';
import './MapPage.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Map() {
    const [activeTab, setActiveTab] = useState('map');
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [showBadge, setShowBadge] = useState(false);

    useEffect(() => {
        if (activeTab === 'map') {
            if (L.DomUtil.get('map') !== null) {
                L.DomUtil.get('map')._leaflet_id = null;
            }

            const map = L.map('map').setView([33.5902, 130.4017], 10);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors',
            }).addTo(map);

            const locations = [
                {
                    name: '皿倉山',
                    coords: [33.84786079278701, 130.79703742303604],
                    imageUrl: '/images/sarakurayama.jpg',
                    description: '皿倉山は福岡県北九州市にある山です。',
                    badge: '/images/sarakura.png',
                },
                {
                    name: '糸島',
                    coords: [33.642520255780724, 130.2021625519222],
                    imageUrl: '/images/itoshima.jpg',
                    description: '糸島は美しい海岸線で知られる町です。',
                    badge: '/images/itoshima.png',
                },
                {
                    name: '宮地嶽神社',
                    coords: [33.78003904204504, 130.48621472695646],
                    imageUrl: '/images/miyajidake.jpg',
                    description: '宮地嶽神社は光の道で有名な神社です。',
                    badge: '/images/miyajidake.png',
                },
            ];

            locations.forEach((location) => {
                const marker = L.marker(location.coords).addTo(map);

                marker.on('click', () => {
                    setSelectedLocation(location);
                });
            });

            // 現在地
            const blueCircle = L.circleMarker([0, 0], {
                radius: 8,
                fillColor: '#007bff',
                color: '#007bff',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8,
            }).addTo(map);

            // 現在地の追跡
            if (navigator.geolocation) {
                const watchId = navigator.geolocation.watchPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        blueCircle.setLatLng([latitude, longitude]);
                    },
                    (error) => {
                        console.error('Error getting location: ', error.message || error);
                    },
                    {
                        enableHighAccuracy: true,
                        maximumAge: 0,
                        timeout: 10000,
                    }
                );

                return () => {
                    navigator.geolocation.clearWatch(watchId);
                };
            }
        }
    }, [activeTab]);

    const handleLogout = async () => {
        await logout();
    };

    const handleCloseDialog = () => {
        setSelectedLocation(null);
        setShowBadge(false);
    };

    const handleShowBadge = () => {
        setShowBadge(true);
    };

    return (
        <div style={{ position: 'relative', height: '100vh' }}>
            <div
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '10px',
                }}
            >
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

            {/* ダイアログの表示 */}
            {selectedLocation && (
                <div onClick={handleCloseDialog} className="dialog-overlay">
                    <div onClick={(e) => e.stopPropagation()} className="dialog-content">
                        <h2>{selectedLocation.name}</h2>
                        <Image
                            src={selectedLocation.imageUrl}
                            alt={selectedLocation.name}
                            width={600}
                            height={400}
                        />
                        <p>{selectedLocation.description}</p>
                        <button onClick={handleShowBadge} className="badge-button">バッジを表示</button>
                        {showBadge && <Image src={selectedLocation.badge} alt="バッジ" width={100} height={100} />}
                        <button onClick={handleCloseDialog} className="close-button">閉じる</button>
                    </div>
                </div>
            )}
        </div>
    );
}