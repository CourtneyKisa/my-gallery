import './globals.css';
import React from 'react';
import Navbar from '../components/Navbar';
import SiteFooter from '../components/SiteFooter';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
