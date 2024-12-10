import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        serverActions: {}, // 空のオブジェクトを指定
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/login',
                permanent: false,
            },
        ];
    },
    // 他のオプションをここに記述
};

export default nextConfig;
