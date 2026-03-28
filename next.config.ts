import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Parent folder にも package-lock があると、Turbopack がルートを誤認識し
  // calendar-app/.env.local が読み込まれないことがある。
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
