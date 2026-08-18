/**
 * Modelo del editor de diseño.
 *
 * Un documento es una lista plana de elementos ordenados de atras hacia
 * adelante: el ultimo del arreglo es el que se ve arriba. No hay grupos ni
 * arboles a proposito — el 99% de un post es media docena de elementos
 * sueltos, y un arbol complica el reordenado, la seleccion y el historial
 * sin dar nada a cambio.
 */

export interface ElementoBase {
  id: string;
  x: number;
  y: number;
  rotation: number;
  opacity: number;
}

export interface ElementoTexto extends ElementoBase {
  tipo: 'texto';
  texto: string;
  /** Ancho de la caja. El alto lo decide el texto al fluir. */
  width: number;
  fontSize: number;
  fontFamily: string;
  fontStyle: string;
  fill: string;
  align: 'left' | 'center' | 'right';
  lineHeight: number;
  /** Contorno, para que un texto claro se lea sobre una foto clara. */
  stroke?: string;
  strokeWidth?: number;
}

export interface ElementoImagen extends ElementoBase {
  tipo: 'imagen';
  src: string;
  width: number;
  height: number;
  cornerRadius: number;
}

export interface ElementoForma extends ElementoBase {
  tipo: 'forma';
  forma: 'rectangulo' | 'circulo' | 'linea';
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  cornerRadius: number;
}

export type Elemento = ElementoTexto | ElementoImagen | ElementoForma;

export interface Documento {
  ancho: number;
  alto: number;
  fondo: string;
  elementos: Elemento[];
}

/**
 * Formatos de lienzo.
 *
 * Son los que aceptan las redes donde publica un consultorio. Estan puestos
 * como medidas concretas y no como proporciones porque exportar a la
 * resolucion correcta importa: una imagen de 500px estirada a 1080 se ve
 * mal en el telefono, que es donde se mira todo esto.
 */
export const FORMATOS = [
  { id: 'cuadrado', nombre: 'Cuadrado', detalle: 'Instagram, Facebook', ancho: 1080, alto: 1080 },
  { id: 'retrato', nombre: 'Retrato', detalle: 'Instagram (ocupa más pantalla)', ancho: 1080, alto: 1350 },
  { id: 'historia', nombre: 'Historia', detalle: 'Historias y Reels', ancho: 1080, alto: 1920 },
  { id: 'horizontal', nombre: 'Horizontal', detalle: 'Facebook, LinkedIn', ancho: 1200, alto: 630 },
] as const;

/**
 * Tipografias ofrecidas.
 *
 * Pocas y elegidas. Un selector con trescientas fuentes no mejora ningun
 * diseño: paraliza. Todas son de sistema o de pila web, asi que no hay que
 * descargar nada ni esperar a que carguen para exportar.
 */
export const TIPOGRAFIAS = [
  { nombre: 'Moderna', valor: 'Inter, Helvetica, Arial, sans-serif' },
  { nombre: 'Clásica', valor: 'Georgia, "Times New Roman", serif' },
  { nombre: 'Redondeada', valor: '"Trebuchet MS", "Segoe UI", sans-serif' },
  { nombre: 'Angosta', valor: '"Arial Narrow", "Helvetica Neue", sans-serif' },
  { nombre: 'Máquina', valor: '"Courier New", monospace' },
] as const;

/** Paleta base: los colores de marca mas neutros utiles sobre fotos. */
export const COLORES = [
  '#FFFFFF', '#000000', '#0F766E', '#14B8A6', '#2DD4BF',
  '#F472B6', '#FBBF24', '#EF4444', '#3B82F6', '#6B7280',
];

export const nuevoId = () =>
  `el-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
