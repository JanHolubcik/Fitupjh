/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
        serverComponentsExternalPackages:['mongoose','@typegoose/typegoose']
    }, 
};

export default nextConfig;
