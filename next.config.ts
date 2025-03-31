import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  //add lh3.googleusercontent.com as allowed image domain
  images: {
    domains: [
      process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '') || '',
      "lh3.googleusercontent.com",
      "cdn.discordapp.com",
      "avatars.githubusercontent.com",
      "github.com",
      "images.unsplash.com",
      "www.gravatar.com",
      "i.imgur.com",
    ],
  },
};

export default nextConfig;
