/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: ["http://localhost:3000"], // or whatever your frontend URL is
  },
  images: {
    // allow cloudinary and similar hosts used in the static data
    domains: ["res.cloudinary.com"],
  },
};

module.exports = nextConfig;
