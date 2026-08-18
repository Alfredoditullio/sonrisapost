import React from 'react';

/**
 * Logotipo horizontal de SonrisaPost: isotipo (arco de sonrisa con punto) mas
 * la marca denominativa.
 *
 * El texto usa `currentColor` para adaptarse al contexto donde se monte; el
 * arco y el punto conservan los colores de marca.
 */
export const LogoTextComponent = () => {
  return (
    <svg
      width="219"
      height="50"
      viewBox="0 0 1120 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M59.4 111.7A74 74 0 0 0 196.6 111.7"
        fill="none"
        stroke="#2DD4BF"
        strokeWidth="34"
        strokeLinecap="round"
      />
      <circle cx="200" cy="56" r="23" fill="#F472B6" />
      <text
        x="356"
        y="150"
        fontSize="112"
        fontWeight="600"
        letterSpacing="-3.9"
        fill="currentColor"
      >
        Sonrisa<tspan fill="#2DD4BF">Post</tspan>
      </text>
    </svg>
  );
};
