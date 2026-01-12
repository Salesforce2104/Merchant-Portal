/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://43.205.174.122/api/:path*',
      },
    ];
  },
};

export default nextConfig;
