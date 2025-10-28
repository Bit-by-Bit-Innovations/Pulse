import withPWAInit from "next-pwa";

const runtimeCaching = [
  {
    urlPattern: ({ request, url }) => {
      if (self.origin !== url.origin) {
        return false;
      }

      return request.destination === "document";
    },
    handler: "NetworkFirst",
    options: {
      cacheName: "pages-cache",
      networkTimeoutSeconds: 10,
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60
      },
      cacheableResponse: {
        statuses: [0, 200]
      }
    }
  },
  {
    urlPattern: ({ request, url }) => {
      if (self.origin !== url.origin) {
        return false;
      }

      return ["style", "script", "worker"].includes(request.destination);
    },
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "static-resources",
      expiration: {
        maxEntries: 64,
        maxAgeSeconds: 24 * 60 * 60
      },
      cacheableResponse: {
        statuses: [0, 200]
      }
    }
  },
  {
    urlPattern: ({ request, url }) => {
      if (self.origin !== url.origin) {
        return false;
      }

      return request.destination === "image";
    },
    handler: "CacheFirst",
    options: {
      cacheName: "image-cache",
      expiration: {
        maxEntries: 64,
        maxAgeSeconds: 30 * 24 * 60 * 60
      },
      cacheableResponse: {
        statuses: [0, 200]
      }
    }
  },
  {
    urlPattern: /\/\_next\/data\/.*\.json$/i,
    handler: "NetworkFirst",
    options: {
      cacheName: "next-data",
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60
      },
      cacheableResponse: {
        statuses: [0, 200]
      }
    }
  },
  {
    urlPattern: /^https:\/\/fonts\.(?:gstatic|googleapis)\.com\/.*/i,
    handler: "CacheFirst",
    options: {
      cacheName: "google-fonts",
      expiration: {
        maxEntries: 16,
        maxAgeSeconds: 365 * 24 * 60 * 60
      },
      cacheableResponse: {
        statuses: [0, 200]
      }
    }
  }
];

const withPWA = withPWAInit({
  dest: "public",
  register: false,
  skipWaiting: true,
  clientsClaim: true,
  scope: "/",
  runtimeCaching,
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
  buildExcludes: [/middleware-manifest\.json$/]
});

const nextConfig = {
  reactStrictMode: true
};

export default withPWA(nextConfig);
