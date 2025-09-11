/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ymts.blr1.cdn.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "ymts.blr1.digitaloceanspaces.com",
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["@react-pdf/renderer"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverExternalPackages: ["@alexandernanberg/react-pdf-renderer"],
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
