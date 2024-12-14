import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        serverActions: {}, 
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
};


// console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
// console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default nextConfig;
