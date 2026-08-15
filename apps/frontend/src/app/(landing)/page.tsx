export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { DENTAL_SPECIALTIES } from '@gitroom/helpers/dental/dental.specialties';
import { DENTAL_EVENTS } from '@gitroom/helpers/dental/dental.calendar';

const PARENT_BRAND_URL =
  process.env.NEXT_PUBLIC_PARENT_BRAND_URL || 'https://dentalcore.app';
const SOURCE_CODE_URL =
  process.env.NEXT_PUBLIC_SOURCE_CODE_URL ||
  'https://github.com/sonrisapost/sonrisapost-app';

const TOTAL_PLANTILLAS = DENTAL_SPECIALTIES.reduce(
  (acc, e) => acc + e.templates.length,
  0
);

const Marca = () => (
  <div className="flex items-center gap-[10px]">
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="12" fill="#131019" />
      <path
        d="M24 9c-9 0-14 5-14 12 0 6 2 10 3.5 15 1 3.5 1.5 7 3.5 7s2.5-4 3.5-7.5c.7-2.5 1.8-4 3.5-4s2.8 1.5 3.5 4c1 3.5 1.5 7.5 3.5 7.5s2.5-3.5 3.5-7c1.5-5 3.5-9 3.5-15 0-7-5-12-14-12Z"
        fill="#2DD4BF"
      />
      <circle cx="35.5" cy="13.5" r="4.5" fill="#131019" />
      <circle cx="35.5" cy="13.5" r="2.5" fill="#F472B6" />
    </svg>
    <span className="text-[19px] font-[700]">
      Sonrisa<span className="text-[#2DD4BF]">Post</span>
    </span>
  </div>
);

const Tarjeta = ({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-[16px] p-[24px] bg-[#1A1919] border border-[#2b2a2a]">
    <div className="text-[17px] font-[700] mb-[8px]">{titulo}</div>
    <div className="text-[14px] text-[#B5B5B5] leading-[1.6]">{children}</div>
  </div>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="w-full border-b border-[#2b2a2a]">
        <nav className="max-w-[1120px] mx-auto px-[20px] h-[72px] flex items-center justify-between gap-[16px]">
          <Marca />
          <div className="flex items-center gap-[10px]">
            <Link
              href="/auth/login"
              className="px-[16px] py-[9px] rounded-[8px] text-[14px] text-[#D1D1D1] hover:text-white transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/auth"
              className="px-[18px] py-[9px] rounded-[8px] bg-[#0F766E] hover:bg-[#115E59] text-white text-[14px] font-[600] transition-colors"
            >
              Crear cuenta gratis
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="max-w-[1120px] w-full mx-auto px-[20px] pt-[80px] pb-[60px] text-center">
        <div className="inline-block text-[12px] uppercase tracking-[2px] text-[#2DD4BF] mb-[20px]">
          Para consultorios odontológicos
        </div>
        <h1 className="text-[44px] lg:text-[60px] font-[700] leading-[1.1] max-w-[860px] mx-auto">
          Todas las redes de tu consultorio,
          <br />
          <span className="text-[#2DD4BF]">un solo calendario</span>
        </h1>
        <p className="mt-[24px] text-[17px] lg:text-[19px] text-[#B5B5B5] max-w-[640px] mx-auto leading-[1.6]">
          Programá tus publicaciones una vez y salen solas el día y la hora que
          elijas. Con contenido odontológico ya escrito, para que nunca te
          sientes frente a una pantalla en blanco.
        </p>
        <div className="mt-[36px] flex flex-wrap gap-[12px] justify-center">
          <Link
            href="/auth"
            className="px-[28px] py-[14px] rounded-[10px] bg-[#0F766E] hover:bg-[#115E59] text-white text-[16px] font-[600] transition-colors"
          >
            Empezar gratis
          </Link>
          <a
            href="#como-funciona"
            className="px-[28px] py-[14px] rounded-[10px] bg-[#1A1919] border border-[#2b2a2a] hover:border-[#0F766E] text-[16px] font-[600] transition-colors"
          >
            Ver cómo funciona
          </a>
        </div>
        <div className="mt-[20px] text-[13px] text-[#8E8E8E]">
          Sin límite de publicaciones · Sin tarjeta de crédito · Código abierto
        </div>
      </section>

      {/* El problema */}
      <section className="max-w-[1120px] w-full mx-auto px-[20px] py-[60px]">
        <div className="rounded-[20px] p-[36px] lg:p-[48px] bg-[#1A1919] border border-[#2b2a2a] text-center">
          <div className="text-[24px] lg:text-[30px] font-[700] leading-[1.3] max-w-[780px] mx-auto">
            El Instagram de tu consultorio no está abandonado por falta de
            tiempo.
            <br />
            <span className="text-[#2DD4BF]">
              Está abandonado porque no sabés qué publicar.
            </span>
          </div>
          <p className="mt-[20px] text-[15px] text-[#B5B5B5] max-w-[620px] mx-auto leading-[1.6]">
            Por eso SonrisaPost no es sólo un programador de publicaciones. Trae{' '}
            {TOTAL_PLANTILLAS} plantillas de contenido escritas para
            odontología, organizadas por especialidad, y un calendario con las
            fechas que le importan a un consultorio.
          </p>
        </div>
      </section>

      {/* Features */}
      <section
        id="como-funciona"
        className="max-w-[1120px] w-full mx-auto px-[20px] py-[40px]"
      >
        <h2 className="text-[30px] font-[700] text-center mb-[12px]">
          Qué hace por vos
        </h2>
        <p className="text-[15px] text-[#B5B5B5] text-center mb-[40px]">
          Todo lo que necesita un consultorio para sostener su presencia online.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
          <Tarjeta titulo="Contenido ya escrito">
            {TOTAL_PLANTILLAS} plantillas por especialidad — ortodoncia,
            implantología, odontopediatría, estética, periodoncia y más.
            Editables, para que suenen a vos.
          </Tarjeta>
          <Tarjeta titulo="Calendario odontológico">
            {DENTAL_EVENTS.length} efemérides y ventanas estacionales, del Día
            de la Salud Bucal a la vuelta al colegio. Cada una con su
            publicación sugerida lista para agendar.
          </Tarjeta>
          <Tarjeta titulo="28+ canales">
            Instagram, TikTok, LinkedIn, X, YouTube, Facebook, Threads,
            Mastodon, Bluesky y muchos más, desde una sola pantalla.
          </Tarjeta>
          <Tarjeta titulo="Publica solo">
            Elegís día y hora, y el post sale sin que estés presente. Si el
            servidor se reinicia, la publicación se recupera igual.
          </Tarjeta>
          <Tarjeta titulo="Trabajo en equipo">
            Sumá a tu secretaria o a quien maneje el marketing, y aprobá el
            contenido antes de que salga con el nombre del consultorio.
          </Tarjeta>
          <Tarjeta titulo="Analíticas">
            Mirá qué funciona en cada red desde un solo lugar, sin entrar a las
            estadísticas de cada plataforma por separado.
          </Tarjeta>
        </div>
      </section>

      {/* Especialidades */}
      <section className="max-w-[1120px] w-full mx-auto px-[20px] py-[60px]">
        <h2 className="text-[30px] font-[700] text-center mb-[12px]">
          Contenido para tu especialidad
        </h2>
        <p className="text-[15px] text-[#B5B5B5] text-center mb-[36px]">
          Elegís la tuya al crear la cuenta y el calendario se arma solo.
        </p>
        <div className="flex flex-wrap gap-[10px] justify-center">
          {DENTAL_SPECIALTIES.map((e) => (
            <div
              key={e.slug}
              className="flex items-center gap-[8px] px-[16px] py-[10px] rounded-[10px] bg-[#1A1919] border border-[#2b2a2a]"
            >
              <span
                className="w-[8px] h-[8px] rounded-full"
                style={{ backgroundColor: e.color }}
              />
              <span className="text-[14px] font-[600]">{e.name}</span>
              <span className="text-[12px] text-[#8E8E8E]">
                {e.templates.length}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Pasos */}
      <section className="max-w-[1120px] w-full mx-auto px-[20px] py-[40px]">
        <div className="grid md:grid-cols-3 gap-[16px]">
          {[
            [
              '1',
              'Creá tu cuenta',
              'Gratis y en dos minutos. Elegís tu especialidad y listo.',
            ],
            [
              '2',
              'Conectá tus redes',
              'Autorizás las cuentas del consultorio una sola vez.',
            ],
            [
              '3',
              'Programá y olvidate',
              'Armás el mes en una sentada. Las publicaciones salen solas.',
            ],
          ].map(([n, titulo, texto]) => (
            <div
              key={n}
              className="rounded-[16px] p-[24px] bg-[#1A1919] border border-[#2b2a2a]"
            >
              <div className="w-[36px] h-[36px] rounded-full bg-[#0F766E] flex items-center justify-center text-[16px] font-[700] mb-[14px]">
                {n}
              </div>
              <div className="text-[17px] font-[700] mb-[6px]">{titulo}</div>
              <div className="text-[14px] text-[#B5B5B5] leading-[1.6]">
                {texto}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-[1120px] w-full mx-auto px-[20px] py-[70px] text-center">
        <h2 className="text-[34px] lg:text-[42px] font-[700] leading-[1.2]">
          Empezá hoy. Es gratis.
        </h2>
        <p className="mt-[16px] text-[16px] text-[#B5B5B5] max-w-[560px] mx-auto leading-[1.6]">
          Sin plan pago, sin límite de publicaciones y sin tarjeta. El código es
          abierto: podés revisarlo o alojarlo en tu propio servidor.
        </p>
        <Link
          href="/auth"
          className="inline-block mt-[28px] px-[32px] py-[15px] rounded-[10px] bg-[#0F766E] hover:bg-[#115E59] text-white text-[16px] font-[600] transition-colors"
        >
          Crear mi cuenta gratis
        </Link>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#2b2a2a]">
        <div className="max-w-[1120px] mx-auto px-[20px] py-[36px] flex flex-col md:flex-row gap-[20px] items-center justify-between">
          <div className="flex flex-col gap-[8px] items-center md:items-start">
            <Marca />
            <div className="text-[12px] text-[#8E8E8E]">
              by{' '}
              <a
                href={PARENT_BRAND_URL}
                target="_blank"
                rel="noreferrer"
                className="text-[#D1D1D1] hover:text-white underline underline-offset-2"
              >
                DentalCore
              </a>{' '}
              — software de gestión para consultorios odontológicos
            </div>
          </div>

          <div className="text-[12px] text-[#8E8E8E] text-center md:text-end leading-[1.7]">
            <a
              href={SOURCE_CODE_URL}
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-white"
            >
              Código fuente
            </a>{' '}
            — AGPL-3.0
            <br />
            Basado en{' '}
            <a
              href="https://github.com/gitroomhq/postiz-app"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-white"
            >
              Postiz
            </a>{' '}
            de Nevo David
          </div>
        </div>
      </footer>
    </div>
  );
}
