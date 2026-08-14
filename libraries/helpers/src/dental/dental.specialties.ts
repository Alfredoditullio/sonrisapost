/**
 * Especialidades odontológicas y sus paquetes de contenido.
 *
 * El feed de un consultorio es, en la práctica, los mismos treinta temas
 * repetidos. Tener las plantillas listas por especialidad elimina la página en
 * blanco, que es el motivo real por el que un consultorio deja de publicar.
 *
 * Los textos están en español rioplatense (voseo) porque el mercado es Argentina.
 * `{{consultorio}}` se reemplaza con el nombre de la organización al insertar.
 */

export interface DentalTemplate {
  /** Título corto, es lo que ve el usuario al elegir la plantilla */
  title: string;
  /** Cuerpo del post. Editable: es un punto de partida, no un texto final. */
  body: string;
}

export interface DentalSpecialty {
  slug: string;
  name: string;
  /** Color del Tag que se crea para esta especialidad */
  color: string;
  hashtags: string[];
  templates: DentalTemplate[];
}

export const DENTAL_SPECIALTIES: DentalSpecialty[] = [
  {
    slug: 'general',
    name: 'Odontología general',
    color: '#0F766E',
    hashtags: ['#odontologia', '#saludbucal', '#dentista', '#sonrisasana'],
    templates: [
      {
        title: 'Recordatorio de control semestral',
        body: '¿Cuándo fue tu último control? La mayoría de las caries no duelen hasta que ya son un problema grande.\n\nUn control cada seis meses las detecta cuando todavía se resuelven con una consulta corta.\n\nEscribinos y coordinamos tu turno.',
      },
      {
        title: 'Mito: si no duele, está todo bien',
        body: 'El dolor es el último síntoma, no el primero.\n\nUna caries puede avanzar durante meses sin molestar. Cuando duele, casi siempre ya llegó a la pulpa y el tratamiento es más largo y más caro.\n\nRevisarte a tiempo no es un gasto: es lo que evita el gasto grande.',
      },
      {
        title: 'Técnica de cepillado',
        body: 'Tres cosas que casi todos hacemos mal al cepillarnos:\n\n1. Apretar fuerte. Desgasta el esmalte y lastima la encía. La presión tiene que ser suave.\n2. Cepillar apenas unos segundos. Son dos minutos, cronometrados.\n3. Saltear el hilo dental. El cepillo no llega a donde empieza la mayoría de las caries.',
      },
      {
        title: 'Primera consulta: qué esperar',
        body: '¿Hace años que no vas al odontólogo y te da vergüenza?\n\nNos pasa seguido, y no juzgamos a nadie. La primera consulta es sentarnos a ver cómo está todo y armar un plan por etapas, a tu ritmo.\n\nEmpezar es la parte difícil. El resto lo vemos juntos.',
      },
    ],
  },
  {
    slug: 'ortodoncia',
    name: 'Ortodoncia',
    color: '#2563EB',
    hashtags: ['#ortodoncia', '#brackets', '#alineadores', '#sonrisa'],
    templates: [
      {
        title: '¿Cuánto dura el tratamiento?',
        body: 'La pregunta que más nos hacen: ¿cuánto tiempo voy a tener los brackets?\n\nDepende del caso, y cualquiera que te dé un número exacto sin verte la boca te está adivinando. Lo que sí podemos decirte es que en la primera consulta hacemos el estudio y te damos un plazo estimado con fundamento.',
      },
      {
        title: 'Brackets vs. alineadores',
        body: 'No hay uno mejor que el otro: hay uno mejor para tu caso.\n\nLos alineadores son removibles y discretos, pero dependen de que los uses las horas indicadas. Los brackets trabajan solos, sin que vos tengas que acordarte.\n\nEn la consulta vemos cuál se adapta a tu caso y a tu rutina.',
      },
      {
        title: 'La ortodoncia no es sólo estética',
        body: 'Enderezar los dientes se ve, pero no es lo único que cambia.\n\nUna mordida mal alineada desgasta piezas de forma despareja, complica la higiene y puede cargar la articulación de la mandíbula.\n\nLa estética es la parte visible del resultado. La función es la que te acompaña treinta años.',
      },
      {
        title: 'Cuidados con brackets',
        body: 'Con brackets hay que replantear algunas cosas del día a día:\n\n· Nada muy duro: hielo, caramelos, frutos secos enteros\n· Las manzanas y zanahorias, cortadas en trozos\n· El cepillo interdental pasa a ser tu mejor aliado\n\nNo es para siempre. Y el resultado sí.',
      },
    ],
  },
  {
    slug: 'implantologia',
    name: 'Implantología',
    color: '#7C3AED',
    hashtags: ['#implantes', '#implantesdentales', '#rehabilitacionoral'],
    templates: [
      {
        title: 'Qué es un implante',
        body: 'Un implante no es "un diente postizo". Es una raíz artificial de titanio que se integra al hueso y sostiene una corona.\n\nPor eso se siente y funciona como una pieza propia: está anclado al hueso, igual que un diente natural.',
      },
      {
        title: 'Perder un diente no es sólo un hueco',
        body: 'Cuando falta una pieza, el hueso de esa zona empieza a reabsorberse porque deja de recibir estímulo. Y los dientes vecinos se inclinan hacia el espacio vacío.\n\nO sea: el problema no se queda quieto esperando que decidas.\n\nCuanto antes se resuelve, más simple es la solución.',
      },
      {
        title: 'Duele ponerse un implante',
        body: 'La cirugía se hace con anestesia local: durante el procedimiento no vas a sentir dolor.\n\nEl posoperatorio suele ser más leve de lo que la gente imagina. La mayoría de nuestros pacientes lo compara con una extracción, y se maneja con la medicación que indicamos.',
      },
    ],
  },
  {
    slug: 'odontopediatria',
    name: 'Odontopediatría',
    color: '#EA580C',
    hashtags: ['#odontopediatria', '#saludbucalinfantil', '#dentistainfantil'],
    templates: [
      {
        title: 'Primera visita del bebé',
        body: '¿Cuándo llevar al nene al odontólogo por primera vez?\n\nLa recomendación es al año de vida, o cuando salga el primer diente.\n\nParece temprano, pero la idea no es tratar nada: es que el consultorio le resulte un lugar conocido antes de que exista un problema. Un chico que llega por primera vez con dolor asocia el odontólogo al dolor.',
      },
      {
        title: 'Los dientes de leche sí importan',
        body: '"Total, se le van a caer igual."\n\nLos dientes de leche guardan el lugar de los definitivos. Si se pierden antes de tiempo por una caries, los que vienen salen desordenados y ahí aparece la ortodoncia que se podría haber evitado.\n\nAdemás, una caries en un diente de leche duele igual.',
      },
      {
        title: 'Cómo preparar a tu hijo',
        body: 'Tres cosas que ayudan mucho antes de la primera consulta:\n\n· No uses el odontólogo como amenaza ("si no te lavás los dientes, te lleva el dentista")\n· Evitá decirle "no te va a doler" — le instala la idea de que podría doler\n· Contale que le vamos a contar los dientes\n\nLo demás lo manejamos nosotros.',
      },
    ],
  },
  {
    slug: 'estetica',
    name: 'Estética dental',
    color: '#DB2777',
    hashtags: ['#estéticadental', '#blanqueamiento', '#carillas', '#diseñodesonrisa'],
    templates: [
      {
        title: 'Blanqueamiento: qué esperar',
        body: 'El blanqueamiento aclara el color natural de tus dientes. No los pinta de blanco.\n\nEso significa que el resultado depende del tono del que partís, y que las coronas, carillas y composites no cambian de color: si tenés, hay que planificarlo antes.\n\nEn la consulta te mostramos hasta dónde se puede llegar en tu caso.',
      },
      {
        title: 'Blanqueamiento casero de internet',
        body: 'Bicarbonato, carbón activado, limón.\n\nTodo eso abrasiona el esmalte. Y el esmalte no se regenera: una vez que lo desgastaste, no vuelve.\n\nLo peor es que a veces funciona a corto plazo, y por eso se sigue recomendando. El daño aparece años después.',
      },
      {
        title: 'Antes de las fiestas',
        body: 'Se vienen las fotos de fin de año.\n\nSi estabas pensando en un blanqueamiento, este es el momento de agendarlo: el tratamiento lleva algunas sesiones y conviene no dejarlo para la última semana.',
      },
    ],
  },
  {
    slug: 'periodoncia',
    name: 'Periodoncia',
    color: '#059669',
    hashtags: ['#periodoncia', '#encias', '#gingivitis', '#saludperiodontal'],
    templates: [
      {
        title: 'Si te sangran las encías, no es normal',
        body: 'Mucha gente naturalizó que al cepillarse sangre un poco. No es normal: es el primer signo de gingivitis.\n\nLa buena noticia es que en esa etapa se revierte por completo. Si se deja avanzar a periodontitis, el hueso que sostiene el diente empieza a perderse, y eso ya no se recupera.',
      },
      {
        title: 'Gingivitis y periodontitis no son lo mismo',
        body: 'Gingivitis: inflamación de la encía. Reversible.\n\nPeriodontitis: la inflamación llegó al hueso que sostiene el diente. El hueso perdido no vuelve.\n\nLa primera se trata con una limpieza y mejor higiene. La segunda requiere tratamiento periodontal y controles de por vida. La diferencia entre una y otra suele ser haber consultado a tiempo.',
      },
      {
        title: 'Encías y salud general',
        body: 'La enfermedad periodontal está asociada a diabetes y a enfermedad cardiovascular. La relación va en los dos sentidos: la diabetes mal controlada empeora las encías, y la infección periodontal dificulta controlar la glucemia.\n\nLa boca no es un compartimento aparte del resto del cuerpo.',
      },
    ],
  },
  {
    slug: 'endodoncia',
    name: 'Endodoncia',
    color: '#B45309',
    hashtags: ['#endodoncia', '#tratamientodeconducto'],
    templates: [
      {
        title: 'El tratamiento de conducto quita el dolor',
        body: 'La endodoncia tiene mala fama, y es injusta.\n\nEl dolor que la gente recuerda es el de la infección que llevó al tratamiento, no el del tratamiento. La endodoncia es justamente lo que lo saca.\n\nCon anestesia y técnica actual, la sesión es comparable a una restauración grande.',
      },
      {
        title: 'Por qué hace falta la corona después',
        body: 'Un diente con endodoncia queda sin irrigación y se vuelve más frágil.\n\nPor eso, en la mayoría de los casos, después del tratamiento indicamos una corona: protege la pieza de una fractura que obligaría a extraerla.\n\nSaltear ese paso es la razón más común por la que se pierde un diente que ya estaba salvado.',
      },
    ],
  },
];

export const getSpecialty = (slug: string) =>
  DENTAL_SPECIALTIES.find((s) => s.slug === slug);
