// This file is automatically processed by Next.js to generate sitemap.xml
export default async function sitemap() {
  const baseUrl = 'https://devkit.vercel.app'; // Adjust if needed; for local dev, it will be replaced
  const routes = [
    '',
    'about',
    'privacy',
    'terms',
  ].map((route) => ({
    url: `${baseUrl}/${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: 1.0,
  }));

  const tools = [
    'json-formatter',
    'base64-converter',
    'markdown-preview',
    'image-converter',
    'audio-to-text',
    'data-shifter',
    'url-transmuter',
    'xml-beautifier',
    'sql-formatter',
    'css-optimizer',
    'jwt-decoder',
    'uuid-generator',
    'password-generator',
    'hash-calculator',
    'regex-tester',
    'html-entity-swapper',
  ];

  tools.forEach((tool) => {
    routes.push({
      url: `${baseUrl}/tools/${tool}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    });
  });

  return routes;
}