import type { Metadata } from 'next';
import './globals.css';
import BackgroundMusicPlayer from '@/components/BackgroundMusicPlayer';

export const metadata: Metadata = {
  title: 'Manifiesta con Lau',
  description: 'Tu ritual diario de manifestación, curado por Lau.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="glow-bg">
        {children}
        <BackgroundMusicPlayer />
      </body>
    </html>
  );
}
