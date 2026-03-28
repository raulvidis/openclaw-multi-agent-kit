/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow reading markdown files from anywhere in the repo during build
  serverExternalPackages: [],
  // Static export for pure docs site (optional — remove if you need SSR)
  // output: 'export',
};

module.exports = nextConfig;
