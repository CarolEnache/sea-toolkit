/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['duckdb'],
  webpack: (config) => {
    config.externals = [...config.externals, 'duckdb'];
    return config;
  },
};

export default nextConfig;
