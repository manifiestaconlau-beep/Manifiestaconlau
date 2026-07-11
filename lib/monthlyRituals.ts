/**
 * Ejercicios rituales semanales, específicos para cada uno de los 12 temas
 * mensuales (Ritual de Nuevos Comienzos, Ritual de Amor Propio, etc).
 * Cada mes tiene 4 ejercicios (uno por semana), incorporando elementos
 * rituales físicos: velas, agua, sal, espejo, papel, etc.
 */

export interface WeeklyExercise {
  title: string;
  focus: string;
  exercise: string[];
}

export const MONTHLY_WEEKLY_EXERCISES: Record<number, WeeklyExercise[]> = {
  // 1 — Enero: Ritual de Nuevos Comienzos
  1: [
    {
      title: 'Semana de la Vela Blanca',
      focus: 'Sembrás la intención central del año. Un comienzo limpio necesita un símbolo claro.',
      exercise: [
        'Conseguí una vela blanca (simboliza inicio y claridad).',
        'Encendela y escribí en tu diario: "Este año elijo empezar de nuevo en..."',
        'Dejá que se consuma un rato mientras visualizás ese comienzo.',
        'Apagala con cuidado y guardala para volver a usarla la semana que viene.',
      ],
    },
    {
      title: 'Semana del Agua Renovada',
      focus: 'Ponés en movimiento lo sembrado. El agua limpia lo viejo para dar lugar a lo nuevo.',
      exercise: [
        'Llená un vaso de agua y dejalo cerca de una ventana toda la noche.',
        'A la mañana, tomá un sorbo mientras repetís: "Estoy lista para lo nuevo."',
        'Usá el resto del agua para regar una planta de tu casa.',
        'Anotá una acción concreta que vas a hacer hoy para tu comienzo.',
      ],
    },
    {
      title: 'Semana del Orden',
      focus: 'Ajustás el rumbo. Un espacio ordenado sostiene una mente ordenada.',
      exercise: [
        'Elegí un solo rincón de tu casa u oficina y ordenalo con calma.',
        'Mientras lo hacés, soltá mentalmente algo que ya no te sirve.',
        'Prendé la vela blanca de la semana 1 unos minutos al terminar.',
        'Escribí qué se siente distinto en ese espacio ahora.',
      ],
    },
    {
      title: 'Semana del Cierre de Ciclo',
      focus: 'Cerrás el mes agradeciendo el primer paso del año.',
      exercise: [
        'Volvé a prender la vela blanca por última vez este mes.',
        'Escribí 3 cosas que ya cambiaron desde que empezaste.',
        'Dejá que la vela se consuma del todo como símbolo de cierre.',
        'Agradecé en voz alta haber empezado.',
      ],
    },
  ],

  // 2 — Febrero: Ritual de Amor Propio
  2: [
    {
      title: 'Semana del Espejo',
      focus: 'Sembrás la intención de mirarte con más amor este mes.',
      exercise: [
        'Parate frente a un espejo unos minutos, sola y sin apuro.',
        'Decite en voz alta 3 cosas que valorás de vos misma.',
        'Encendé una vela rosa o roja mientras lo hacés, si tenés.',
        'Anotá en tu diario cómo te sentiste al hacerlo.',
      ],
    },
    {
      title: 'Semana del Gesto Propio',
      focus: 'Ponés en acción el amor propio con un gesto concreto.',
      exercise: [
        'Elegí un gesto de cuidado hacia vos misma para hoy (un baño largo, un rato sin pantallas, salir a caminar).',
        'Hacelo sin culpa, como si fuera una cita importante.',
        'Mientras lo hacés, repetí: "Merezco este tiempo."',
        'Escribí cómo te sentiste después.',
      ],
    },
    {
      title: 'Semana de los Límites',
      focus: 'Revisás qué vínculos te suman y cuáles te restan.',
      exercise: [
        'Pensá en una situación donde te costó poner un límite.',
        'Escribí en un papel la frase que te hubiera gustado decir.',
        'Leela en voz alta frente al espejo.',
        'Guardá el papel: no hace falta actuarlo todavía, solo animarte a nombrarlo.',
      ],
    },
    {
      title: 'Semana de la Carta de Amor',
      focus: 'Cerrás el mes con gratitud hacia vos misma.',
      exercise: [
        'Escribite una carta corta como si fueras tu mejor amiga.',
        'Encendé una vela rosa o roja mientras la escribís.',
        'Leela en voz alta al terminar.',
        'Guardala para releerla en un día difícil.',
      ],
    },
  ],

  // 3 — Marzo: Ritual de Renovación
  3: [
    {
      title: 'Semana de Soltar Papeles',
      focus: 'Sembrás renovación soltando lo que ya cumplió su ciclo.',
      exercise: [
        'Escribí en un papel algo que querés dejar atrás este mes.',
        'Quemalo con cuidado en un recipiente seguro (o rompelo si preferís no usar fuego).',
        'Visualizá que ese peso se va con el humo o los pedazos.',
        'Anotá qué querés que ocupe ese lugar vacío.',
      ],
    },
    {
      title: 'Semana del Aire Nuevo',
      focus: 'Ponés en movimiento la renovación, literal y simbólicamente.',
      exercise: [
        'Abrí bien las ventanas de tu casa un rato, aunque haga frío.',
        'Mientras entra el aire, repetí: "Dejo entrar lo nuevo."',
        'Cambiá algo pequeño de lugar en tu espacio (un mueble, un cuadro).',
        'Escribí qué te gustaría que cambie en tu rutina diaria.',
      ],
    },
    {
      title: 'Semana de la Planta',
      focus: 'Ajustás y sostenés lo que empezaste a renovar.',
      exercise: [
        'Si tenés una planta, dale un poco más de cuidado esta semana (agua, luz, una hoja seca menos).',
        'Si no tenés, es un buen momento para conseguir una chiquita.',
        'Mientras la cuidás, pensá en qué de vos también estás cuidando.',
        'Anotá en tu diario un avance chico de esta semana.',
      ],
    },
    {
      title: 'Semana del Cierre Liviano',
      focus: 'Cerrás el mes sintiendo el peso que soltaste.',
      exercise: [
        'Releé el papel que escribiste la semana 1 (si lo guardaste) o recordá qué soltaste.',
        'Escribí cómo te sentís ahora, un mes después.',
        'Agradecé el proceso, aunque no esté "terminado" del todo.',
        'Cerrá los ojos y visualizá tu próximo mes más liviano.',
      ],
    },
  ],

  // 4 — Abril: Ritual de Negocios y Propósito
  4: [
    {
      title: 'Semana del Papel de Metas',
      focus: 'Sembrás intención clara para tu negocio o propósito.',
      exercise: [
        'Escribí en una hoja 3 metas concretas para tu negocio este mes.',
        'Encendé una vela dorada o amarilla mientras las escribís, si tenés.',
        'Pegá el papel donde lo veas seguido (escritorio, agenda).',
        'Elegí cuál de las 3 vas a priorizar primero.',
      ],
    },
    {
      title: 'Semana de la Acción Incómoda',
      focus: 'Ponés en movimiento lo que da un poco de miedo pero hace falta.',
      exercise: [
        'Identificá una tarea de tu negocio que venís posponiendo.',
        'Hacé un primer paso, por chico que sea, hoy mismo.',
        'Anotá qué te frenaba y qué se sintió al animarte.',
        'Contáselo a alguien de confianza, para hacerlo más real.',
      ],
    },
    {
      title: 'Semana de Revisar Números',
      focus: 'Ajustás el rumbo con información real, no solo con intuición.',
      exercise: [
        'Mirá tus números del mes (ventas, clientas, gastos) sin juzgarte.',
        'Anotá una cosa que funcionó y una que ajustarías.',
        'Prendé una vela dorada mientras hacés este repaso.',
        'Definí un solo cambio concreto para lo que resta del mes.',
      ],
    },
    {
      title: 'Semana de la Gratitud Profesional',
      focus: 'Cerrás el mes reconociendo el camino recorrido en tu propósito.',
      exercise: [
        'Escribí 3 logros de tu negocio este mes, por pequeños que sean.',
        'Agradecé a las personas que te ayudaron en el camino.',
        'Visualizá tu propósito un paso más cerca.',
        'Guardá esta entrada para releerla en un día de dudas.',
      ],
    },
  ],

  // 5 — Mayo: Ritual de Relaciones Ideales
  5: [
    {
      title: 'Semana de Nombrar lo que Buscás',
      focus: 'Sembrás claridad sobre qué vínculos querés atraer.',
      exercise: [
        'Escribí 3 cualidades que valorás en una relación (amistad, pareja, familia).',
        'Encendé una vela rosa mientras lo hacés.',
        'Leélo en voz alta, como una intención, no una exigencia.',
        'Guardalo en un lugar especial.',
      ],
    },
    {
      title: 'Semana del Contacto Real',
      focus: 'Ponés en acción el cuidado de tus vínculos actuales.',
      exercise: [
        'Elegí una persona importante para vos y escribile o llamala hoy.',
        'Decile algo genuino que hace tiempo no le decís.',
        'Anotá cómo te sentiste al hacerlo.',
        'Repetí este gesto con otra persona más adelante en la semana.',
      ],
    },
    {
      title: 'Semana de Revisar Vínculos',
      focus: 'Ajustás mirando qué relaciones te suman y cuáles te agotan.',
      exercise: [
        'Pensá en un vínculo que te cuesta sostener.',
        'Escribí qué necesitarías que cambie ahí (sin necesidad de decírselo todavía).',
        'Prendé la vela rosa mientras reflexionás sobre esto con honestidad.',
        'Decidí un paso pequeño: hablarlo, poner distancia, o simplemente observar un poco más.',
      ],
    },
    {
      title: 'Semana de Agradecer los Vínculos',
      focus: 'Cerrás el mes agradeciendo a quienes están en tu vida.',
      exercise: [
        'Escribí una lista de personas que te sostienen.',
        'Elegí una y agradecele directamente, aunque sea con un mensaje corto.',
        'Visualizá el tipo de relaciones que querés seguir cultivando.',
        'Guardá esta entrada para volver a leerla cuando te sientas sola.',
      ],
    },
  ],

  // 6 — Junio: Ritual de Paz Interior
  6: [
    {
      title: 'Semana del Agua con Sal',
      focus: 'Sembrás calma soltando tensión acumulada.',
      exercise: [
        'Preparé un baño o pediluvio con un puñado de sal gruesa.',
        'Mientras estás en el agua, respirá profundo varias veces.',
        'Visualizá que la sal absorbe la tensión de tu cuerpo.',
        'Al salir, anotá cómo se siente tu cuerpo distinto.',
      ],
    },
    {
      title: 'Semana de la Respiración',
      focus: 'Ponés en práctica una herramienta concreta para bajar la ansiedad.',
      exercise: [
        'Elegí un momento del día para hacer 10 respiraciones lentas y profundas.',
        'Contá 4 segundos al inhalar, 4 al sostener, 6 al exhalar.',
        'Repetilo al menos 2 veces esta semana en un momento de tensión real.',
        'Anotá si notaste diferencia.',
      ],
    },
    {
      title: 'Semana de Soltar el Control',
      focus: 'Ajustás identificando qué podés soltar sin que se caiga el mundo.',
      exercise: [
        'Escribí algo que estuviste tratando de controlar sin éxito.',
        'Escribí al lado: "Esto no depende solo de mí."',
        'Prendé una vela azul o blanca mientras lo repetís en voz alta.',
        'Notá si algo se afloja en el cuerpo al decirlo.',
      ],
    },
    {
      title: 'Semana del Silencio',
      focus: 'Cerrás el mes con un espacio de quietud real.',
      exercise: [
        'Reservá 10 minutos sin celular, sin música, en silencio total.',
        'Sentate cómoda y simplemente estate ahí.',
        'Al terminar, anotá una palabra que resuma cómo te sentiste.',
        'Agradecé este mes de práctica de calma.',
      ],
    },
  ],

  // 7 — Julio: Ritual de Vitalidad
  7: [
    {
      title: 'Semana de la Vela Naranja',
      focus: 'Sembrás energía y entusiasmo renovado.',
      exercise: [
        'Encendé una vela naranja o amarilla (colores de vitalidad).',
        'Escribí: "Este mes recupero mi energía para..."',
        'Movete un poco mientras la vela está prendida (bailar, estirar, caminar).',
        'Anotá qué actividad te devolvió más energía últimamente.',
      ],
    },
    {
      title: 'Semana del Cuerpo en Movimiento',
      focus: 'Ponés el cuerpo en acción, aunque sea poco.',
      exercise: [
        'Elegí una actividad física que te guste (caminar, bailar, estirar) y hacela hoy.',
        'No importa la duración, importa la constancia.',
        'Repetila al menos 3 veces esta semana.',
        'Anotá cómo cambia tu ánimo después de moverte.',
      ],
    },
    {
      title: 'Semana del Sol',
      focus: 'Ajustás tu energía conectando con la luz natural.',
      exercise: [
        'Buscá tomar unos minutos de sol directo esta semana (sin exponerte de más).',
        'Mientras lo hacés, cerrá los ojos y sentí el calor en la piel.',
        'Repetí: "Recibo esta energía y la hago mía."',
        'Anotá si notaste más claridad después.',
      ],
    },
    {
      title: 'Semana de Celebrar el Cuerpo',
      focus: 'Cerrás el mes agradeciendo a tu cuerpo por sostenerte.',
      exercise: [
        'Escribí 3 cosas que tu cuerpo te permitió hacer este mes.',
        'Prendé la vela naranja una última vez.',
        'Agradecele a tu cuerpo en voz alta, con tus propias palabras.',
        'Guardá esta entrada como recordatorio para días de bajón físico.',
      ],
    },
  ],

  // 8 — Agosto: Ritual de Enfoque y Disciplina
  8: [
    {
      title: 'Semana del Compromiso Escrito',
      focus: 'Sembrás disciplina con un compromiso claro y visible.',
      exercise: [
        'Escribí un compromiso concreto para este mes (un hábito, una meta chica).',
        'Encendé una vela verde o marrón (colores de constancia).',
        'Pegá el compromiso en un lugar visible.',
        'Definí qué día y hora vas a sostenerlo.',
      ],
    },
    {
      title: 'Semana de la Rutina Mínima',
      focus: 'Ponés en acción el compromiso, aunque sea a mínima escala.',
      exercise: [
        'Elegí la versión más pequeña posible de tu compromiso (2 minutos alcanza).',
        'Hacela todos los días de esta semana, sin excepción.',
        'Marcá cada día que la cumpliste en tu diario.',
        'Notá si te resultó más fácil de lo que pensabas.',
      ],
    },
    {
      title: 'Semana de Revisar el Enfoque',
      focus: 'Ajustás identificando qué te distrae de tu compromiso.',
      exercise: [
        'Escribí qué te distrajo esta semana de tu meta.',
        'Elegí una sola distracción para reducir (no todas a la vez).',
        'Prendé la vela verde mientras pensás cómo hacerlo.',
        'Definí un límite concreto (horario, lugar, aviso a otros).',
      ],
    },
    {
      title: 'Semana de la Constancia Reconocida',
      focus: 'Cerrás el mes reconociendo el esfuerzo sostenido.',
      exercise: [
        'Contá cuántos días sostuviste tu compromiso este mes.',
        'Agradecete a vos misma por la disciplina, más allá del resultado.',
        'Escribí qué versión de tu compromiso querés sostener el mes que viene.',
        'Guardá esta entrada para motivarte en momentos de bajón.',
      ],
    },
  ],

  // 9 — Septiembre: Ritual de Cosecha
  9: [
    {
      title: 'Semana de Nombrar la Cosecha',
      focus: 'Sembrás reconocimiento de lo que ya lograste.',
      exercise: [
        'Escribí una lista de logros del año, aunque parezcan chicos.',
        'Encendé una vela dorada mientras la escribís.',
        'Leé la lista en voz alta, sin restarle mérito a nada.',
        'Guardala en un lugar especial.',
      ],
    },
    {
      title: 'Semana de Compartir el Logro',
      focus: 'Ponés en acción la celebración, no solo la reflexión.',
      exercise: [
        'Elegí un logro reciente y contáselo a alguien de confianza.',
        'Permitite sentir orgullo mientras lo contás, sin minimizarlo.',
        'Anotá cómo te sentiste al compartirlo.',
        'Repetí este gesto con otro logro esta semana.',
      ],
    },
    {
      title: 'Semana de Revisar el Camino',
      focus: 'Ajustás mirando qué sembraste hace tiempo y hoy está dando fruto.',
      exercise: [
        'Pensá en algo que sembraste hace meses y hoy ves resultado.',
        'Escribí qué sostuviste para que eso pasara.',
        'Prendé la vela dorada mientras reconocés ese esfuerzo.',
        'Identificá qué otra semilla de hoy podría dar fruto en unos meses.',
      ],
    },
    {
      title: 'Semana de la Gratitud por la Cosecha',
      focus: 'Cerrás el mes agradeciendo el ciclo completo de siembra y cosecha.',
      exercise: [
        'Escribí una carta corta agradeciéndote por el camino recorrido.',
        'Leela en voz alta.',
        'Visualizá qué querés seguir cosechando en los próximos meses.',
        'Guardá esta entrada como recordatorio de que el esfuerzo rinde.',
      ],
    },
  ],

  // 10 — Octubre: Ritual de Soltar
  10: [
    {
      title: 'Semana del Papel que se Suelta',
      focus: 'Sembrás la intención de soltar algo concreto.',
      exercise: [
        'Escribí en un papel algo que ya cumplió su propósito en tu vida.',
        'Quemalo con cuidado o rompelo en pedacitos.',
        'Visualizá que se va con el humo o los pedazos.',
        'Anotá qué espacio queda libre ahora.',
      ],
    },
    {
      title: 'Semana de Vaciar un Espacio',
      focus: 'Ponés en acción el soltar de forma física y concreta.',
      exercise: [
        'Elegí un cajón, placard o rincón y sacá algo que ya no usás.',
        'Donalo, regalalo o descartalo, según corresponda.',
        'Mientras lo hacés, pensá qué de vos también estás soltando.',
        'Anotá cómo se siente ese espacio más liviano.',
      ],
    },
    {
      title: 'Semana de la Sal Purificadora',
      focus: 'Ajustás limpiando la energía de tu espacio.',
      exercise: [
        'Poné un platito con sal gruesa en la entrada de tu casa unos días.',
        'Al retirarla, tirala fuera de casa (no la vuelvas a usar para comer).',
        'Mientras lo hacés, repetí: "Suelto lo que ya no es mío."',
        'Anotá si notás el espacio distinto.',
      ],
    },
    {
      title: 'Semana del Cierre Liviano',
      focus: 'Cerrás el mes sintiendo el alivio de lo soltado.',
      exercise: [
        'Releé lo que escribiste la semana 1 sobre lo que soltaste.',
        'Escribí cómo te sentís ahora, con ese peso menos.',
        'Agradecé el proceso, aunque haya sido incómodo.',
        'Visualizá tu próximo mes con ese espacio nuevo disponible.',
      ],
    },
  ],

  // 11 — Noviembre: Ritual de Introspección
  11: [
    {
      title: 'Semana de las Preguntas Honestas',
      focus: 'Sembrás la intención de mirar hacia adentro sin juzgarte.',
      exercise: [
        'Encendé una vela violeta o blanca en un ambiente tranquilo.',
        'Escribí: "Lo que más necesito ver de mí ahora es..."',
        'Dejá que la respuesta salga sin corregirla ni suavizarla.',
        'Guardala, no hace falta actuar sobre eso todavía.',
      ],
    },
    {
      title: 'Semana del Diario Profundo',
      focus: 'Ponés en práctica la escritura como herramienta de autoconocimiento.',
      exercise: [
        'Elegí 10 minutos sin interrupciones para escribir libremente.',
        'No pienses qué escribir, dejá que la mano siga sola.',
        'Al terminar, releé sin juzgar lo que salió.',
        'Subrayá una frase que te haya sorprendido.',
      ],
    },
    {
      title: 'Semana del Patrón Repetido',
      focus: 'Ajustás identificando un patrón que se repite en tu vida.',
      exercise: [
        'Pensá en una situación que se repite (en el amor, el trabajo, la familia).',
        'Escribí qué tienen en común esas veces.',
        'Prendé la vela violeta mientras lo pensás con honestidad.',
        'No busques resolverlo hoy, solo nombrarlo ya es un paso.',
      ],
    },
    {
      title: 'Semana de Integrar lo Visto',
      focus: 'Cerrás el mes integrando lo que descubriste sobre vos misma.',
      exercise: [
        'Releé tus entradas de este mes.',
        'Escribí una conclusión corta: "Este mes aprendí que yo..."',
        'Agradecete por el coraje de mirar hacia adentro.',
        'Guardá esta entrada como un mapa de vos misma.',
      ],
    },
  ],

  // 12 — Diciembre: Ritual de Cierre de Año
  12: [
    {
      title: 'Semana del Repaso del Año',
      focus: 'Sembrás la intención de cerrar el año con conciencia, no solo con velocidad.',
      exercise: [
        'Escribí los meses del año y una palabra para cada uno.',
        'Encendé una vela dorada mientras repasás el recorrido completo.',
        'Notá qué meses fueron más difíciles y cuáles más livianos.',
        'Guardá esta línea de tiempo personal.',
      ],
    },
    {
      title: 'Semana de Agradecer en Detalle',
      focus: 'Ponés en acción la gratitud concreta, no genérica.',
      exercise: [
        'Escribí 5 cosas específicas (no generales) por las que agradecés este año.',
        'Elegí una y agradecele a la persona involucrada, si corresponde.',
        'Anotá cómo te sentiste al hacerlo.',
        'Repetí con otra persona antes de fin de mes.',
      ],
    },
    {
      title: 'Semana de Soltar el Año',
      focus: 'Ajustás soltando lo que no querés llevarte al próximo ciclo.',
      exercise: [
        'Escribí en un papel algo del año que querés dejar atrás.',
        'Quemalo con cuidado o rompelo, como cierre simbólico.',
        'Prendé una vela blanca para simbolizar el espacio nuevo.',
        'Anotá qué querés que ocupe ese lugar el año que viene.',
      ],
    },
    {
      title: 'Semana de la Intención para el Año Nuevo',
      focus: 'Cerrás el ciclo sembrando ya la intención del próximo año.',
      exercise: [
        'Escribí una palabra o intención central para el año que empieza.',
        'Encendé una vela dorada mientras la repetís en voz alta.',
        'Visualizate viviendo ese próximo año desde esa intención.',
        'Guardá esta entrada para releerla el 1 de enero.',
      ],
    },
  ],
};
