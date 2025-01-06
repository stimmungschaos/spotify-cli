/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/oauth/spotify/callback',
        destination: '/api/oauth/spotify/callback',
      },
    ];
  },
};

module.exports = nextConfig;
