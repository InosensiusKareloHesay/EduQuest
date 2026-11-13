import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/ui/Navbar';

export const metadata: Metadata = {
  title: 'EduQuest — Learn, Play, Grow!',
  description:
    'Game edukasi berbasis web yang menggabungkan kegiatan belajar, kuis interaktif, reward koin, dan kustomisasi avatar karakter chibi.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        <footer className="border-t border-slate-200 py-6 text-center text-xs font-bold text-slate-400 bg-white/60">
          EduQuest © {new Date().getFullYear()} · Next.js · Supabase · Netlify
        </footer>
      </body>
    </html>
  );
}

