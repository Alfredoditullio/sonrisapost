'use client';

import { FC, useCallback, useState } from 'react';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { PARENT_BRAND_URL } from '@gitroom/frontend/components/ui/by-dentalcore.component';

/**
 * Banner de DentalCore dentro de la app.
 *
 * Esta es la razon de ser del producto gratuito: derivar consultorios al
 * producto principal. El clic se registra para poder medir si el embudo
 * funciona de verdad, en vez de suponerlo.
 *
 * El registro es best-effort: si la peticion falla, igual abrimos el link.
 * Perder una metrica es aceptable; perder la visita, no.
 */
export const DentalCorePromo: FC<{ placement?: string }> = ({
  placement = 'sidebar',
}) => {
  const fetch = useFetch();
  const t = useT();
  const [oculto, setOculto] = useState(false);

  const registrarClic = useCallback(() => {
    fetch('/promo/click', {
      method: 'POST',
      body: JSON.stringify({ placement }),
    }).catch(() => {
      /* metrica best-effort: nunca bloquear la navegacion */
    });
  }, [fetch, placement]);

  if (oculto) {
    return null;
  }

  return (
    <div className="relative rounded-[12px] p-[16px] bg-newTableHeader border border-tableBorder">
      <button
        type="button"
        onClick={() => setOculto(true)}
        aria-label={t('dismiss', 'Ocultar')}
        className="absolute end-[8px] top-[8px] text-[16px] leading-none text-customColor18 hover:text-textColor"
      >
        ×
      </button>

      <div className="text-[11px] uppercase tracking-[1.5px] text-[#2DD4BF] mb-[6px]">
        {t('recommended_platform', 'Plataforma recomendada')}
      </div>
      <div className="text-[14px] font-[700] mb-[4px]">DentalCore</div>
      <div className="text-[12px] text-customColor18 mb-[12px] leading-[1.5]">
        {t(
          'dentalcore_promo_body',
          'Historia clínica, odontograma, turnos y facturación electrónica. El sistema de gestión para tu consultorio.'
        )}
      </div>
      <a
        href={`${PARENT_BRAND_URL}?utm_source=dentalcore-social&utm_medium=${placement}&utm_campaign=promo`}
        target="_blank"
        rel="noreferrer"
        onClick={registrarClic}
        className="inline-block px-[14px] py-[7px] rounded-[6px] bg-forth text-white text-[12px] font-[600] hover:opacity-90 transition-opacity"
      >
        {t('discover_dentalcore', 'Conocer DentalCore')}
      </a>
    </div>
  );
};
