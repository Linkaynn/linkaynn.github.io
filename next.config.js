/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Preserve the old (unprefixed) URLs by 301-redirecting them to the
  // default locale (es). 301s pass through link equity, so existing indexed
  // pages and inbound links keep their SEO value under the new /es, /en tree.
  async redirects() {
    return [
      { source: '/', destination: '/es', permanent: true },
      { source: '/blog', destination: '/es/blog', permanent: true },
      { source: '/blog/:slug', destination: '/es/blog/:slug', permanent: true },
    ];
  },
};

module.exports = nextConfig;
