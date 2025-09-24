/**
 * Next.js config (CJS) for Next 15
 * - Removes deprecated experimental.appDir
 * - Adds aliases for legacy Next internals used by some deps
 * @type {import('next').NextConfig}
 */
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

module.exports = nextConfig;
