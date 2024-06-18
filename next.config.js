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
            {
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          ],
        },
      },
    ],
});

module.exports = withPWA({
    reactStrictMode: true,
    swcMinify: true
});
