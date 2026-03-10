/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/backend/:path*',
        destination: 'http://localhost:5000/api/:path*', // your Express backend
      },
    ];
  },
};

module.exports = nextConfig;
