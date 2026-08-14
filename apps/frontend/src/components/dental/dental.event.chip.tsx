'use client';

import { FC, useCallback } from 'react';
import { Tooltip } from 'react-tooltip';
import { DentalEvent } from '@gitroom/helpers/dental/dental.calendar';
import { useT } from '@gitroom/react/translation/get.transation.service.client';

/**
 * Efeméride odontológica en una celda del calendario.
 *
 * La fecha sola no le sirve a un consultorio: lo valioso es que el post ya
 * esté escrito. Al hacer clic se abre el editor con el texto sugerido cargado
 * en la fecha correspondiente.
 */
export const DentalEventChip: FC<{
  event: DentalEvent;
  onUse: (content: string) => void;
}> = ({ event, onUse }) => {
  const t = useT();
  const tooltipId = `dental-event-${event.slug}`;

  const use = useCallback(
    (e: React.MouseEvent) => {
      // La celda entera abre el editor vacío: si no frenamos acá, se abren dos.
      e.stopPropagation();
      onUse(event.post);
    },
    [event, onUse]
  );

  return (
    <>
      <button
        type="button"
        onClick={use}
        data-tooltip-id={tooltipId}
        className="w-full flex items-center gap-[4px] px-[6px] py-[3px] rounded-[4px] bg-forth/15 border border-forth/40 hover:bg-forth/30 transition-colors text-start"
      >
        <span className="text-[10px] shrink-0">🦷</span>
        <span className="text-[10px] truncate text-textColor">
          {event.name}
        </span>
      </button>
      <Tooltip id={tooltipId} place="top" className="max-w-[280px] z-[300]">
        <div className="text-[12px] font-medium mb-[4px]">{event.name}</div>
        <div className="text-[11px] opacity-80">{event.why}</div>
        <div className="text-[11px] mt-[6px] font-medium">
          {t('dental_event_click', 'Hacé clic para usar el post sugerido')}
        </div>
      </Tooltip>
    </>
  );
};
