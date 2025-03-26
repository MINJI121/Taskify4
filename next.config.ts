import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  devIndicators: false,
  images: {
    domains: [
      "sprint-fe-project.s3.ap-northeast-2.amazonaws.com", // 에러에 나온 도메인 등록
    ],
  },
};

export default nextConfig;
