'use client';

import { FC, useCallback, useState } from 'react';
import clsx from 'clsx';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import { DENTAL_SPECIALTIES } from '@gitroom/helpers/dental/dental.specialties';
import { useDentalSpecialty } from '@gitroom/frontend/components/dental/use.dental.specialty';

export const SpecialtyStep: FC<{ onNext: () => void }> = ({ onNext }) => {
  const fetch = useFetch();
  const t = useT();
  const { data, mutate } = useDentalSpecialty();
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<string>('');

  const current = selected || data?.specialty || '';

  const save = useCallback(async () => {
    if (!current || saving) {
      return;
    }

    setSaving(true);
    try {
      await fetch('/settings/specialty', {
        method: 'POST',
        body: JSON.stringify({ specialty: current }),
      });
      mutate();
      onNext();
    } finally {
      setSaving(false);
    }
  }, [current, saving, fetch, mutate, onNext]);

  return (
    <div className="flex flex-col gap-[24px]">
      <div className="flex gap-[4px] flex-col text-center">
        <div className="text-[24px] font-semibold">
          {t('specialty_title', '¿Cuál es la especialidad del consultorio?')}
        </div>
        <div className="text-[14px] text-customColor18">
          {t(
            'specialty_subtitle',
            'Con esto armamos tu calendario editorial y las plantillas de contenido. Podés cambiarlo cuando quieras.'
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-[12px]">
        {DENTAL_SPECIALTIES.map((specialty) => (
          <button
            key={specialty.slug}
            type="button"
            onClick={() => setSelected(specialty.slug)}
            className={clsx(
              'flex flex-col items-start gap-[6px] p-[16px] rounded-[8px] border text-start transition-colors',
              current === specialty.slug
                ? 'bg-boxFocused border-forth'
                : 'bg-newTableHeader border-tableBorder hover:border-forth'
            )}
          >
            <span
              className="w-[10px] h-[10px] rounded-full"
              style={{ backgroundColor: specialty.color }}
            />
            <span className="text-[14px] font-medium">{specialty.name}</span>
            <span className="text-[12px] text-customColor18">
              {specialty.templates.length}{' '}
              {t('specialty_templates', 'plantillas')}
            </span>
          </button>
        ))}
      </div>

      <div className="flex justify-end gap-[12px]">
        <button
          type="button"
          onClick={onNext}
          className="px-[20px] py-[10px] rounded-[8px] text-[14px] text-customColor18 hover:text-textColor"
        >
          {t('skip_for_now', 'Omitir por ahora')}
        </button>
        <button
          type="button"
          onClick={save}
          disabled={!current || saving}
          className="px-[24px] py-[10px] rounded-[8px] text-[14px] font-medium bg-forth text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? t('saving', 'Guardando...') : t('continue', 'Continuar')}
        </button>
      </div>
    </div>
  );
};
