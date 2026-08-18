'use client';

/**
 * Isotipo de SonrisaPost para la barra lateral: el arco de sonrisa con el punto.
 *
 * Va sin contenedor, como lo definio el diseno. El viewBox de 256 se mantiene
 * para que coincida con los SVG de la carpeta public/marca.
 */
export const Logo = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="52"
      height="52"
      viewBox="0 0 256 256"
      fill="none"
      className="mt-[8px] min-w-[52px] min-h-[52px]"
    >
      <path
        d="M59.4 111.7A74 74 0 0 0 196.6 111.7"
        fill="none"
        stroke="#2DD4BF"
        strokeWidth="34"
        strokeLinecap="round"
      />
      <circle cx="200" cy="56" r="23" fill="#F472B6" />
    </svg>
  );
};
