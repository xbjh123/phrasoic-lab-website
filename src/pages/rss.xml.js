import { POSTS, SITE } from '../data/posts';

export function GET() {
  const items = POSTS.map(p => `  <item>
    <title>${p.title}</title>
    <link>https://xbjh123.github.io/phrasoic-lab-website/blog/${p.slug}/</link>
    <description>${p.excerpt}</description>
    <pubDate>${new Date(p.date.split(' ')[0]).toUTCString()}</pubDate>
    <category>${p.cat}</category>
    <guid>https://xbjh123.github.io/phrasoic-lab-website/blog/${p.slug}/</guid>
  </item>`).join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${SITE.name}</title>
  <link>https://xbjh123.github.io/phrasoic-lab-website/</link>
  <description>${SITE.description}</description>
  <atom:link href="https://xbjh123.github.io/phrasoic-lab-website/rss.xml" rel="self" type="application/rss+xml"/>
${items}
</channel>
</rss>`;

  return new Response(rss, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
