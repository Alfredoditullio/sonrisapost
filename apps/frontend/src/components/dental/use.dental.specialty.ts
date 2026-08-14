'use client';

import { useCallback } from 'react';
import useSWR from 'swr';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';

/**
 * Especialidad del consultorio. Se usa para filtrar el calendario editorial y
 * las plantillas de contenido.
 *
 * Hook propio y aislado para cumplir react-hooks/rules-of-hooks, como pide
 * el CLAUDE.md del proyecto.
 */
export const useDentalSpecialty = () => {
  const fetch = useFetch();

  const load = useCallback(async () => {
    return (await fetch('/settings/specialty')).json();
  }, []);

  return useSWR<{ specialty: string | null }>('settings-specialty', load, {
    revalidateOnFocus: false,
  });
};
