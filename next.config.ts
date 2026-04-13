import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  // Enable Turbopack for faster dev (Next 15+)
  // turbopack: {},
};

export default withPayload(nextConfig);
