/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: false,
  },
  // Remove ignoreBuildErrors to force fixes
  typescript: {
    // ignoreBuildErrors: true, // removed
  },
  async rewrites() {
    return [
      {
        source: '/backend/:path*',
        destination: `http://localhost:3000/api/:path*`, 
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;

