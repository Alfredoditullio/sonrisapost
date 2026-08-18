/**
 * Precios de la IA, para traducir consumo a plata.
 *
 * NO hay precios escritos a mano en este archivo, y es a proposito: los
 * precios de los modelos cambian y un numero inventado o viejo da una
 * ganancia falsa, que es peor que no tener ninguna. Se cargan por variable
 * de entorno, copiados del panel del proveedor.
 *
 * Sin precios cargados el sistema NO deja de medir: sigue guardando tokens e
 * imagenes, y el costo queda en cero. Como las unidades quedan en la base,
 * el dia que cargues los precios se puede recalcular todo el historico.
 *
 * Variables (todas en dolares):
 *   AI_PRICE_INPUT_PER_MTOK   por millon de tokens de entrada
 *   AI_PRICE_OUTPUT_PER_MTOK  por millon de tokens de salida
 *   AI_PRICE_IMAGE            por imagen generada
 *   AI_PRICE_VIDEO            por video generado
 */

const num = (v?: string) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

export const precios = () => ({
  entradaPorMillon: num(process.env.AI_PRICE_INPUT_PER_MTOK),
  salidaPorMillon: num(process.env.AI_PRICE_OUTPUT_PER_MTOK),
  imagen: num(process.env.AI_PRICE_IMAGE),
  video: num(process.env.AI_PRICE_VIDEO),
});

/** true si falta cargar precios: el costo va a dar cero aunque haya consumo. */
export const faltanPrecios = () => {
  const p = precios();
  return !p.entradaPorMillon && !p.salidaPorMillon && !p.imagen && !p.video;
};

/**
 * Costo en millonesimas de dolar.
 *
 * Se redondea al final y no en cada termino: redondear antes convierte miles
 * de llamadas baratas en cero.
 */
export const costoEnMicros = (u: {
  inputTokens?: number;
  outputTokens?: number;
  imagenes?: number;
  videos?: number;
}) => {
  const p = precios();
  const usd =
    ((u.inputTokens || 0) / 1_000_000) * p.entradaPorMillon +
    ((u.outputTokens || 0) / 1_000_000) * p.salidaPorMillon +
    (u.imagenes || 0) * p.imagen +
    (u.videos || 0) * p.video;

  return Math.round(usd * 1_000_000);
};

/**
 * Tope de pasos del agente.
 *
 * Es lo que convierte un costo abierto en uno acotado. El agente razona,
 * llama una herramienta, vuelve a razonar — y en cada vuelta reenvia toda la
 * conversacion, asi que el gasto crece mas rapido que la cantidad de vueltas.
 * Sin tope, una sola charla puede costar veinte veces mas que otra.
 *
 * 12 alcanza para el camino normal (listar canales, leer reglas, generar una
 * imagen, programar y confirmar) con margen. Si en la medicion aparecen
 * muchas llamadas con hitLimit, hay que subirlo.
 */
export const topeDePasos = () => {
  const n = Number(process.env.AGENT_MAX_STEPS);
  return Number.isFinite(n) && n > 0 ? n : 12;
};
