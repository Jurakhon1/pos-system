import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Оптимизация сборки
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Оптимизация производительности
  experimental: {
    // Включаем оптимизации для Next.js 15
    optimizePackageImports: [
      '@radix-ui/react-dialog',
      '@radix-ui/react-label', 
      '@radix-ui/react-separator',
      '@radix-ui/react-slot',
      '@radix-ui/react-switch',
      '@radix-ui/react-tooltip',
      'lucide-react',
      'framer-motion',
      'sonner'
    ],
  },

  // Оптимизация изображений
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 дней
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    
    // Оптимизация для Timeweb Cloud
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Оптимизация веб-пака
  webpack: (config, { dev, isServer }) => {
    // Оптимизация для продакшена
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
              chunks: 'all',
            },
            radix: {
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
              name: 'radix-ui',
              priority: 20,
              chunks: 'all',
            },
            framer: {
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              name: 'framer-motion',
              priority: 20,
              chunks: 'all',
            },
            lucide: {
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
              name: 'lucide',
              priority: 20,
              chunks: 'all',
            },
          },
        },
      };
    }

    // Оптимизация для сервера
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'framer-motion': 'framer-motion',
        'sonner': 'sonner',
      });
    }

    return config;
  },

  // Оптимизация заголовков
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },

  // Оптимизация компрессии
  compress: true,
  
  // Отключение генерации source maps в продакшене
  productionBrowserSourceMaps: false,
  
  // Оптимизация статических файлов
  poweredByHeader: false,
  
  // Оптимизация для Timeweb Cloud
  output: 'standalone',
};

export default nextConfig;
