import { create } from 'zustand';
import { Documento, Elemento, nuevoId } from './editor.types';

/**
 * Estado del editor, con deshacer y rehacer.
 *
 * El historial guarda documentos enteros y no diferencias. Un documento son
 * unas decenas de objetos chicos: copiarlo es barato y elimina toda una
 * clase de errores — con diferencias, cualquier accion que se olvide de
 * registrar su inversa deja el historial corrupto, y eso aparece recien
 * cuando el usuario deshace tres pasos y ve algo que no corresponde.
 */

const TOPE_HISTORIAL = 60;

interface EstadoEditor {
  documento: Documento;
  seleccion: string | null;
  pasado: Documento[];
  futuro: Documento[];

  setDocumento: (d: Documento) => void;
  /** Cambia el documento registrando el anterior en el historial. */
  aplicar: (cambio: (d: Documento) => Documento) => void;
  /** Cambia sin registrar: para arrastres, donde cada pixel seria un paso. */
  aplicarSinHistorial: (cambio: (d: Documento) => Documento) => void;
  /** Congela el estado actual como punto de retorno. Se llama al empezar un arrastre. */
  marcarPunto: () => void;

  seleccionar: (id: string | null) => void;
  agregar: (el: Elemento) => void;
  actualizar: (id: string, cambios: Partial<Elemento>) => void;
  borrar: (id: string) => void;
  duplicar: (id: string) => void;
  moverCapa: (id: string, direccion: 'adelante' | 'atras' | 'frente' | 'fondo') => void;

  deshacer: () => void;
  rehacer: () => void;
}

const DOCUMENTO_VACIO: Documento = {
  ancho: 1080,
  alto: 1080,
  fondo: '#FFFFFF',
  elementos: [],
};

export const useEditor = create<EstadoEditor>((set, get) => ({
  documento: DOCUMENTO_VACIO,
  seleccion: null,
  pasado: [],
  futuro: [],

  setDocumento: (documento) =>
    set({ documento, seleccion: null, pasado: [], futuro: [] }),

  marcarPunto: () =>
    set((s) => ({
      pasado: [...s.pasado, s.documento].slice(-TOPE_HISTORIAL),
      futuro: [],
    })),

  aplicar: (cambio) =>
    set((s) => ({
      documento: cambio(s.documento),
      pasado: [...s.pasado, s.documento].slice(-TOPE_HISTORIAL),
      // Rehacer se limpia al hacer algo nuevo: el futuro que habia ya no
      // corresponde a esta historia.
      futuro: [],
    })),

  aplicarSinHistorial: (cambio) =>
    set((s) => ({ documento: cambio(s.documento) })),

  seleccionar: (seleccion) => set({ seleccion }),

  agregar: (el) => {
    get().aplicar((d) => ({ ...d, elementos: [...d.elementos, el] }));
    set({ seleccion: el.id });
  },

  actualizar: (id, cambios) =>
    get().aplicarSinHistorial((d) => ({
      ...d,
      elementos: d.elementos.map((e) =>
        e.id === id ? ({ ...e, ...cambios } as Elemento) : e
      ),
    })),

  borrar: (id) => {
    get().aplicar((d) => ({
      ...d,
      elementos: d.elementos.filter((e) => e.id !== id),
    }));
    set({ seleccion: null });
  },

  duplicar: (id) => {
    const original = get().documento.elementos.find((e) => e.id === id);
    if (!original) return;

    // Se corre un poco: apilado exactamente encima parece que no paso nada.
    const copia = { ...original, id: nuevoId(), x: original.x + 24, y: original.y + 24 };
    get().aplicar((d) => ({ ...d, elementos: [...d.elementos, copia] }));
    set({ seleccion: copia.id });
  },

  moverCapa: (id, direccion) =>
    get().aplicar((d) => {
      const i = d.elementos.findIndex((e) => e.id === id);
      if (i === -1) return d;

      const lista = [...d.elementos];
      const [el] = lista.splice(i, 1);

      const destino =
        direccion === 'frente'
          ? lista.length
          : direccion === 'fondo'
          ? 0
          : Math.max(0, Math.min(lista.length, i + (direccion === 'adelante' ? 1 : -1)));

      lista.splice(destino, 0, el);
      return { ...d, elementos: lista };
    }),

  deshacer: () =>
    set((s) => {
      if (!s.pasado.length) return s;
      const anterior = s.pasado[s.pasado.length - 1];
      return {
        documento: anterior,
        pasado: s.pasado.slice(0, -1),
        futuro: [s.documento, ...s.futuro].slice(0, TOPE_HISTORIAL),
        seleccion: null,
      };
    }),

  rehacer: () =>
    set((s) => {
      if (!s.futuro.length) return s;
      const siguiente = s.futuro[0];
      return {
        documento: siguiente,
        pasado: [...s.pasado, s.documento].slice(-TOPE_HISTORIAL),
        futuro: s.futuro.slice(1),
        seleccion: null,
      };
    }),
}));
