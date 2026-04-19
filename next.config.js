/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/img/:path*',
        destination: 'https://static.wikia.nocookie.net/:path*',
      },
    ]
  },
}
module.exports = nextConfig