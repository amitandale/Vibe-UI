/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'next/dist/pages/_app': 'next/app',
      'next/dist/pages/_document': 'next/document',
    };
    return config;
  },
};

export default nextConfig;
