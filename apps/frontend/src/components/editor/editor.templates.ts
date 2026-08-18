import { Documento, nuevoId } from './editor.types';

/**
 * Plantillas para consultorios odontologicos.
 *
 * Son el motivo por el que este editor existe. Canva tiene un millon de
 * plantillas genericas y las hace mejor; lo que no tiene es "Dia del
 * Odontologo" con el texto ya escrito para ortodoncia. La ventaja no esta en
 * la herramienta, esta en que el punto de partida ya sea del rubro.
 *
 * Cada plantilla es un documento completo. El usuario la abre y cambia lo
 * que quiere: no hay campos obligatorios ni asistentes.
 */

const el = (e: any) => ({
  id: nuevoId(),
  rotation: 0,
  opacity: 1,
  ...e,
});

const texto = (e: any) =>
  el({
    tipo: 'texto',
    fontFamily: 'Inter, Helvetica, Arial, sans-serif',
    fontStyle: 'bold',
    align: 'left',
    lineHeight: 1.2,
    fill: '#FFFFFF',
    ...e,
  });

export interface Plantilla {
  id: string;
  nombre: string;
  categoria: 'Efemérides' | 'Consultorio' | 'Tratamientos' | 'Base';
  documento: Documento;
}

export const PLANTILLAS: Plantilla[] = [
  {
    id: 'blanco-cuadrado',
    nombre: 'En blanco',
    categoria: 'Base',
    documento: { ancho: 1080, alto: 1080, fondo: '#FFFFFF', elementos: [] },
  },
  {
    id: 'blanco-historia',
    nombre: 'Historia en blanco',
    categoria: 'Base',
    documento: { ancho: 1080, alto: 1920, fondo: '#0F766E', elementos: [] },
  },

  {
    id: 'efemeride',
    nombre: 'Efeméride',
    categoria: 'Efemérides',
    documento: {
      ancho: 1080,
      alto: 1080,
      fondo: '#0F766E',
      elementos: [
        el({
          tipo: 'forma',
          forma: 'circulo',
          x: 700,
          y: -180,
          width: 620,
          height: 620,
          fill: '#14B8A6',
          stroke: '',
          strokeWidth: 0,
          cornerRadius: 0,
          opacity: 0.45,
        }),
        texto({
          x: 90,
          y: 300,
          width: 900,
          texto: '3 de octubre',
          fontSize: 44,
          fill: '#2DD4BF',
        }),
        texto({
          x: 90,
          y: 370,
          width: 900,
          texto: 'Día del\nOdontólogo',
          fontSize: 130,
          lineHeight: 1.05,
        }),
        texto({
          x: 90,
          y: 720,
          width: 860,
          texto:
            'Gracias por confiarnos tu sonrisa todos los días. ¡Feliz día a todos los colegas!',
          fontSize: 40,
          fontStyle: 'normal',
          lineHeight: 1.35,
          fill: '#D9F5F1',
        }),
      ],
    },
  },

  {
    id: 'antes-despues',
    nombre: 'Antes y después',
    categoria: 'Tratamientos',
    documento: {
      ancho: 1080,
      alto: 1080,
      fondo: '#0B1220',
      elementos: [
        el({
          tipo: 'forma',
          forma: 'rectangulo',
          x: 60,
          y: 220,
          width: 460,
          height: 620,
          fill: '#1E293B',
          stroke: '',
          strokeWidth: 0,
          cornerRadius: 20,
        }),
        el({
          tipo: 'forma',
          forma: 'rectangulo',
          x: 560,
          y: 220,
          width: 460,
          height: 620,
          fill: '#1E293B',
          stroke: '',
          strokeWidth: 0,
          cornerRadius: 20,
        }),
        texto({ x: 60, y: 150, width: 460, texto: 'ANTES', fontSize: 46, align: 'center', fill: '#94A3B8' }),
        texto({ x: 560, y: 150, width: 460, texto: 'DESPUÉS', fontSize: 46, align: 'center', fill: '#2DD4BF' }),
        texto({
          x: 60,
          y: 890,
          width: 960,
          texto: 'Blanqueamiento dental',
          fontSize: 58,
          align: 'center',
        }),
        texto({
          x: 60,
          y: 965,
          width: 960,
          texto: 'Resultado real de nuestro consultorio',
          fontSize: 32,
          fontStyle: 'normal',
          align: 'center',
          fill: '#94A3B8',
        }),
      ],
    },
  },

  {
    id: 'consejo',
    nombre: 'Consejo del día',
    categoria: 'Consultorio',
    documento: {
      ancho: 1080,
      alto: 1080,
      fondo: '#FFFFFF',
      elementos: [
        el({
          tipo: 'forma',
          forma: 'rectangulo',
          x: 0,
          y: 0,
          width: 1080,
          height: 190,
          fill: '#0F766E',
          stroke: '',
          strokeWidth: 0,
          cornerRadius: 0,
        }),
        texto({ x: 80, y: 62, width: 920, texto: 'CONSEJO DEL DÍA', fontSize: 56 }),
        texto({
          x: 80,
          y: 300,
          width: 920,
          texto: 'Cambiá tu cepillo cada 3 meses',
          fontSize: 84,
          lineHeight: 1.15,
          fill: '#0B1220',
        }),
        texto({
          x: 80,
          y: 560,
          width: 920,
          texto:
            'Las cerdas gastadas limpian menos y lastiman la encía. Si están abiertas o dobladas, ya es hora.',
          fontSize: 42,
          fontStyle: 'normal',
          lineHeight: 1.4,
          fill: '#475569',
        }),
        el({
          tipo: 'forma',
          forma: 'linea',
          x: 80,
          y: 880,
          width: 160,
          height: 0,
          fill: '#14B8A6',
          stroke: '#14B8A6',
          strokeWidth: 8,
          cornerRadius: 0,
        }),
        texto({
          x: 80,
          y: 920,
          width: 920,
          texto: 'Tu consultorio',
          fontSize: 36,
          fill: '#0F766E',
        }),
      ],
    },
  },

  {
    id: 'promo',
    nombre: 'Promoción',
    categoria: 'Consultorio',
    documento: {
      ancho: 1080,
      alto: 1350,
      fondo: '#0F766E',
      elementos: [
        texto({ x: 80, y: 180, width: 920, texto: 'PRIMERA CONSULTA', fontSize: 52, fill: '#2DD4BF' }),
        texto({ x: 80, y: 260, width: 920, texto: 'Sin cargo', fontSize: 150, lineHeight: 1.05 }),
        texto({
          x: 80,
          y: 470,
          width: 920,
          texto: 'Incluye diagnóstico y plan de tratamiento personalizado.',
          fontSize: 42,
          fontStyle: 'normal',
          lineHeight: 1.35,
          fill: '#D9F5F1',
        }),
        el({
          tipo: 'forma',
          forma: 'rectangulo',
          x: 80,
          y: 700,
          width: 620,
          height: 120,
          fill: '#F472B6',
          stroke: '',
          strokeWidth: 0,
          cornerRadius: 60,
        }),
        texto({
          x: 80,
          y: 738,
          width: 620,
          texto: 'Escribinos por privado',
          fontSize: 46,
          align: 'center',
        }),
        texto({
          x: 80,
          y: 1180,
          width: 920,
          texto: 'Consultorio · Dirección · Teléfono',
          fontSize: 34,
          fontStyle: 'normal',
          fill: '#A7E8DF',
        }),
      ],
    },
  },
];
