/**
 * Calendario odontológico: efemérides y ventanas estacionales.
 *
 * La fecha sola no le sirve a nadie — un consultorio que ve "hoy es el Día de la
 * Salud Bucal" sigue sin saber qué publicar. Por eso cada entrada trae el post
 * redactado, listo para editar y agendar.
 *
 * IMPORTANTE: las fechas móviles (`rule`) se calculan por regla, no por día fijo.
 * Verificá las fechas contra la fuente oficial antes de una campaña: algunas
 * conmemoraciones cambian de fecha según el país o el año.
 */

export type DentalEventScope = 'ar' | 'internacional';

export interface DentalEvent {
  slug: string;
  name: string;
  /** Día fijo: [mes (1-12), día]. Ausente si la fecha es móvil. */
  fixed?: [number, number];
  /** Fecha móvil: n-ésimo día de la semana del mes. weekday 0=domingo. */
  rule?: { month: number; weekday: number; nth: number };
  scope: DentalEventScope;
  /** Especialidades a las que le sirve más. Vacío = a todas. */
  specialties: string[];
  /** Por qué le importa a un consultorio. Se muestra como ayuda. */
  why: string;
  /** Post sugerido, editable. */
  post: string;
}

export const DENTAL_EVENTS: DentalEvent[] = [
  {
    slug: 'salud-bucal',
    name: 'Día Mundial de la Salud Bucal',
    fixed: [3, 20],
    scope: 'internacional',
    specialties: [],
    why: 'Impulsado por la FDI. Es la fecha con más conversación pública sobre salud bucal en todo el año.',
    post: 'Hoy es el Día Mundial de la Salud Bucal.\n\nUna buena excusa para lo de siempre: dos minutos de cepillado, dos veces por día, hilo dental todos los días y un control cada seis meses.\n\nNo es complicado. Es constante, que es distinto.',
  },
  {
    slug: 'dia-odontologo-ar',
    name: 'Día del Odontólogo (Argentina)',
    fixed: [10, 3],
    scope: 'ar',
    specialties: [],
    why: 'Es el día del equipo. Funciona muy bien para mostrar las caras del consultorio, que es el contenido que más conecta.',
    post: 'Hoy se celebra el Día del Odontólogo en Argentina.\n\nDetrás de cada tratamiento hay años de estudio y un equipo que se sigue capacitando para atenderte mejor.\n\n¡Feliz día a todos los colegas!',
  },
  {
    slug: 'sin-tabaco',
    name: 'Día Mundial Sin Tabaco',
    fixed: [5, 31],
    scope: 'internacional',
    specialties: ['periodoncia', 'general'],
    why: 'El tabaco es el principal factor de riesgo de cáncer bucal y de enfermedad periodontal. Tema propio, no prestado.',
    post: 'El cigarrillo no sólo mancha los dientes.\n\nEs el principal factor de riesgo de cáncer bucal, multiplica las chances de enfermedad periodontal y compromete la cicatrización después de una cirugía o un implante.\n\nSi estás pensando en dejar, tu boca lo agradece antes de lo que creés.',
  },
  {
    slug: 'cancer-cabeza-cuello',
    name: 'Día Mundial contra el Cáncer de Cabeza y Cuello',
    fixed: [7, 27],
    scope: 'internacional',
    specialties: ['general'],
    why: 'El odontólogo suele ser quien detecta primero una lesión sospechosa. Posicionarse en esto es serio y diferencial.',
    post: 'Una llaga en la boca que no cierra en dos semanas merece una consulta.\n\nEl cáncer bucal detectado a tiempo tiene muy buen pronóstico. El problema es que en las etapas iniciales no duele, y por eso se consulta tarde.\n\nEn cada control revisamos también los tejidos blandos, no sólo los dientes.',
  },
  {
    slug: 'diabetes',
    name: 'Día Mundial de la Diabetes',
    fixed: [11, 14],
    scope: 'internacional',
    specialties: ['periodoncia'],
    why: 'La relación entre diabetes y periodontitis va en los dos sentidos. Buen tema para pacientes con comorbilidades.',
    post: 'Diabetes y encías se afectan mutuamente.\n\nLa glucemia mal controlada empeora la enfermedad periodontal, y la infección de las encías dificulta controlar la glucemia.\n\nSi tenés diabetes, contanoslo en la consulta: cambia el seguimiento que hacemos.',
  },
  {
    slug: 'vuelta-al-cole',
    name: 'Vuelta al colegio',
    fixed: [2, 15],
    scope: 'ar',
    specialties: ['odontopediatria', 'ortodoncia'],
    why: 'Ventana estacional, no efeméride. Las familias organizan controles junto con los útiles y el guardapolvo.',
    post: 'Arranca el colegio y con eso vuelven las rutinas.\n\nBuen momento para el control odontológico de los chicos, antes de que la agenda se llene. Una caries detectada ahora se resuelve en una sesión corta; en septiembre puede ser otra historia.\n\nEscribinos y coordinamos.',
  },
  {
    slug: 'fiestas',
    name: 'Fin de año y fiestas',
    fixed: [11, 20],
    scope: 'ar',
    specialties: ['estetica'],
    why: 'Ventana estacional de mayor demanda de estética. Conviene publicar con anticipación: los tratamientos llevan sesiones.',
    post: 'Se vienen las fiestas y las fotos.\n\nSi tenías pendiente un blanqueamiento o una limpieza, este es el momento de agendarlo: los tratamientos estéticos llevan más de una sesión y sobre la fecha ya no llegamos.\n\nQuedan turnos este mes.',
  },
  {
    slug: 'sonrisa',
    name: 'Día Mundial de la Sonrisa',
    rule: { month: 10, weekday: 5, nth: 1 },
    scope: 'internacional',
    specialties: ['estetica', 'ortodoncia'],
    why: 'Fecha móvil: primer viernes de octubre. Liviana y muy compartible.',
    post: 'Hoy es el Día Mundial de la Sonrisa.\n\nHay gente que tapa su sonrisa en las fotos por vergüenza. Casi siempre eso tiene solución, y suele ser más simple de lo que imaginan.\n\nSi es tu caso, vení y lo charlamos sin compromiso.',
  },
  {
    slug: 'dia-del-nino-ar',
    name: 'Día del Niño (Argentina)',
    rule: { month: 8, weekday: 0, nth: 3 },
    scope: 'ar',
    specialties: ['odontopediatria'],
    why: 'Fecha móvil: tercer domingo de agosto. Verificá el día exacto del año en curso.',
    post: '¡Feliz día para los más chicos!\n\nUn dato para las familias: la primera visita al odontólogo se recomienda al año de vida, o cuando aparece el primer diente.\n\nLa idea no es tratar nada — es que el consultorio les resulte familiar antes de que exista un problema.',
  },
];

/** Resuelve la fecha de un evento para un año dado. */
export function resolveEventDate(event: DentalEvent, year: number): Date {
  if (event.fixed) {
    return new Date(year, event.fixed[0] - 1, event.fixed[1]);
  }
  const { month, weekday, nth } = event.rule!;
  const primero = new Date(year, month - 1, 1);
  const desplazamiento = (weekday - primero.getDay() + 7) % 7;
  return new Date(year, month - 1, 1 + desplazamiento + (nth - 1) * 7);
}

/** Eventos de un año, ordenados, opcionalmente filtrados por especialidad. */
export function getEventsForYear(year: number, specialty?: string) {
  return DENTAL_EVENTS.filter(
    (e) => !specialty || !e.specialties.length || e.specialties.includes(specialty)
  )
    .map((e) => ({ event: e, date: resolveEventDate(e, year) }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}
