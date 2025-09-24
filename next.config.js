export default {
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = { ...(config.resolve.alias || {}),
      'next/dist/pages/_app': 'next/app',
      'next/dist/pages/_document': 'next/document',
    };
    return config;
  },
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = { ...(config.resolve.alias || {}),
      'next/dist/pages/_app': 'next/app',
      'next/dist/pages/_document': 'next/document',
    };
    return config;
  },
 experimental: { appDir: true } }
