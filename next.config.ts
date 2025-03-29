import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  //add lh3.googleusercontent.com as allowed image domain
  images: {
    domains: [
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
