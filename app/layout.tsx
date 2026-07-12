import type { Metadata } from 'next';
import './globals.css';
import BackgroundMusicPlayer from '@/components/BackgroundMusicPlayer';

export const metadata: Metadata = {
  title: 'Manifiesta con Lau',
  description: 'Tu ritual diario de manifestación, curado por Lau.',
  manifest: '/manifest.json',
  themeColor: '#0D0D14',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Manifiesta',
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
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
