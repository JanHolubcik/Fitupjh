import type { MetadataRoute } from "next";

const robots = (): MetadataRoute.Robots => {
  const baseUrl = process.env.BETTER_AUTH_URL || "https://fitupjh.vercel.app";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/*/onboarding", "/*/dashboard", "/*/profile"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
};

export default robots;
