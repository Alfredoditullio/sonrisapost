'use client';

import { FC, useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Text, Image, Circle, Line, Transformer } from 'react-konva';
import type Konva from 'konva';
import { useEditor } from './editor.store';
import { Elemento } from './editor.types';

/** Carga una imagen y la devuelve cuando esta lista para dibujar. */
const useImagen = (src: string) => {
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!src) return;
    const imagen = new window.Image();
    // Sin esto, exportar el lienzo falla: una imagen de otro dominio
    // "mancha" el canvas y el navegador bloquea toDataURL por seguridad.
    imagen.crossOrigin = 'anonymous';
    imagen.src = src;
    imagen.onload = () => setImg(imagen);
    return () => {
      imagen.onload = null;
    };
  }, [src]);

  return img;
};

const NodoImagen: FC<{ el: any; comun: any }> = ({ el, comun }) => {
  const img = useImagen(el.src);
  return (
    <Image
      {...comun}
      image={img as any}
      width={el.width}
      height={el.height}
      cornerRadius={el.cornerRadius}
    />
  );
};

export const EditorCanvas: FC<{
  contenedor: { ancho: number; alto: number };
  stageRef: any;
}> = ({ contenedor, stageRef }) => {
  const documento = useEditor((s) => s.documento);
  const seleccion = useEditor((s) => s.seleccion);
  const seleccionar = useEditor((s) => s.seleccionar);
  const actualizar = useEditor((s) => s.actualizar);
  const marcarPunto = useEditor((s) => s.marcarPunto);

  const trRef = useRef<Konva.Transformer>(null);
  const nodos = useRef<Record<string, Konva.Node>>({});

  // El lienzo se dibuja a tamaño real y se escala para entrar en pantalla.
  // Trabajar en coordenadas reales evita convertir en cada operacion y hace
  // que la exportacion salga exacta.
  const escala = Math.min(
    (contenedor.ancho - 80) / documento.ancho,
    (contenedor.alto - 80) / documento.alto,
    1
  );

  useEffect(() => {
    const tr = trRef.current;
    if (!tr) return;

    const nodo = seleccion ? nodos.current[seleccion] : null;
    tr.nodes(nodo ? [nodo] : []);
    tr.getLayer()?.batchDraw();
  }, [seleccion, documento.elementos.length]);

  const alSoltar = (el: Elemento) => (e: any) => {
    actualizar(el.id, { x: e.target.x(), y: e.target.y() });
  };

  /**
   * Konva aplica el redimensionado como escala del nodo. Se traduce a ancho y
   * alto reales y se devuelve la escala a 1: si no, el texto y los bordes se
   * deforman al escalar, y los tamaños dejan de significar lo que dicen.
   */
  const alTransformar = (el: Elemento) => (e: any) => {
    const nodo = e.target;
    const sx = nodo.scaleX();
    const sy = nodo.scaleY();
    nodo.scaleX(1);
    nodo.scaleY(1);

    const base: any = {
      x: nodo.x(),
      y: nodo.y(),
      rotation: nodo.rotation(),
    };

    if (el.tipo === 'texto') {
      // El alto del texto lo decide el contenido: solo se ajusta el ancho.
      base.width = Math.max(40, nodo.width() * sx);
    } else {
      base.width = Math.max(10, nodo.width() * sx);
      base.height = Math.max(10, nodo.height() * sy);
    }

    actualizar(el.id, base);
  };

  const dibujar = (el: Elemento) => {
    const comun = {
      key: el.id,
      id: el.id,
      x: el.x,
      y: el.y,
      rotation: el.rotation,
      opacity: el.opacity,
      draggable: true,
      ref: (n: any) => {
        if (n) nodos.current[el.id] = n;
      },
      onMouseDown: () => seleccionar(el.id),
      onTap: () => seleccionar(el.id),
      onDragStart: marcarPunto,
      onDragEnd: alSoltar(el),
      onTransformStart: marcarPunto,
      onTransformEnd: alTransformar(el),
    };

    if (el.tipo === 'texto') {
      return (
        <Text
          {...comun}
          text={el.texto}
          width={el.width}
          fontSize={el.fontSize}
          fontFamily={el.fontFamily}
          fontStyle={el.fontStyle}
          fill={el.fill}
          align={el.align}
          lineHeight={el.lineHeight}
          stroke={el.stroke}
          strokeWidth={el.strokeWidth || 0}
          // El contorno se dibuja detras del relleno; al reves se come la
          // forma de la letra y el texto queda ilegible.
          fillAfterStrokeEnabled={true}
        />
      );
    }

    if (el.tipo === 'imagen') return <NodoImagen key={el.id} el={el} comun={comun} />;

    if (el.forma === 'circulo') {
      return (
        <Circle
          {...comun}
          radius={el.width / 2}
          width={el.width}
          height={el.width}
          fill={el.fill}
          stroke={el.stroke}
          strokeWidth={el.strokeWidth}
        />
      );
    }

    if (el.forma === 'linea') {
      return (
        <Line
          {...comun}
          points={[0, 0, el.width, 0]}
          stroke={el.stroke || el.fill}
          strokeWidth={Math.max(1, el.strokeWidth || 4)}
          lineCap="round"
        />
      );
    }

    return (
      <Rect
        {...comun}
        width={el.width}
        height={el.height}
        fill={el.fill}
        stroke={el.stroke}
        strokeWidth={el.strokeWidth}
        cornerRadius={el.cornerRadius}
      />
    );
  };

  return (
    <Stage
      ref={stageRef}
      id="lienzo-editor"
      width={documento.ancho * escala}
      height={documento.alto * escala}
      scaleX={escala}
      scaleY={escala}
      // Click en el fondo = deseleccionar. Sin esto no hay forma de soltar la
      // seleccion y la barra de propiedades queda pegada.
      onMouseDown={(e) => {
        if (e.target === e.target.getStage()) seleccionar(null);
      }}
      className="shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"
    >
      <Layer>
        <Rect
          x={0}
          y={0}
          width={documento.ancho}
          height={documento.alto}
          fill={documento.fondo}
          listening={false}
        />
        {documento.elementos.map(dibujar)}
        <Transformer
          ref={trRef}
          rotateEnabled={true}
          keepRatio={false}
          anchorSize={12}
          borderStroke="#2DD4BF"
          anchorStroke="#2DD4BF"
          anchorCornerRadius={3}
          boundBoxFunc={(anterior, nuevo) =>
            nuevo.width < 20 || nuevo.height < 20 ? anterior : nuevo
          }
        />
      </Layer>
    </Stage>
  );
};
