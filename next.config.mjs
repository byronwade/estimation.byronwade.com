/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "placehold.co",
			},
		],
	},
	env: {
		NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
		OPENAI_API_KEY: process.env.OPENAI_API_KEY,
	},
};

export default nextConfig;
