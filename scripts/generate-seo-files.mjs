// Builds robots.txt, sitemap.xml and rss.xml (into src/generated/) and the
// prerender routes list (routesFile.txt) from the site URL, nav links and blog posts.
// /404 is prerendered too and copied to 404.html after the build (see package.json).
// Hidden pages (not in the navbar or sitemap) are prerendered as well.
// Runs automatically before `npm start`, `npm run build` and the SSR/prerender scripts.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(join(root, path), 'utf8');

// environment.ts is git-ignored, so fall back to the committed template.
const envFile = ['src/environments/environment.ts', 'src/environments/environment.ts.bak']
  .find((path) => existsSync(join(root, path)));
const siteUrl = read(envFile).match(/url:\s*'([^']+)'/)[1].replace(/\/$/, '');

// Hidden pages: the current affairs landing page and one page per day.
const quizDates = [...read('src/app/data/current-affairs.data.ts').matchAll(/date:\s*'(\d{4}-\d{2}-\d{2})'/g)].map((m) => m[1]);
const hiddenPaths = ['/current-affairs', ...quizDates.map((date) => `/current-affairs/${date}`)];
const navPaths = [...read('src/app/data/nav-link.data.ts').matchAll(/path:\s*'([^']+)'/g)].map((m) => m[1]);
const profileName = read('src/app/data/profile.data.ts').match(/name:\s*'([^']+)'/)[1];
const posts = JSON.parse(read('src/assets/json/blogs.json')).data
  .map((item) => item.attributes)
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

const escapeXml = (text) => text.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));
const blogPaths = posts.map((post) => `/blog/${post.slug}`);
// The blog index changes whenever a post is added or updated.
const blogLastmod = posts.map((post) => post.updatedAt.slice(0, 10)).sort().at(-1);
const lastmod = (path) => path === '/blog' && blogLastmod ? `<lastmod>${blogLastmod}</lastmod>` : '';

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${navPaths.map((path) => `  <url><loc>${siteUrl}${path}</loc>${lastmod(path)}</url>`).join('\n')}
${posts.map((post) => `  <url><loc>${siteUrl}/blog/${post.slug}</loc><lastmod>${post.updatedAt.slice(0, 10)}</lastmod></url>`).join('\n')}
</urlset>
`;

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(profileName)} - Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Guides, tutorials and cheat sheets by ${escapeXml(profileName)}</description>
    <language>en</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${posts.map((post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid>${siteUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(post.summary)}</description>
    </item>`).join('\n')}
  </channel>
</rss>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

mkdirSync(join(root, 'src/generated'), { recursive: true });
writeFileSync(join(root, 'src/generated/sitemap.xml'), sitemap);
writeFileSync(join(root, 'src/generated/rss.xml'), rss);
writeFileSync(join(root, 'src/generated/robots.txt'), robots);
writeFileSync(join(root, 'routesFile.txt'), [...navPaths, ...hiddenPaths, ...blogPaths, '/404'].join('\n') + '\n');

console.log(`SEO files generated for ${siteUrl} (${navPaths.length} pages, ${posts.length} posts)`);
