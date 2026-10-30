import type { Metadata } from 'next';
import { Manrope, Instrument_Serif, Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { DemoBar } from '../components/common/DemoBar';
import { MobileBottomNav } from '../components/common/MobileBottomNav';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument-serif',
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Capital Connect Conclave 2026 | Startup Synerz',
  description:
    'The premier digital capital discovery and venture summit connecting visionary founders with institutional capital, family offices, and leading syndicates.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${instrumentSerif.variable} ${inter.variable} dark`}
      style={{ fontFamily: 'var(--font-manrope), sans-serif' }}
    >
      <body className="min-h-screen bg-[#080D16] text-[#F5F3EF] flex flex-col selection:bg-[#D2B47C]/30 selection:text-[#FFF0D4] pb-[calc(env(safe-area-inset-bottom,0px)+5.5rem)] md:pb-0">
        <AuthProvider>
          <DemoBar />
          <div className="flex-1 flex flex-col">{children}</div>
          <MobileBottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
