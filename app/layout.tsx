import './globals.css';
import { LogoNext, LogoPython } from './icons';
import Link from 'next/link';
import { GeistSans } from 'geist/font/sans';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI SDK and FastAPI Examples',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        {children}
      </body>
    </html>
  );
}
