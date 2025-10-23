import { NextResponse } from 'next/server';
import { getAllPostsMeta } from '../../lib/posts';

export const revalidate = 60;

export async function GET() {
  const site = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');

  const posts = getAllPostsMeta(false);

  const items = posts
    .map((p) => {
      const link = `${site}/blog/${encodeURIComponent(p.slug)}`;
      const title = escapeXml(p.title);
      const desc = p.excerpt ? `<description><![CDATA[${p.excerpt}]]></description>` : '';
      const pub = new Date(p.date).toUTCString();
      return `<item>
<title><![CDATA[${title}]]></title>
<link>${link}</link>
<guid>${link}</guid>
<pubDate>${pub}</pubDate>
${desc}
</item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>Courtney Kisa — Blog</title>
<link>${site}</link>
<description>Personal blog feed</description>
${items}
</channel>
</rss>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}

function escapeXml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
