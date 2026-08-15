import '../global.scss';
import { ReactNode } from 'react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import clsx from 'clsx';
import { Metadata } from 'next';

const jakartaSans = Plus_Jakarta_Sans({
  weight: ['500', '600', '700'],
  style: ['normal'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SonrisaPost · Redes sociales para consultorios odontológicos',
  description:
    'Programá tus publicaciones en Instagram, TikTok, LinkedIn y más desde un solo calendario. Con plantillas de contenido por especialidad odontológica. Gratis y de código abierto.',
  openGraph: {
    title: 'SonrisaPost · Redes sociales para consultorios odontológicos',
    description:
      'Todas las redes de tu consultorio en un solo calendario. Gratis, con contenido odontológico ya escrito.',
    type: 'website',
  },
};

export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.png" />
      </head>
      <body
        className={clsx(jakartaSans.className, 'dark bg-[#0E0E0E] text-white')}
      >
        {children}
      </body>
    </html>
  );
}
