import Link from 'next/link';
import { ReactNode } from 'react';

const PARENT_BRAND_URL =
  process.env.NEXT_PUBLIC_PARENT_BRAND_URL || 'https://dentalcore.app';

/**
 * Marco comun de las paginas legales.
 *
 * Meta exige que la politica de privacidad, los terminos y las instrucciones
 * de eliminacion de datos sean accesibles SIN iniciar sesion. Por eso estas
 * rutas estan exceptuadas del redirect en proxy.ts.
 */
export const LegalLayout = ({
  titulo,
  actualizado,
  children,
}: {
  titulo: string;
  actualizado: string;
  children: ReactNode;
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full border-b border-[#2b2a2a]">
        <nav className="max-w-[820px] mx-auto px-[20px] h-[72px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-[10px]">
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="12" fill="#131019" />
              <path
                d="M24 9c-9 0-14 5-14 12 0 6 2 10 3.5 15 1 3.5 1.5 7 3.5 7s2.5-4 3.5-7.5c.7-2.5 1.8-4 3.5-4s2.8 1.5 3.5 4c1 3.5 1.5 7.5 3.5 7.5s2.5-3.5 3.5-7c1.5-5 3.5-9 3.5-15 0-7-5-12-14-12Z"
                fill="#2DD4BF"
              />
              <circle cx="35.5" cy="13.5" r="4.5" fill="#131019" />
              <circle cx="35.5" cy="13.5" r="2.5" fill="#F472B6" />
            </svg>
            <span className="text-[17px] font-[700]">
              Sonrisa<span className="text-[#2DD4BF]">Post</span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-[14px] text-[#B5B5B5] hover:text-white transition-colors"
          >
            Volver
          </Link>
        </nav>
      </header>

      <main className="max-w-[820px] w-full mx-auto px-[20px] py-[56px] flex-1">
        <h1 className="text-[36px] font-[700] leading-[1.2]">{titulo}</h1>
        <p className="mt-[10px] text-[13px] text-[#8E8E8E]">
          Última actualización: {actualizado}
        </p>
        <div className="mt-[36px] flex flex-col gap-[28px] text-[15px] text-[#D1D1D1] leading-[1.7]">
          {children}
        </div>
      </main>

      <footer className="border-t border-[#2b2a2a]">
        <div className="max-w-[820px] mx-auto px-[20px] py-[28px] flex flex-wrap gap-[16px] justify-between text-[13px] text-[#8E8E8E]">
          <div className="flex gap-[16px]">
            <Link href="/privacy" className="hover:text-white">
              Privacidad
            </Link>
            <Link href="/terms" className="hover:text-white">
              Términos
            </Link>
            <Link href="/eliminar-datos" className="hover:text-white">
              Eliminar mis datos
            </Link>
          </div>
          <div>
            by{' '}
            <a
              href={PARENT_BRAND_URL}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white underline underline-offset-2"
            >
              DentalCore
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const Seccion = ({
  titulo,
  children,
}: {
  titulo: string;
  children: ReactNode;
}) => (
  <section>
    <h2 className="text-[20px] font-[700] text-white mb-[10px]">{titulo}</h2>
    <div className="flex flex-col gap-[12px]">{children}</div>
  </section>
);
