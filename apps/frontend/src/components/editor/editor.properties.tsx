'use client';

import { FC } from 'react';
import { useEditor } from './editor.store';
import { COLORES, TIPOGRAFIAS } from './editor.types';

const Fila: FC<{ titulo: string; children: any }> = ({ titulo, children }) => (
  <div className="flex flex-col gap-[6px]">
    <div className="text-[12px] text-customColor18 uppercase tracking-wide">
      {titulo}
    </div>
    {children}
  </div>
);

const Colores: FC<{ valor: string; onChange: (c: string) => void }> = ({
  valor,
  onChange,
}) => (
  <div className="flex flex-wrap gap-[6px] items-center">
    {COLORES.map((c) => (
      <button
        key={c}
        type="button"
        onClick={() => onChange(c)}
        style={{ background: c }}
        className={`w-[24px] h-[24px] rounded-[4px] border ${
          valor?.toUpperCase() === c
            ? 'border-[#2DD4BF] border-2'
            : 'border-white/20'
        }`}
      />
    ))}
    {/* El selector nativo cubre cualquier color que no este en la paleta,
        sin ocupar lugar cuando no se usa. */}
    <input
      type="color"
      value={valor || '#000000'}
      onChange={(e) => onChange(e.target.value)}
      className="w-[24px] h-[24px] rounded-[4px] bg-transparent border border-white/20 cursor-pointer p-0"
    />
  </div>
);

const Numero: FC<{
  valor: number;
  min: number;
  max: number;
  paso?: number;
  onChange: (n: number) => void;
}> = ({ valor, min, max, paso = 1, onChange }) => (
  <div className="flex items-center gap-[10px]">
    <input
      type="range"
      min={min}
      max={max}
      step={paso}
      value={valor}
      onChange={(e) => onChange(+e.target.value)}
      className="flex-1"
    />
    <span className="text-[12px] w-[42px] text-end tabular-nums">
      {Math.round(valor * 100) / 100}
    </span>
  </div>
);

export const EditorProperties = () => {
  const seleccion = useEditor((s) => s.seleccion);
  const documento = useEditor((s) => s.documento);
  const actualizar = useEditor((s) => s.actualizar);
  const marcarPunto = useEditor((s) => s.marcarPunto);
  const borrar = useEditor((s) => s.borrar);
  const duplicar = useEditor((s) => s.duplicar);
  const moverCapa = useEditor((s) => s.moverCapa);
  const aplicar = useEditor((s) => s.aplicar);

  const el = documento.elementos.find((e) => e.id === seleccion);

  // Sin seleccion se muestran las propiedades del lienzo, en vez de un panel
  // vacio: el fondo es lo unico editable en ese momento.
  if (!el) {
    return (
      <div className="w-[260px] shrink-0 p-[16px] flex flex-col gap-[16px] border-s border-customColor6 overflow-auto">
        <div className="text-[14px] font-[600]">Lienzo</div>
        <Fila titulo="Color de fondo">
          <Colores
            valor={documento.fondo}
            onChange={(fondo) => aplicar((d) => ({ ...d, fondo }))}
          />
        </Fila>
        <div className="text-[12px] text-customColor18 leading-[1.6]">
          Hacé clic en un elemento del diseño para editarlo.
        </div>
      </div>
    );
  }

  // Cambio con historial: se marca el punto antes de tocar, asi cada ajuste
  // desde el panel es un paso de deshacer.
  const set = (cambios: any) => {
    marcarPunto();
    actualizar(el.id, cambios);
  };

  return (
    <div className="w-[260px] shrink-0 p-[16px] flex flex-col gap-[16px] border-s border-customColor6 overflow-auto">
      <div className="flex items-center gap-[8px]">
        <div className="text-[14px] font-[600] flex-1">
          {el.tipo === 'texto'
            ? 'Texto'
            : el.tipo === 'imagen'
            ? 'Imagen'
            : 'Forma'}
        </div>
        <button
          onClick={() => duplicar(el.id)}
          title="Duplicar"
          className="text-[12px] px-[8px] py-[4px] rounded-[4px] bg-customColor2 hover:bg-boxHover"
        >
          Duplicar
        </button>
        <button
          onClick={() => borrar(el.id)}
          title="Borrar"
          className="text-[12px] px-[8px] py-[4px] rounded-[4px] bg-customColor2 hover:bg-red-500/30"
        >
          Borrar
        </button>
      </div>

      {el.tipo === 'texto' && (
        <>
          <Fila titulo="Contenido">
            <textarea
              value={el.texto}
              onChange={(e) => actualizar(el.id, { texto: e.target.value })}
              onFocus={marcarPunto}
              rows={3}
              className="w-full bg-customColor2 border border-customColor6 rounded-[4px] p-[8px] text-[13px] outline-none resize-y"
            />
          </Fila>

          <Fila titulo="Tipografía">
            <select
              value={el.fontFamily}
              onChange={(e) => set({ fontFamily: e.target.value })}
              className="w-full bg-customColor2 border border-customColor6 rounded-[4px] p-[8px] text-[13px] outline-none"
            >
              {TIPOGRAFIAS.map((f) => (
                <option key={f.nombre} value={f.valor}>
                  {f.nombre}
                </option>
              ))}
            </select>
          </Fila>

          <Fila titulo="Tamaño">
            <Numero
              valor={el.fontSize}
              min={12}
              max={220}
              onChange={(fontSize) => actualizar(el.id, { fontSize })}
            />
          </Fila>

          <Fila titulo="Estilo">
            <div className="flex gap-[6px]">
              {[
                { v: 'normal', t: 'Normal' },
                { v: 'bold', t: 'Negrita' },
                { v: 'italic', t: 'Itálica' },
              ].map((o) => (
                <button
                  key={o.v}
                  onClick={() => set({ fontStyle: o.v })}
                  className={`flex-1 text-[12px] py-[6px] rounded-[4px] ${
                    el.fontStyle === o.v ? 'bg-[#0F766E]' : 'bg-customColor2'
                  }`}
                >
                  {o.t}
                </button>
              ))}
            </div>
          </Fila>

          <Fila titulo="Alineación">
            <div className="flex gap-[6px]">
              {[
                { v: 'left', t: 'Izq.' },
                { v: 'center', t: 'Centro' },
                { v: 'right', t: 'Der.' },
              ].map((o) => (
                <button
                  key={o.v}
                  onClick={() => set({ align: o.v })}
                  className={`flex-1 text-[12px] py-[6px] rounded-[4px] ${
                    el.align === o.v ? 'bg-[#0F766E]' : 'bg-customColor2'
                  }`}
                >
                  {o.t}
                </button>
              ))}
            </div>
          </Fila>

          <Fila titulo="Color">
            <Colores valor={el.fill} onChange={(fill) => set({ fill })} />
          </Fila>

          <Fila titulo="Contorno (para leer sobre fotos)">
            <Numero
              valor={el.strokeWidth || 0}
              min={0}
              max={12}
              onChange={(strokeWidth) =>
                actualizar(el.id, {
                  strokeWidth,
                  stroke: el.stroke || '#000000',
                })
              }
            />
            {!!el.strokeWidth && (
              <Colores
                valor={el.stroke || '#000000'}
                onChange={(stroke) => set({ stroke })}
              />
            )}
          </Fila>
        </>
      )}

      {el.tipo === 'forma' && (
        <>
          <Fila titulo="Relleno">
            <Colores valor={el.fill} onChange={(fill) => set({ fill })} />
          </Fila>
          <Fila titulo="Borde">
            <Numero
              valor={el.strokeWidth}
              min={0}
              max={40}
              onChange={(strokeWidth) =>
                actualizar(el.id, { strokeWidth, stroke: el.stroke || '#FFFFFF' })
              }
            />
            {!!el.strokeWidth && (
              <Colores
                valor={el.stroke}
                onChange={(stroke) => set({ stroke })}
              />
            )}
          </Fila>
          {el.forma === 'rectangulo' && (
            <Fila titulo="Esquinas redondeadas">
              <Numero
                valor={el.cornerRadius}
                min={0}
                max={200}
                onChange={(cornerRadius) => actualizar(el.id, { cornerRadius })}
              />
            </Fila>
          )}
        </>
      )}

      {el.tipo === 'imagen' && (
        <Fila titulo="Esquinas redondeadas">
          <Numero
            valor={el.cornerRadius}
            min={0}
            max={400}
            onChange={(cornerRadius) => actualizar(el.id, { cornerRadius })}
          />
        </Fila>
      )}

      <Fila titulo="Opacidad">
        <Numero
          valor={el.opacity}
          min={0.05}
          max={1}
          paso={0.05}
          onChange={(opacity) => actualizar(el.id, { opacity })}
        />
      </Fila>

      <Fila titulo="Orden">
        <div className="grid grid-cols-2 gap-[6px]">
          {[
            { d: 'frente', t: 'Al frente' },
            { d: 'fondo', t: 'Al fondo' },
            { d: 'adelante', t: 'Adelante' },
            { d: 'atras', t: 'Atrás' },
          ].map((o) => (
            <button
              key={o.d}
              onClick={() => moverCapa(el.id, o.d as any)}
              className="text-[12px] py-[6px] rounded-[4px] bg-customColor2 hover:bg-boxHover"
            >
              {o.t}
            </button>
          ))}
        </div>
      </Fila>
    </div>
  );
};
