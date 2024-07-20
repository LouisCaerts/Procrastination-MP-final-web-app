<<<<<<< Updated upstream
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true
};

module.exports = nextConfig;
=======
const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    sw: 'sw.js',
    runtimeCaching: [
      {
        urlPattern: /.*\.(?:png|gif|jpg)/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'images',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
        },
      },
      {
        urlPattern: /.*\.(?:css|js|scss)/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'assets',
        },
      },
      {
        urlPattern: new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts',
          plugins: [
            //new (require('workbox-cacheable-response').Plugin)({
            //  statuses: [0, 200],
            //}),
          ],
        },
      },
      {
        urlPattern: /^https?.*/, // Caching all other requests
        handler: 'NetworkFirst',
        options: {
          cacheName: 'offline-cache',
          networkTimeoutSeconds: 10,
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
    buildExcludes: [/middleware-manifest\.json$/],
    include: [/\.js$/, /\.css$/, /\.html$/, /\.json$/],
  });
  
  module.exports = withPWA({
    reactStrictMode: true,
    swcMinify: true,
  });  
>>>>>>> Stashed changes
