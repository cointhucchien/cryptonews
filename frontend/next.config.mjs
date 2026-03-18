/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  // Tắt Google Fonts optimization — tránh lỗi khi build không có internet
  optimizeFonts: false,
};

export default nextConfig;
