import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      allowedOrigins: [
        'https://bug-free-space-doodle-7vvgp6pgx5q63p4-3000.app.github.dev/',
        'localhost:3000',
        '127.0.0.1:3000'
      ]
    }
  }
};

export default nextConfig;
