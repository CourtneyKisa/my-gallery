/** @type {import('next').NextConfig} */
const nextConfig = {
  // Still supported in Next 16 (optional)
  typescript: { ignoreBuildErrors: true },

  // Keep if you plan to load external images
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' }
    ]
  }
};

module.exports = nextConfig;
