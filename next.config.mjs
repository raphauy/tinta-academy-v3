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
            {
              protocol: "https",
              hostname: "utfs.io",
              port: "",
            },
            {
              protocol: "https",
              hostname: "ufs.sh",
              port: "",
            },
            {
              protocol: "https",
              hostname: "b74vdw3py7.ufs.sh",
              port: "",
            },
          ]
    }
};

export default nextConfig;
