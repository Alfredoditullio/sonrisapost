import React from 'react';

export const LogoTextComponent = () => {
  return (
    <svg
      width="220"
      height="48"
      viewBox="0 0 220 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="12" fill="#131019" />
      <path
        d="M24 9c-9 0-14 5-14 12 0 6 2 10 3.5 15 1 3.5 1.5 7 3.5 7s2.5-4 3.5-7.5c.7-2.5 1.8-4 3.5-4s2.8 1.5 3.5 4c1 3.5 1.5 7.5 3.5 7.5s2.5-3.5 3.5-7c1.5-5 3.5-9 3.5-15 0-7-5-12-14-12Z"
        fill="#2DD4BF"
      />
      <circle cx="35.5" cy="13.5" r="4.5" fill="#131019" />
      <circle cx="35.5" cy="13.5" r="2.5" fill="#F472B6" />
      <text
        x="60"
        y="24"
        fontSize="19"
        fontWeight="700"
        fill="currentColor"
        dominantBaseline="middle"
      >
        DentalCore
      </text>
      <text
        x="60"
        y="38"
        fontSize="11"
        fontWeight="500"
        letterSpacing="3.4"
        fill="#2DD4BF"
        dominantBaseline="middle"
      >
        SOCIAL
      </text>
    </svg>
  );
};
