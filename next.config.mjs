/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'buisnesstools-course.b-cdn.net',
          },
        ],
      },
};

export default nextConfig;