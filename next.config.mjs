/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
              protocol: "https",
              hostname: "img.clerk.com",
              port: "",
            },
            {
              protocol: "https",
              hostname: "academy.tinta.wine",
              port: "",
            },
          ]
    }
};

export default nextConfig;
