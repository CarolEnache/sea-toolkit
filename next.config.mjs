/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['duckdb'],
  webpack: (config) => {
    config.externals = [...config.externals, 'duckdb'];
    config.resolve = { ...config.resolve, alias: { ...config.resolve.alias,
      "@/*": ["src/*"]
    }}
    return config;
  },
};

export default nextConfig;
