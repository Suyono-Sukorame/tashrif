import type { Metadata } from 'next';
import { Inter, Amiri, IBM_Plex_Sans_Arabic } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-serif-arabic',
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans-arabic',
});

export const metadata: Metadata = {
  title: 'Tashrif Master',
  description: 'Enterprise-grade Arabic Verb Conjugator',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${inter.variable} ${amiri.variable} ${ibmPlexArabic.variable} antialiased`}>
      <body className="bg-stone-50 text-stone-900 min-h-screen">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
