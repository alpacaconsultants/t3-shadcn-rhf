/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import('./src/env.js');

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    typedRoutes: true,
    serverComponentsExternalPackages: ['@aws-sdk/s3-request-presigner'],
  },
};

export default config;
