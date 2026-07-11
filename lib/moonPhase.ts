/**
 * Cálculo de fase lunar sin depender de APIs externas.
 * Basado en el ciclo sinódico lunar (29.53058867 días) y una fecha
 * de luna nueva conocida como referencia astronómica.
 */

export type MoonPhase =
  | 'luna_nueva'
  | 'creciente'
  | 'cuarto_creciente'
  | 'gibosa_creciente'
  | 'luna_llena'
  | 'gibosa_menguante'
  | 'cuarto_menguante'
  | 'menguante';

export interface MoonInfo {
  phase: MoonPhase;
  phaseName: string;
  emoji: string;
  illumination: number; // 0 a 1
  ritualFocus: string; // qué energía trae esta fase para el ritual
}

const SYNODIC_MONTH = 29.53058867; // días
// Luna nueva de referencia: 6 de enero de 2000, 18:14 UTC
const KNOWN_NEW_MOON = new Date(Date.UTC(2000, 0, 6, 18, 14, 0)).getTime();

const MOON_PHASE_DATA: Record<MoonPhase, { name: string; emoji: string; ritual: string }> = {
  luna_nueva: {
    name: 'Luna Nueva',
    emoji: '🌑',
    ritual: 'Momento de sembrar intenciones nuevas. Ideal para pedir y visualizar lo que querés atraer.',
  },
  creciente: {
    name: 'Luna Creciente',
    emoji: '🌒',
    ritual: 'La energía empieza a crecer. Sostené el foco en tu intención y empezá a actuar en esa dirección.',
  },
  cuarto_creciente: {
    name: 'Cuarto Creciente',
    emoji: '🌓',
    ritual: 'Momento de decisión y acción. Los obstáculos aparecen para que los atravieses, no para detenerte.',
  },
  gibosa_creciente: {
    name: 'Gibosa Creciente',
    emoji: '🌔',
    ritual: 'Ajustá y refiná. Revisá qué está funcionando en tu manifestación y qué necesita un cambio de rumbo.',
  },
  luna_llena: {
    name: 'Luna Llena',
    emoji: '🌕',
    ritual: 'Momento de máxima energía y de recibir. Celebrá lo que ya manifestaste y soltá lo que ya no te sirve.',
  },
  gibosa_menguante: {
    name: 'Gibosa Menguante',
    emoji: '🌖',
    ritual: 'Gratitud y agradecimiento profundo. Reconocé el camino recorrido.',
  },
  cuarto_menguante: {
    name: 'Cuarto Menguante',
    emoji: '🌗',
    ritual: 'Soltar y liberar. Es tiempo de dejar ir lo que ya cumplió su propósito.',
  },
  menguante: {
    name: 'Luna Menguante',
    emoji: '🌘',
    ritual: 'Descanso y reflexión. Prepará el espacio interior para la próxima luna nueva.',
  },
};

/**
 * Devuelve la información de la fase lunar para una fecha dada (por defecto, hoy).
 */
export function getMoonPhase(date: Date = new Date()): MoonInfo {
  const now = date.getTime();
  const daysSinceNewMoon = (now - KNOWN_NEW_MOON) / (1000 * 60 * 60 * 24);
  const currentCyclePosition = daysSinceNewMoon % SYNODIC_MONTH;
  // normalizar a un valor positivo entre 0 y SYNODIC_MONTH
  const normalized = ((currentCyclePosition % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;

  // dividimos el ciclo en 8 fases
  const phaseIndex = Math.floor((normalized / SYNODIC_MONTH) * 8) % 8;

  const phases: MoonPhase[] = [
    'luna_nueva',
    'creciente',
    'cuarto_creciente',
    'gibosa_creciente',
    'luna_llena',
    'gibosa_menguante',
    'cuarto_menguante',
    'menguante',
  ];

  const phase = phases[phaseIndex];
  const illumination = (1 - Math.cos((normalized / SYNODIC_MONTH) * 2 * Math.PI)) / 2;
  const data = MOON_PHASE_DATA[phase];

  return {
    phase,
    phaseName: data.name,
    emoji: data.emoji,
    illumination: Math.round(illumination * 100) / 100,
    ritualFocus: data.ritual,
  };
}

/**
 * Devuelve en qué "semana del mes" está la fecha (1 a 4).
 * Los días 29, 30, 31 se agrupan dentro de la semana 4 para mantener
 * siempre exactamente 4 rituales por mes, sin importar cuántos días tenga.
 */
export function getWeekOfMonth(date: Date = new Date()): number {
  const day = date.getDate();
  return Math.min(4, Math.ceil(day / 7));
}

const MONTH_NAMES_ES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

/**
 * Devuelve el rango de días (inicio y fin) que cubre una semana del mes dada,
 * para mostrar al lado del ritual algo como "Del 8 al 14 de julio".
 */
export function getWeekOfMonthDateRange(date: Date = new Date()): string {
  const week = getWeekOfMonth(date);
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const startDay = (week - 1) * 7 + 1;
  const endDay = week === 4 ? lastDayOfMonth : week * 7;
  const monthName = MONTH_NAMES_ES[date.getMonth()];
  return `Del ${startDay} al ${endDay} de ${monthName}`;
}

const WEEKLY_STAGES = [
  {
    stage: 1,
    title: 'Semana de Intención',
    focus: 'Sembrás la intención central de este mes. Definí qué querés manifestar.',
    exercise: [
      'Elegí un lugar tranquilo y silenciá el celular unos minutos.',
      'Escribí en tu diario una sola frase: "Este mes quiero manifestar..."',
      'Debajo, anotá 3 señales concretas que te dirían que ya lo lograste.',
      'Leé la frase en voz alta y guardala donde la veas seguido esta semana.',
    ],
  },
  {
    stage: 2,
    title: 'Semana de Acción',
    focus: 'Ponés en movimiento lo que sembraste. Es momento de actuar, no solo de pensar.',
    exercise: [
      'Releé la intención que escribiste la semana pasada.',
      'Elegí UNA acción concreta que puedas hacer hoy mismo para acercarte a eso.',
      'Hacela antes de que termine el día, por pequeña que sea.',
      'Anotá en tu diario cómo te sentiste al animarte a moverte.',
    ],
  },
  {
    stage: 3,
    title: 'Semana de Integración',
    focus: 'Ajustás el rumbo y sostenés lo que ya construiste. Revisá qué está funcionando.',
    exercise: [
      'Repasá tus últimas entradas del diario de este mes.',
      'Marcá qué te costó sostener y qué te salió con más facilidad.',
      'Ajustá una sola cosa de tu rutina para la semana que viene.',
      'Agradecé el esfuerzo sostenido hasta acá, aunque no esté "terminado".',
    ],
  },
  {
    stage: 4,
    title: 'Semana de Cierre',
    focus: 'Cerrás el ciclo del mes, agradecés lo vivido y preparás el terreno para el próximo.',
    exercise: [
      'Escribí 3 cosas que lograste este mes, por pequeñas que parezcan.',
      'Escribí una cosa que quieras dejar atrás antes de que empiece el mes nuevo.',
      'Agradecé en voz alta el ciclo completo, tal como fue.',
      'Cerrá los ojos un minuto y visualizá cómo querés arrancar el próximo mes.',
    ],
  },
];

/**
 * Combina el tema mensual (ej. "Ritual de Amor Propio") con la etapa semanal
 * para dar 4 rituales distintos por mes que van rotando y cambian mes a mes.
 */
export function getWeeklyRitualStage(date: Date = new Date()) {
  const week = getWeekOfMonth(date);
  return { week, dateRange: getWeekOfMonthDateRange(date), ...WEEKLY_STAGES[week - 1] };
}

/**
 * Devuelve un enfoque energético asociado al día de la semana,
 * para combinarlo con la fase lunar en el "Ritual del día".
 */
export function getDayEnergy(date: Date = new Date()): { day: string; focus: string; emoji: string } {
  const days = [
    { day: 'Domingo', focus: 'Descanso y conexión espiritual', emoji: '🕊️' },
    { day: 'Lunes', focus: 'Nuevos comienzos e intención', emoji: '🌱' },
    { day: 'Martes', focus: 'Acción y determinación', emoji: '🔥' },
    { day: 'Miércoles', focus: 'Comunicación y claridad mental', emoji: '💬' },
    { day: 'Jueves', focus: 'Abundancia y expansión', emoji: '✨' },
    { day: 'Viernes', focus: 'Amor propio y relaciones', emoji: '💕' },
    { day: 'Sábado', focus: 'Gratitud e integración', emoji: '🙏' },
  ];
  return days[date.getDay()];
}

/**
 * Combina fase lunar + día de la semana en el ritual completo del día.
 */
export function getDailyRitual(date: Date = new Date()) {
  const moon = getMoonPhase(date);
  const dayEnergy = getDayEnergy(date);
  const weeklyStage = getWeeklyRitualStage(date);
  const specialRitual = getSpecialDateRitual(date, moon.phase);

  return {
    date: date.toISOString().split('T')[0],
    moon,
    dayEnergy,
    weeklyStage,
    specialRitual,
    combinedMessage: `${dayEnergy.emoji} ${dayEnergy.day}: ${dayEnergy.focus}. ${moon.emoji} ${moon.phaseName}: ${moon.ritualFocus}`,
  };
}

export interface SpecialRitual {
  type: 'luna_nueva' | 'luna_llena' | 'apertura_mes' | 'cierre_mes';
  emoji: string;
  title: string;
  steps: string[];
}

/**
 * Rituales especiales que aparecen SOLO el día exacto que corresponde:
 * Luna Nueva, Luna Llena, primer día del mes y último día del mes.
 * El resto de los días, esta función devuelve null y se muestra el ritual normal.
 */
function getSpecialDateRitual(date: Date, phase: MoonPhase): SpecialRitual | null {
  const day = date.getDate();
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  if (phase === 'luna_nueva') {
    return {
      type: 'luna_nueva',
      emoji: '🌑',
      title: 'Ritual de Luna Nueva: Sembrá tu intención',
      steps: [
        'Buscá un lugar tranquilo, sin pantallas alrededor.',
        'Escribí 3 a 5 deseos en tiempo presente, como si ya estuvieran pasando.',
        'Leélos en voz alta, con convicción.',
        'Cerrá los ojos 2-3 minutos y sentí la emoción de tenerlos cumplidos.',
        'Agradecé y guardá el papel hasta la próxima Luna Llena.',
      ],
    };
  }

  if (phase === 'luna_llena') {
    return {
      type: 'luna_llena',
      emoji: '🌕',
      title: 'Ritual de Luna Llena: Soltá y recibí',
      steps: [
        'Escribí en un papel todo lo que querés soltar: miedos, bloqueos, patrones viejos.',
        'Quemalo con cuidado en un recipiente seguro, visualizando que se libera.',
        'Escribí 3 deseos que querés seguir manifestando.',
        'Cerrá con una meditación breve de gratitud hacia vos misma.',
      ],
    };
  }

  if (day === 1) {
    return {
      type: 'apertura_mes',
      emoji: '🌱',
      title: 'Ritual de Apertura de Mes',
      steps: [
        'Ordená y limpiá tu espacio: entradas, ventanas, escritorio.',
        'Encendé una vela clara o dorada, si tenés.',
        'Escribí tus metas del mes: económicas, profesionales, personales.',
        'Cerrá repitiendo: "Este mes que empieza, la abundancia me acompaña."',
      ],
    };
  }

  if (day === lastDayOfMonth) {
    return {
      type: 'cierre_mes',
      emoji: '🍂',
      title: 'Ritual de Cierre de Mes',
      steps: [
        'Repasá tu diario del mes que termina.',
        'Reconocé 3 cosas que lograste, por pequeñas que sean.',
        'Escribí qué querés dejar atrás antes de que empiece el mes nuevo.',
        'Agradecé el ciclo completo.',
      ],
    };
  }

  return null;
}
