import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'VibeTravel AI - Bento Edition',
  description: 'Seu guia de bolso inteligente com design Bento Grid.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="antialiased selection:bg-indigo-500 selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
