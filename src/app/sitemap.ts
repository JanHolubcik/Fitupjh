import type { MetadataRoute } from "next";

const sitemap = (): MetadataRoute.Sitemap => {
  const baseUrl = process.env.BETTER_AUTH_URL || "https://fitupjh.vercel.app";
  const languages = ["en", "sk"];
  
  // Public static routes to index
  const paths = [
    "", // Homepage
    "/login",
    "/signup",
    "/privacy-policy",
    "/terms-of-use",
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  paths.forEach((path) => {
    languages.forEach((lng) => {
      sitemapEntries.push({
        url: `${baseUrl}/${lng}${path}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: path === "" ? 1.0 : 0.8,
      });
    });
  });

  return sitemapEntries;
};

export default sitemap;
