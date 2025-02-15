import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: "10mb",
        },
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "genesoft.s3.ap-southeast-1.amazonaws.com",
            },
            {
                protocol: "https",
                hostname: "genesoft-dev.s3.ap-southeast-1.amazonaws.com",
            },
            {
                protocol: "https",
                hostname:
                    "genesoft-customer-project.s3.ap-southeast-1.amazonaws.com",
            },
            {
                protocol: "https",
                hostname:
                    "genesoft-customer-project-dev.s3.ap-southeast-1.amazonaws.com",
            },
        ],
    },
};

export default nextConfig;
