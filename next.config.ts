import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdfjs-dist', 'mammoth'],
  images: {
    unoptimized: true
  },
  // Vercel specific optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  // Disable ESLint during build for deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript checking during build for deployment
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
