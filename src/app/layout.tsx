import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import '../app/globals.css';
import Navbar from '../components/Navbar';
import { getSiteUrl } from '../lib/site';

const site = getSiteUrl();
const title = 'Courtney Kisa';
const description = 'Personal gallery, blog, and portfolio.';

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title,
  description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: site,
    title,
    description,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Courtney Kisa' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
  <SiteHeader />
        <Navbar />
        {children}
        <SiteFooter />
</body>
    </html>
  );
}
