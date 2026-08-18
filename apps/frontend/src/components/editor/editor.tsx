'use client';

import { FC, useCallback, useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useToaster } from '@gitroom/react/toaster/toaster';
import { Button } from '@gitroom/react/form/button';
import { useEditor } from './editor.store';
import { EditorCanvas } from './editor.canvas';
import { EditorProperties } from './editor.properties';
import { PLANTILLAS } from './editor.templates';
import { FORMATOS, nuevoId } from './editor.types';

/** Biblioteca de medios de la organizacion, primera pagina. */
const useMediaLibrary = () => {
  const fetch = useFetch();
  return useSWR(
    '/media?page=1',
    async (url: string) => (await (await fetch(url)).json()) || null,
    { revalidateOnFocus: false }
  );
};

type Solapa = 'plantillas' | 'texto' | 'formas' | 'imagenes';

const SOLAPAS: { id: Solapa; nombre: string }[] = [
  { id: 'plantillas', nombre: 'Plantillas' },
  { id: 'texto', nombre: 'Texto' },
  { id: 'imagenes', nombre: 'Imágenes' },
  { id: 'formas', nombre: 'Formas' },
];

/** Miniatura de una plantilla, dibujada con divs: no hace falta generar PNG. */
const Miniatura: FC<{ doc: any }> = ({ doc }) => {
  const escala = 120 / Math.max(doc.ancho, doc.alto);
  return (
    <div
      className="relative overflow-hidden rounded-[6px] shrink-0"
      style={{
        width: doc.ancho * escala,
        height: doc.alto * escala,
        background: doc.fondo,
      }}
    >
      {doc.elementos.map((e: any) => (
        <div
          key={e.id}
          className="absolute"
          style={{
            left: e.x * escala,
            top: e.y * escala,
            width: (e.width || 40) * escala,
            height:
              e.tipo === 'texto'
                ? (e.fontSize || 20) * escala * 1.3
                : (e.height || 40) * escala,
            background: e.tipo === 'texto' ? 'transparent' : e.fill,
            borderRadius: e.forma === 'circulo' ? '50%' : 3,
            opacity: e.opacity,
            color: e.fill,
            fontSize: Math.max(3, (e.fontSize || 20) * escala),
            lineHeight: 1.1,
            overflow: 'hidden',
            fontWeight: e.fontStyle === 'bold' ? 700 : 400,
          }}
        >
          {e.tipo === 'texto' ? e.texto : null}
        </div>
      ))}
    </div>
  );
};

export const Editor: FC<{
  /** Se llama con el archivo guardado cuando el usuario aprieta Usar diseño. */
  onGuardar: (media: { id: string; path: string }) => void;
  cerrar: () => void;
}> = ({ onGuardar, cerrar }) => {
  const fetch = useFetch();
  const toaster = useToaster();

  const documento = useEditor((s) => s.documento);
  const setDocumento = useEditor((s) => s.setDocumento);
  const agregar = useEditor((s) => s.agregar);
  const aplicar = useEditor((s) => s.aplicar);
  const deshacer = useEditor((s) => s.deshacer);
  const rehacer = useEditor((s) => s.rehacer);
  const seleccion = useEditor((s) => s.seleccion);
  const borrar = useEditor((s) => s.borrar);
  const duplicar = useEditor((s) => s.duplicar);

  const [solapa, setSolapa] = useState<Solapa>('plantillas');
  const [guardando, setGuardando] = useState(false);
  const [tamaño, setTamaño] = useState({ ancho: 900, alto: 600 });
  const zona = useRef<HTMLDivElement>(null);
  const archivoRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef<any>(null);

  // El lienzo se escala para entrar en el espacio disponible, que cambia con
  // el tamaño de la ventana y con el panel lateral.
  useEffect(() => {
    const medir = () => {
      if (!zona.current) return;
      setTamaño({
        ancho: zona.current.clientWidth,
        alto: zona.current.clientHeight,
      });
    };
    medir();
    window.addEventListener('resize', medir);
    return () => window.removeEventListener('resize', medir);
  }, []);

  useEffect(() => {
    const teclas = (e: KeyboardEvent) => {
      const escribiendo =
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(
          (e.target as HTMLElement)?.tagName
        ) || (e.target as HTMLElement)?.isContentEditable;

      if (escribiendo) return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        e.shiftKey ? rehacer() : deshacer();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd' && seleccion) {
        e.preventDefault();
        duplicar(seleccion);
        return;
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && seleccion) {
        e.preventDefault();
        borrar(seleccion);
      }
    };
    window.addEventListener('keydown', teclas);
    return () => window.removeEventListener('keydown', teclas);
  }, [seleccion, deshacer, rehacer, borrar, duplicar]);

  const { data: biblioteca } = useMediaLibrary();

  const agregarTexto = (preset: 'titulo' | 'subtitulo' | 'cuerpo') => {
    const tamaños = { titulo: 96, subtitulo: 56, cuerpo: 36 };
    agregar({
      id: nuevoId(),
      tipo: 'texto',
      x: documento.ancho * 0.1,
      y: documento.alto * 0.4,
      width: documento.ancho * 0.8,
      rotation: 0,
      opacity: 1,
      texto:
        preset === 'titulo'
          ? 'Tu título acá'
          : preset === 'subtitulo'
          ? 'Un subtítulo'
          : 'Escribí el texto de tu publicación acá.',
      fontSize: tamaños[preset],
      fontFamily: 'Inter, Helvetica, Arial, sans-serif',
      fontStyle: preset === 'cuerpo' ? 'normal' : 'bold',
      fill: '#111111',
      align: 'left',
      lineHeight: 1.25,
    } as any);
  };

  const agregarForma = (forma: 'rectangulo' | 'circulo' | 'linea') => {
    agregar({
      id: nuevoId(),
      tipo: 'forma',
      forma,
      x: documento.ancho * 0.25,
      y: documento.alto * 0.35,
      width: documento.ancho * 0.5,
      height: forma === 'linea' ? 0 : documento.alto * 0.3,
      rotation: 0,
      opacity: 1,
      fill: '#0F766E',
      stroke: '',
      strokeWidth: forma === 'linea' ? 8 : 0,
      cornerRadius: 0,
    } as any);
  };

  const agregarImagen = (src: string) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      // Entra escalada al 80% del lienzo conservando la proporcion: pegarla a
      // tamaño original dejaria fotos de 4000px fuera de la vista.
      const escala = Math.min(
        (documento.ancho * 0.8) / img.width,
        (documento.alto * 0.8) / img.height
      );
      const ancho = img.width * escala;
      const alto = img.height * escala;

      agregar({
        id: nuevoId(),
        tipo: 'imagen',
        src,
        x: (documento.ancho - ancho) / 2,
        y: (documento.alto - alto) / 2,
        width: ancho,
        height: alto,
        rotation: 0,
        opacity: 1,
        cornerRadius: 0,
      } as any);
    };
    img.onerror = () =>
      toaster.show('No se pudo cargar la imagen', 'warning');
  };

  const subir = async (e: any) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    const form = new FormData();
    form.append('file', archivo);

    try {
      const res = await fetch('/media/upload-server', {
        method: 'POST',
        body: form,
      });
      const guardado = await res.json();
      agregarImagen(guardado.path);
    } catch (err) {
      toaster.show('No se pudo subir la imagen', 'warning');
    }
    e.target.value = '';
  };

  const exportar = useCallback(async () => {
    const stage = stageRef.current;
    if (!stage) return;

    setGuardando(true);
    try {
      // pixelRatio compensa la escala de pantalla: el lienzo se ve chico pero
      // se exporta en la resolucion real del formato elegido.
      const escalaActual = stage.scaleX();
      const dataUrl = stage.toDataURL({
        pixelRatio: 1 / escalaActual,
        mimeType: 'image/png',
      });

      const res = await fetch('/media/upload-simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: dataUrl }),
      });

      const guardado = await res.json();
      onGuardar(guardado);
    } catch (err) {
      toaster.show('No se pudo guardar el diseño', 'warning');
    }
    setGuardando(false);
  }, [onGuardar]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-[10px] p-[12px] border-b border-customColor6">
        <select
          value={`${documento.ancho}x${documento.alto}`}
          onChange={(e) => {
            const [ancho, alto] = e.target.value.split('x').map(Number);
            aplicar((d) => ({ ...d, ancho, alto }));
          }}
          className="bg-customColor2 border border-customColor6 rounded-[4px] p-[8px] text-[13px] outline-none"
        >
          {FORMATOS.map((f) => (
            <option key={f.id} value={`${f.ancho}x${f.alto}`}>
              {f.nombre} · {f.ancho}×{f.alto}
            </option>
          ))}
        </select>

        <button
          onClick={deshacer}
          className="px-[10px] py-[7px] rounded-[4px] bg-customColor2 hover:bg-boxHover text-[13px]"
          title="Deshacer (Ctrl+Z)"
        >
          ↶ Deshacer
        </button>
        <button
          onClick={rehacer}
          className="px-[10px] py-[7px] rounded-[4px] bg-customColor2 hover:bg-boxHover text-[13px]"
          title="Rehacer (Ctrl+Shift+Z)"
        >
          ↷ Rehacer
        </button>

        <div className="flex-1" />

        <button
          onClick={cerrar}
          className="px-[14px] py-[8px] rounded-[6px] bg-customColor2 hover:bg-boxHover text-[13px]"
        >
          Cancelar
        </button>
        <Button onClick={exportar} disabled={guardando}>
          {guardando ? 'Guardando…' : 'Usar diseño'}
        </Button>
      </div>

      <div className="flex flex-1 min-h-0">
        <div className="w-[280px] shrink-0 flex flex-col border-e border-customColor6">
          <div className="flex border-b border-customColor6">
            {SOLAPAS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSolapa(s.id)}
                className={`flex-1 text-[12px] py-[10px] ${
                  solapa === s.id
                    ? 'bg-customColor2 border-b-2 border-[#2DD4BF]'
                    : 'hover:bg-boxHover'
                }`}
              >
                {s.nombre}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-auto p-[12px] flex flex-col gap-[10px]">
            {solapa === 'plantillas' &&
              PLANTILLAS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setDocumento(JSON.parse(JSON.stringify(p.documento)))}
                  className="flex items-center gap-[10px] p-[8px] rounded-[6px] hover:bg-boxHover text-start"
                >
                  <Miniatura doc={p.documento} />
                  <span className="text-[13px]">
                    {p.nombre}
                    <span className="block text-[11px] text-customColor18">
                      {p.categoria}
                    </span>
                  </span>
                </button>
              ))}

            {solapa === 'texto' && (
              <>
                <button
                  onClick={() => agregarTexto('titulo')}
                  className="p-[12px] rounded-[6px] bg-customColor2 hover:bg-boxHover text-[26px] font-[700] text-start"
                >
                  Título
                </button>
                <button
                  onClick={() => agregarTexto('subtitulo')}
                  className="p-[12px] rounded-[6px] bg-customColor2 hover:bg-boxHover text-[18px] font-[600] text-start"
                >
                  Subtítulo
                </button>
                <button
                  onClick={() => agregarTexto('cuerpo')}
                  className="p-[12px] rounded-[6px] bg-customColor2 hover:bg-boxHover text-[14px] text-start"
                >
                  Texto de párrafo
                </button>
              </>
            )}

            {solapa === 'formas' && (
              <div className="grid grid-cols-3 gap-[8px]">
                <button
                  onClick={() => agregarForma('rectangulo')}
                  className="aspect-square rounded-[6px] bg-customColor2 hover:bg-boxHover flex items-center justify-center"
                >
                  <div className="w-[36px] h-[36px] bg-[#0F766E] rounded-[4px]" />
                </button>
                <button
                  onClick={() => agregarForma('circulo')}
                  className="aspect-square rounded-[6px] bg-customColor2 hover:bg-boxHover flex items-center justify-center"
                >
                  <div className="w-[36px] h-[36px] bg-[#0F766E] rounded-full" />
                </button>
                <button
                  onClick={() => agregarForma('linea')}
                  className="aspect-square rounded-[6px] bg-customColor2 hover:bg-boxHover flex items-center justify-center"
                >
                  <div className="w-[36px] h-[6px] bg-[#0F766E] rounded-full" />
                </button>
              </div>
            )}

            {solapa === 'imagenes' && (
              <>
                <button
                  onClick={() => archivoRef.current?.click()}
                  className="p-[12px] rounded-[6px] bg-[#0F766E] hover:opacity-90 text-[13px]"
                >
                  Subir una imagen
                </button>
                <input
                  ref={archivoRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={subir}
                  className="hidden"
                />
                <div className="text-[12px] text-customColor18 mt-[4px]">
                  De tu biblioteca
                </div>
                <div className="grid grid-cols-3 gap-[6px]">
                  {(biblioteca?.results || []).map((m: any) => (
                    <button
                      key={m.id}
                      onClick={() => agregarImagen(m.path)}
                      className="aspect-square rounded-[4px] overflow-hidden bg-customColor2"
                    >
                      <img
                        src={m.path}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div
          ref={zona}
          className="flex-1 min-w-0 flex items-center justify-center bg-[#0b0b0d] overflow-auto p-[20px]"
        >
          <EditorCanvas contenedor={tamaño} stageRef={stageRef} />
        </div>

        <EditorProperties />
      </div>
    </div>
  );
};
