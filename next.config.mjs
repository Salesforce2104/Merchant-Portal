/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://313e496e347a.ngrok-free.app/api/:path*',
      },
    ];
  },
};

export default nextConfig;
