/** @type {import("next").NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    distDir: "dist",
    output: "export",
    sassOptions: {
        silenceDeprecations: [
            "legacy-js-api",
            "import",
            "global-builtin",
        ],
    },
};

export default nextConfig;
