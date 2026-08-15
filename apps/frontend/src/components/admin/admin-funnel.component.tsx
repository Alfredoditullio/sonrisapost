'use client';

import React, { FC, useCallback, useState } from 'react';
import useSWR from 'swr';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useUser } from '@gitroom/frontend/components/layout/user.context';
import { LoadingComponent } from '@gitroom/frontend/components/layout/loading';
import { DENTAL_SPECIALTIES } from '@gitroom/helpers/dental/dental.specialties';

interface FunnelResponse {
  from: string;
  to: string;
  consultorios: {
    total: number;
    nuevos: number;
    conEspecialidad: number;
    conCanal: number;
    quePublicaron: number;
    activos30d: number;
  };
  porEspecialidad: { specialty: string; count: number }[];
  promo: {
    clicks: number;
    consultoriosUnicos: number;
    porPlacement: { placement: string; count: number }[];
  };
  posts: { publicadosEnPeriodo: number; programadosPendientes: number };
}

const hoy = () => new Date().toISOString().slice(0, 10);
const diasAtras = (d: number) => {
  const f = new Date();
  f.setDate(f.getDate() - d);
  return f.toISOString().slice(0, 10);
};

const useFunnel = (from: string, to: string) => {
  const fetch = useFetch();
  const load = useCallback(async () => {
    return (await fetch(`/admin/funnel?from=${from}&to=${to}`)).json();
  }, [from, to]);

  return useSWR<FunnelResponse>(`admin-funnel-${from}-${to}`, load, {
    revalidateOnFocus: false,
  });
};

const nombreEspecialidad = (slug: string) =>
  DENTAL_SPECIALTIES.find((e) => e.slug === slug)?.name || slug;

/** Un escalón del embudo, con su caída respecto del anterior. */
const Escalon: FC<{
  etiqueta: string;
  valor: number;
  base: number;
  ayuda: string;
}> = ({ etiqueta, valor, base, ayuda }) => {
  const pct = base > 0 ? Math.round((valor / base) * 100) : 0;

  return (
    <div className="flex flex-col gap-[6px] p-[16px] rounded-[8px] bg-newTableHeader border border-tableBorder">
      <div className="flex items-baseline justify-between gap-[8px]">
        <span className="text-[13px] font-[600]">{etiqueta}</span>
        <span className="text-[12px] text-customColor18">{pct}%</span>
      </div>
      <div className="text-[26px] font-[700] leading-none">{valor}</div>
      <div className="h-[4px] rounded-full bg-tableBorder overflow-hidden">
        <div className="h-full bg-forth" style={{ width: `${pct}%` }} />
      </div>
      <div className="text-[11px] text-customColor18 leading-[1.4]">{ayuda}</div>
    </div>
  );
};

const Metrica: FC<{ etiqueta: string; valor: number | string; ayuda?: string }> =
  ({ etiqueta, valor, ayuda }) => (
    <div className="flex flex-col gap-[4px] p-[16px] rounded-[8px] bg-newTableHeader border border-tableBorder">
      <div className="text-[13px] font-[600]">{etiqueta}</div>
      <div className="text-[26px] font-[700] leading-none">{valor}</div>
      {!!ayuda && (
        <div className="text-[11px] text-customColor18 leading-[1.4]">
          {ayuda}
        </div>
      )}
    </div>
  );

export const AdminFunnelComponent = () => {
  const user = useUser();
  const [from, setFrom] = useState(diasAtras(30));
  const [to, setTo] = useState(hoy());
  const { data, isLoading } = useFunnel(from, to);

  if (!user?.isSuperAdmin) {
    return (
      <div className="text-[14px] text-customColor18">
        Sección disponible sólo para super administradores.
      </div>
    );
  }

  if (isLoading || !data) {
    return <LoadingComponent />;
  }

  const c = data.consultorios;

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="flex items-end gap-[12px] flex-wrap">
        <div className="flex flex-col gap-[4px]">
          <label className="text-[12px] text-customColor18">Desde</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="bg-newTableHeader border border-tableBorder rounded-[6px] px-[10px] py-[6px] text-[13px]"
          />
        </div>
        <div className="flex flex-col gap-[4px]">
          <label className="text-[12px] text-customColor18">Hasta</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="bg-newTableHeader border border-tableBorder rounded-[6px] px-[10px] py-[6px] text-[13px]"
          />
        </div>
        {[7, 30, 90].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => {
              setFrom(diasAtras(d));
              setTo(hoy());
            }}
            className="px-[12px] py-[7px] rounded-[6px] bg-newTableHeader border border-tableBorder text-[12px] hover:border-forth"
          >
            {d} días
          </button>
        ))}
      </div>

      <div>
        <div className="text-[16px] font-[700] mb-[4px]">
          Embudo de activación
        </div>
        <div className="text-[12px] text-customColor18 mb-[12px]">
          Cada escalón pierde gente. El porcentaje es sobre el total de
          consultorios registrados — donde más cae, ahí está el problema.
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-[12px]">
          <Escalon
            etiqueta="Registrados"
            valor={c.total}
            base={c.total}
            ayuda="Consultorios con cuenta creada"
          />
          <Escalon
            etiqueta="Con especialidad"
            valor={c.conEspecialidad}
            base={c.total}
            ayuda="Completaron el onboarding"
          />
          <Escalon
            etiqueta="Con canal"
            valor={c.conCanal}
            base={c.total}
            ayuda="Conectaron al menos una red. Suele ser la caída más grande."
          />
          <Escalon
            etiqueta="Publicaron"
            valor={c.quePublicaron}
            base={c.total}
            ayuda="Sacaron al menos un post alguna vez"
          />
          <Escalon
            etiqueta="Activos"
            valor={c.activos30d}
            base={c.total}
            ayuda="Publicaron en los últimos 30 días. Es la métrica que importa."
          />
        </div>
      </div>

      <div>
        <div className="text-[16px] font-[700] mb-[4px]">
          Derivación a DentalCore
        </div>
        <div className="text-[12px] text-customColor18 mb-[12px]">
          Razón de ser del producto gratuito.
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[12px]">
          <Metrica
            etiqueta="Clics en el banner"
            valor={data.promo.clicks}
            ayuda="En el período elegido"
          />
          <Metrica
            etiqueta="Consultorios que clickearon"
            valor={data.promo.consultoriosUnicos}
            ayuda="Únicos, sin contar repeticiones"
          />
          <Metrica
            etiqueta="Nuevos en el período"
            valor={c.nuevos}
            ayuda="Consultorios registrados"
          />
          <Metrica
            etiqueta="Posts publicados"
            valor={data.posts.publicadosEnPeriodo}
            ayuda={`${data.posts.programadosPendientes} programados pendientes`}
          />
        </div>
      </div>

      {!!data.porEspecialidad.length && (
        <div>
          <div className="text-[16px] font-[700] mb-[12px]">
            Por especialidad
          </div>
          <div className="flex flex-col gap-[6px]">
            {data.porEspecialidad.map((e) => {
              const pct = c.conEspecialidad
                ? Math.round((e.count / c.conEspecialidad) * 100)
                : 0;
              return (
                <div
                  key={e.specialty}
                  className="flex items-center gap-[12px] p-[10px] rounded-[6px] bg-newTableHeader border border-tableBorder"
                >
                  <div className="w-[180px] text-[13px] shrink-0">
                    {nombreEspecialidad(e.specialty)}
                  </div>
                  <div className="flex-1 h-[6px] rounded-full bg-tableBorder overflow-hidden">
                    <div
                      className="h-full bg-forth"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="w-[60px] text-end text-[13px] font-[600]">
                    {e.count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
