"use client";

import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { logout } from '../login/actionsLogout';
import Image from 'next/image';
import './MapPage.css';
import { supabase } from './supabaseClient';
import Cookies from 'js-cookie';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Map() {
    const [activeTab, setActiveTab] = useState('map');
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [showBadge, setShowBadge] = useState(false);
    const [animateBadge, setAnimateBadge] = useState(false);
    const [galleryImages, setGalleryImages] = useState([]); // ギャラリー画像の状態

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
                {
                    name: 'TOKOROKO',
                    coords: [33.88235560077813, 130.88067377015054],
                    imageUrl: '/images/dolyNFT.png',
                    description: 'TOKOROKOの生まれた地です。' +
                        'どりーNFTをスクショしよう！！',
                    badge: '/images/dolyNFT.png',
                }
            ];

            locations.forEach((location) => {
                const marker = L.marker(location.coords).addTo(map);

                marker.on('click', () => {
                    setSelectedLocation(location);
                });
            });

            const blueCircle = L.circleMarker([0, 0], {
                radius: 8,
                fillColor: '#007bff',
                color: '#007bff',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8,
            }).addTo(map);

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
        } else if (activeTab === 'gallery') {
            fetchGalleryImages();
        }
    }, [activeTab]);

    const handleCloseDialog = () => {
        setSelectedLocation(null);
        setShowBadge(false);
    };

    const handleShowBadge = async () => {
        if (!selectedLocation) {
            alert('バッジを特定できませんでした。もう一度お試しください。');
            console.error('selectedLocation が設定されていません。');
            return;
        }

        const userId = Cookies.get('uid');

        if (!userId) {
            alert('ユーザーIDが見つかりませんでした。再ログインしてください。');
            console.error('ユーザーIDがクッキーから取得できませんでした。');
            return;
        }

        try {
            const { data: nftData, error: nftError } = await supabase
                .from('nft')
                .select('id') // 必要な列 (id) のみ取得
                .eq('image_path', selectedLocation.badge) // 選択されたバッジの image_path を基に検索
                .limit(1); // 一致するデータが1つのみであることを期待

            if (nftError || !nftData || nftData.length === 0) {
                console.error('NFT情報の取得に失敗しました:', nftError);
                alert('バッジ情報を保存できませんでした');
                return;
            }

            const nftId = nftData[0].id;

            const { error: insertError } = await supabase
                .from('nfts_users')
                .insert({
                    user_id: userId,
                    nft_id: nftId,
                });

            if (insertError) {
                console.error('nfts_usersテーブルへの挿入に失敗しました:', insertError);
                alert('バッジ情報を保存できませんでした');
                return;
            }

            setShowBadge(true);
            setAnimateBadge(true);

            // ギャラリー更新
            fetchGalleryImages();
        } catch (error) {
            console.error('バッジ処理中にエラーが発生しました:', error);
            alert('バッジ処理中に問題が発生しました。');
        }
    };

    const fetchGalleryImages = async () => {
        const userId = Cookies.get('uid');

        if (!userId) {
            alert('ユーザーIDが見つかりませんでした。再ログインしてください。');
            console.error('ユーザーIDが見つかりません。');
            return;
        }

        try {
            const { data: userNFTs, error: userNFTError } = await supabase
                .from('nfts_users')
                .select('nft_id')
                .eq('user_id', userId);

            if (userNFTError || !userNFTs) {
                console.error('ユーザーNFTの取得に失敗しました:', userNFTError);
                return;
            }

            const nftIds = userNFTs.map((nft) => nft.nft_id);
            const { data: nftData, error: nftError } = await supabase
                .from('nft')
                .select('id, image_path')
                .in('id', nftIds);

            if (nftError || !nftData) {
                console.error('NFT画像データの取得に失敗しました:', nftError);
                return;
            }

            setGalleryImages(nftData);
        } catch (error) {
            console.error('ギャラリー画像の取得中にエラーが発生しました:', error);
        }
    };

    const handleBadgeAnimationEnd = () => {
        setAnimateBadge(false);
        setShowBadge(false);
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
                <button onClick={logout}>ログアウト</button>
            </div>
            {activeTab === 'map' && <div id="map" style={{ height: '100%' }}></div>}
            {activeTab === 'gallery' && (
                <div style={{ padding: '20px' }}>
                    <h2>ギャラリー</h2>
                    <div className="gallery-grid">
                        {galleryImages.map((nft) => (
                            <div key={nft.id} className="gallery-item">
                                <Image
                                    src={nft.image_path}
                                    alt={`NFT ID: ${nft.id}`}
                                    width={200}
                                    height={200}
                                    className="gallery-image"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {selectedLocation && (
                <div onClick={handleCloseDialog} className="dialog-overlay">
                    <div onClick={(e) => e.stopPropagation()} className="dialog-content">
                        <h2>{selectedLocation.name}</h2>
                        <Image
                            src={selectedLocation.imageUrl}
                            alt={selectedLocation.name}
                            width={600}
                            height={selectedLocation.imageUrl === "/images/dolyNFT.png" ? 600 : 400}


                        />
                        <p>{selectedLocation.description}</p>
                        <button onClick={handleShowBadge} className="badge-button">バッジを保存</button>
                        {showBadge && (
                            <div className="badge-overlay">
                                <div
                                    className={`badge-container ${animateBadge ? "fadeInScale" : ""}`}
                                    onAnimationEnd={handleBadgeAnimationEnd}
                                >
                                    <Image
                                        src={selectedLocation.badge}
                                        alt="バッジ"
                                        width={325}
                                        height={300}
                                        className="badge"
                                    />
                                </div>
                            </div>
                        )}
                        <button onClick={handleCloseDialog} className="close-button">閉じる</button>
                    </div>
                </div>
            )}
        </div>
    );
}
