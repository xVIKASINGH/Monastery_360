/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: ["http://localhost:3000"], // or whatever your frontend URL is
  },
};

module.exports = nextConfig;
