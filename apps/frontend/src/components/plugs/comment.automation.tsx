'use client';

import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { Button } from '@gitroom/react/form/button';
import { useToaster } from '@gitroom/react/toaster/toaster';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
import {
  aplicarVariables,
  decidirRespuesta,
  ReglaComentario,
} from '@gitroom/helpers/comments/comment.matching';

/**
 * Palabras de alerta que vienen puestas de entrada.
 *
 * Que arranque con valores y no vacio es deliberado: si el odontologo tiene
 * que pensar desde cero que frenar, la mayoria no completa nada y la
 * automatizacion termina contestando consultas clinicas con una plantilla.
 * Puede sacarlas, pero la opcion segura es la que viene por defecto.
 */
const FRENOS_POR_DEFECTO = [
  'duele',
  'dolor',
  'urgencia',
  'urgente',
  'sangra',
  'sangrado',
  'infeccion',
  'infectado',
  'hinchado',
  'flemon',
  'absceso',
  'fiebre',
  'emergencia',
];

const REGLAS_SUGERIDAS: ReglaComentario[] = [
  {
    palabras: ['turno', 'cita', 'agendar', 'reservar'],
    respuesta:
      '¡Hola {nombre}! Escribinos por privado y coordinamos tu turno 😊',
  },
  {
    palabras: ['precio', 'cuanto sale', 'cuanto cuesta', 'valor', 'presupuesto'],
    respuesta:
      '¡Hola {nombre}! Te pasamos los valores por privado así te asesoramos mejor.',
  },
];

const Etiquetas: FC<{
  valores: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
  tono?: 'normal' | 'alerta';
}> = ({ valores, onChange, placeholder, tono = 'normal' }) => {
  const [texto, setTexto] = useState('');

  const agregar = () => {
    const limpio = texto.trim().toLowerCase();
    if (!limpio || valores.includes(limpio)) {
      setTexto('');
      return;
    }
    onChange([...valores, limpio]);
    setTexto('');
  };

  return (
    <div className="flex flex-wrap gap-[6px] items-center p-[8px] bg-customColor2 border border-customColor6 rounded-[4px] min-h-[42px]">
      {valores.map((v) => (
        <span
          key={v}
          className={`flex items-center gap-[6px] px-[8px] py-[3px] rounded-[4px] text-[13px] ${
            tono === 'alerta'
              ? 'bg-[#5a2d2d] text-[#ffd7d7]'
              : 'bg-forth text-white'
          }`}
        >
          {v}
          <button
            type="button"
            onClick={() => onChange(valores.filter((x) => x !== v))}
            className="opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </span>
      ))}
      <input
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onBlur={agregar}
        onKeyDown={(e) => {
          // Enter y coma agregan. La coma porque mucha gente escribe las
          // listas separadas por comas sin pensarlo.
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            agregar();
          }
          if (e.key === 'Backspace' && !texto && valores.length) {
            onChange(valores.slice(0, -1));
          }
        }}
        placeholder={valores.length ? '' : placeholder}
        className="bg-transparent outline-none flex-1 min-w-[140px] text-[14px]"
      />
    </div>
  );
};

export const CommentAutomation: FC<{ integration: any }> = ({
  integration,
}) => {
  const fetch = useFetch();
  const toaster = useToaster();
  const t = useT();

  const cargar = useCallback(
    async (url: string) => (await (await fetch(url)).json()) || null,
    []
  );

  const { data, isLoading, mutate } = useSWR(
    `/comment-automation/${integration.id}`,
    cargar,
    { revalidateOnFocus: false }
  );

  const [activo, setActivo] = useState(false);
  const [reglas, setReglas] = useState<ReglaComentario[]>([]);
  const [frenos, setFrenos] = useState<string[]>([]);
  const [tope, setTope] = useState(30);
  const [prueba, setPrueba] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    setActivo(!!data?.active);
    setReglas(
      data?.rules?.length ? (data.rules as ReglaComentario[]) : REGLAS_SUGERIDAS
    );
    setFrenos(data?.stopWords?.length ? data.stopWords : FRENOS_POR_DEFECTO);
    setTope(data?.dailyLimit || 30);
  }, [data, isLoading]);

  // La prueba usa exactamente la misma funcion que corre en el servidor, asi
  // que lo que se ve aca es lo que va a pasar de verdad.
  const resultado = useMemo(() => {
    if (!prueba.trim()) return null;
    const d = decidirRespuesta(prueba, reglas, frenos);
    return {
      ...d,
      respuesta: d.respuesta
        ? aplicarVariables(d.respuesta, { nombre: 'María' })
        : undefined,
    };
  }, [prueba, reglas, frenos]);

  const guardar = async () => {
    setGuardando(true);
    try {
      await fetch(`/comment-automation/${integration.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          active: activo,
          rules: reglas.filter(
            (r) => r.respuesta?.trim() && r.palabras?.length
          ),
          stopWords: frenos,
          dailyLimit: tope,
        }),
      });
      toaster.show(t('saved', 'Guardado'), 'success');
      mutate();
    } catch (err) {
      toaster.show(t('error_occurred', 'Ocurrió un error. Probá de nuevo.'), 'warning');
    }
    setGuardando(false);
  };

  if (isLoading) return null;

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="flex items-start gap-[14px] bg-customColor2 p-[16px] rounded-[4px]">
        <input
          type="checkbox"
          checked={activo}
          onChange={(e) => setActivo(e.target.checked)}
          className="mt-[3px] w-[18px] h-[18px] cursor-pointer"
          id="activar-respuestas"
        />
        <label htmlFor="activar-respuestas" className="cursor-pointer flex-1">
          <div className="text-[16px] font-[600]">
            {t(
              'reply_comments_automatically',
              'Responder comentarios automáticamente'
            )}
          </div>
          <div className="text-[13px] text-customColor18 mt-[2px]">
            {t(
              'reply_comments_explanation',
              'Revisamos los comentarios de tus publicaciones de los últimos 7 días cada 10 minutos. A cada comentario se le responde una sola vez.'
            )}
          </div>
        </label>
      </div>

      <div>
        <div className="text-[15px] font-[600] mb-[4px]">
          {t('when_someone_writes', 'Cuando alguien comente…')}
        </div>
        <div className="text-[13px] text-customColor18 mb-[12px]">
          {t(
            'rules_order_explanation',
            'Se aplica la primera regla que coincida, así que poné arriba las más importantes. Escribí {nombre} y lo reemplazamos por el nombre de quien comentó.'
          )}
        </div>

        <div className="flex flex-col gap-[14px]">
          {reglas.map((regla, i) => (
            <div
              key={i}
              className="bg-customColor2 p-[14px] rounded-[4px] flex flex-col gap-[10px]"
            >
              <div className="flex items-center gap-[8px]">
                <span className="text-[13px] text-customColor18">
                  {t('if_comment_says', 'Si el comentario dice')}
                </span>
                <div className="flex-1" />
                <button
                  type="button"
                  onClick={() => setReglas(reglas.filter((_, x) => x !== i))}
                  className="text-[13px] text-customColor18 hover:text-red-400"
                >
                  {t('remove', 'Quitar')}
                </button>
              </div>

              <Etiquetas
                valores={regla.palabras || []}
                placeholder={t(
                  'write_a_word_and_enter',
                  'Escribí una palabra y apretá Enter'
                )}
                onChange={(v) =>
                  setReglas(
                    reglas.map((r, x) => (x === i ? { ...r, palabras: v } : r))
                  )
                }
              />

              <div className="text-[13px] text-customColor18">
                {t('reply_with', 'Responder con')}
              </div>
              <textarea
                value={regla.respuesta}
                maxLength={1000}
                onChange={(e) =>
                  setReglas(
                    reglas.map((r, x) =>
                      x === i ? { ...r, respuesta: e.target.value } : r
                    )
                  )
                }
                rows={2}
                className="w-full bg-customColor2 border border-customColor6 rounded-[4px] p-[10px] text-[14px] outline-none resize-y"
              />
            </div>
          ))}
        </div>

        <Button
          className="mt-[12px]"
          secondary={true}
          onClick={() =>
            setReglas([...reglas, { palabras: [], respuesta: '' }])
          }
        >
          {t('add_rule', 'Agregar regla')}
        </Button>
      </div>

      <div>
        <div className="text-[15px] font-[600] mb-[4px]">
          {t('never_reply_automatically_to', 'Nunca responder automáticamente')}
        </div>
        <div className="text-[13px] text-customColor18 mb-[12px]">
          {t(
            'stop_words_explanation',
            'Si el comentario menciona alguna de estas palabras no se responde nada y queda marcado para que contestes vos. Son consultas de salud: no conviene que las conteste una plantilla.'
          )}
        </div>
        <Etiquetas
          valores={frenos}
          tono="alerta"
          placeholder={t('add_a_word', 'Agregar una palabra')}
          onChange={setFrenos}
        />
      </div>

      <div>
        <div className="text-[15px] font-[600] mb-[4px]">
          {t('daily_limit', 'Máximo de respuestas por día')}
        </div>
        <div className="text-[13px] text-customColor18 mb-[10px]">
          {t(
            'daily_limit_explanation',
            'Red de seguridad por si una publicación recibe muchísimos comentarios. Al llegar al tope se deja de responder hasta el día siguiente.'
          )}
        </div>
        <input
          type="number"
          min={1}
          max={500}
          value={tope}
          onChange={(e) => setTope(Math.max(1, Math.min(500, +e.target.value)))}
          className="w-[120px] bg-customColor2 border border-customColor6 rounded-[4px] p-[10px] text-[14px] outline-none"
        />
      </div>

      <div>
        <div className="text-[15px] font-[600] mb-[4px]">
          {t('try_it', 'Probalo')}
        </div>
        <div className="text-[13px] text-customColor18 mb-[10px]">
          {t(
            'try_it_explanation',
            'Escribí un comentario de ejemplo y mirá qué haría la automatización.'
          )}
        </div>
        <input
          value={prueba}
          onChange={(e) => setPrueba(e.target.value)}
          placeholder={t(
            'example_comment',
            'Hola, quería saber el precio del blanqueamiento'
          )}
          className="w-full bg-customColor2 border border-customColor6 rounded-[4px] p-[10px] text-[14px] outline-none"
        />

        {!!resultado && (
          <div className="mt-[10px] p-[12px] rounded-[4px] bg-customColor2 text-[14px]">
            {resultado.accion === 'responder' && (
              <>
                <div className="text-[#32d583] font-[600] mb-[6px]">
                  {t('would_reply', 'Respondería')}
                </div>
                <div className="whitespace-pre-wrap">{resultado.respuesta}</div>
              </>
            )}
            {resultado.accion === 'frenar' && (
              <>
                <div className="text-[#f97066] font-[600] mb-[6px]">
                  {t('would_not_reply', 'No respondería')}
                </div>
                <div>
                  {t('contains_stop_word', 'Contiene la palabra')}{' '}
                  <b>{resultado.palabraFreno}</b>.{' '}
                  {t(
                    'flagged_for_you',
                    'Queda marcado para que contestes vos.'
                  )}
                </div>
              </>
            )}
            {resultado.accion === 'ignorar' && (
              <div className="text-customColor18">
                {t(
                  'no_rule_matches',
                  'Ninguna regla coincide: no se responde nada.'
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <Button onClick={guardar} disabled={guardando}>
          {guardando ? t('saving', 'Guardando...') : t('save', 'Guardar')}
        </Button>
      </div>
    </div>
  );
};
