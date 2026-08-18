/**
 * Decide que hacer con un comentario.
 *
 * Vive aparte de los proveedores porque la decision es la misma en todas las
 * redes: lo unico que cambia es como se leen y se escriben los comentarios.
 */

export interface ReglaComentario {
  palabras: string[];
  respuesta: string;
}

export interface DecisionComentario {
  accion: 'responder' | 'frenar' | 'ignorar';
  respuesta?: string;
  /** Que palabra de alerta lo freno, para poder explicarselo al profesional. */
  palabraFreno?: string;
}

/**
 * Normaliza para comparar: minusculas y sin tildes.
 *
 * Sin esto "turno" no coincide con "Turno" ni "cuanto" con "cuánto", y el
 * odontologo tendria que adivinar como escribe la gente. Los pacientes
 * escriben desde el telefono, con y sin tildes, en mayusculas y minusculas.
 */
export const normalizar = (texto: string) =>
  (texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

/**
 * Busca una palabra dentro de un texto respetando los limites de palabra.
 *
 * Importa: buscando "cara" por inclusion simple, "caramelo" daria positivo.
 * Peor todavia con las palabras de alerta, donde un falso positivo frena una
 * respuesta que deberia haber salido.
 *
 * Los limites se calculan sobre el texto ya normalizado y se arma la busqueda
 * con caracteres escapados, porque el odontologo escribe estas palabras a
 * mano y puede poner cualquier cosa.
 */
export const contienePalabra = (texto: string, palabra: string) => {
  const t = normalizar(texto);
  const p = normalizar(palabra).trim();
  if (!p) return false;

  const escapada = p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // \b no sirve con acentos ni con frases de varias palabras, asi que se
  // exige que a los costados haya algo que no sea letra ni numero.
  return new RegExp(`(^|[^a-z0-9])${escapada}([^a-z0-9]|$)`).test(t);
};

/**
 * El orden manda: gana la primera regla que coincide.
 *
 * Antes de las reglas se evaluan las palabras de alerta, y eso NO es
 * negociable: si alguien escribe "quiero un turno porque me duele mucho", la
 * regla de turnos coincide, pero la consulta es clinica. La alerta gana.
 */
export const decidirRespuesta = (
  comentario: string,
  reglas: ReglaComentario[],
  palabrasFreno: string[],
  respuestaGeneral?: string | null
): DecisionComentario => {
  const texto = comentario || '';

  for (const palabra of palabrasFreno || []) {
    if (contienePalabra(texto, palabra)) {
      return { accion: 'frenar', palabraFreno: palabra.trim() };
    }
  }

  for (const regla of reglas || []) {
    if (!regla?.respuesta?.trim()) continue;
    if ((regla.palabras || []).some((p) => contienePalabra(texto, p))) {
      return { accion: 'responder', respuesta: regla.respuesta };
    }
  }

  if (respuestaGeneral?.trim()) {
    return { accion: 'responder', respuesta: respuestaGeneral };
  }

  return { accion: 'ignorar' };
};

/**
 * Reemplaza {nombre} por el nombre de quien comento.
 *
 * Si no viene el nombre se saca el saludo entero en vez de dejar "¡Hola !",
 * que se lee como un error de la aplicacion. Se limpian tambien los espacios
 * y signos que quedan colgando.
 */
export const aplicarVariables = (
  plantilla: string,
  variables: { nombre?: string }
) => {
  const nombre = (variables.nombre || '').trim();
  if (nombre) return plantilla.replace(/\{nombre\}/g, nombre);

  return plantilla
    .replace(/\s*,?\s*\{nombre\}/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
};
