import type { Metadata } from 'next';
import '../app/globals.css';
import Navbar from '../components/Navbar';

export const metadata: Metadata = {
  title: 'Courtney Kisa',
  description: 'Personal gallery & blog',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
