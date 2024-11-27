import { NextConfig } from 'next';

/** @type {NextConfig} */
const nextConfig: NextConfig = {
    async redirects() {
        return [
            {
                source: "/",
                destination: "/chat",
                permanent: true,
            },
        ];
    },
    images: {
        remotePatterns: [
            {
                hostname: "exciting-marlin-134.convex.cloud",
            },
        ],
    },
};

export default nextConfig;
