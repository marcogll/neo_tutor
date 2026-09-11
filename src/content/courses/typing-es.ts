import type { Lesson } from '@/domains/lesson';

// NeoType Curriculum §8 — 10 lecciones Typing, cada una es una unidad completa con sesiones A-E
// Regla de contenido §32: nunca mostrar tecla no desbloqueada.
// Dificultad §15: 1 aislado → 5 problema no visto

function mkBlocksFlat(sessions: Lesson['sessions']): Lesson['blocks'] {
  return (sessions ?? []).flatMap((s) => s.blocks);
}

export const TYPING_ES: Lesson[] = [
  // ───────────────────────────────── TYPING 01 — Home Row derecha (j k l ñ) ─────────────────────────────────
  {
    id: 'typing-es-01',
    courseId: 'typing',
    version: 3,
    domain: 'typing',
    title: 'Home Row derecha — j k l ñ',
    description: 'Construir la primera posición estable de la mano derecha. Localizar sin mirar vía relieve físico J.',
    objectives: ['Localizar jklñ sin mirar', 'Retorno automático a home', 'Ritmo lento controlado'],
    prerequisites: [],
    skills: ['home-right'],
    targetKeys: ['KeyJ', 'KeyK', 'KeyL', 'Semicolon'],
    sessions: [
      {
        id: 'typing-es-01--A',
        title: 'Session A — Discover',
        objectives: ['Localizar relieve J', 'Asociar dedo-tecla'],
        estimatedMinutes: 6,
        blocks: [
          { id: '01-A1', type: 'position', title: 'Position — manos', instructions: 'J=índice · K=medio · L=anular · Ñ=meñique. ÁMBAR=conjunto activo · NEGRO=objetivo · PUNTO=dedo. Busca el relieve de J.', targetKeys: ['KeyJ', 'KeyK', 'KeyL', 'Semicolon'], content: ['j k l ñ'], difficulty: 1 },
          { id: '01-A2', type: 'isolation', title: 'Isolation — J', instructions: 'Sin mirar, 4 repeticiones. Solo J.', targetKeys: ['KeyJ'], content: ['jjjj'], difficulty: 1 },
          { id: '01-A3', type: 'isolation', title: 'Isolation — K', instructions: 'Solo K', targetKeys: ['KeyK'], content: ['kkkk'], difficulty: 1 },
          { id: '01-A4', type: 'isolation', title: 'Isolation — L', instructions: 'Solo L', targetKeys: ['KeyL'], content: ['llll'], difficulty: 1 },
          { id: '01-A5', type: 'isolation', title: 'Isolation — Ñ', instructions: 'Solo Ñ — meñique', targetKeys: ['Semicolon'], content: ['ññññ'], difficulty: 1 },
          { id: '01-A6', type: 'isolation', title: 'Isolation — espaciado', instructions: 'Con espacio: jj jj | kk kk | ll ll | ññ ññ', targetKeys: ['KeyJ'], content: ['jj jj jj'], difficulty: 1 },
        ],
      },
      {
        id: 'typing-es-01--B',
        title: 'Session B — Control (Pattern & Rolling)',
        objectives: ['Movimiento lateral entre dedos', 'Rolling interior/exterior'],
        estimatedMinutes: 8,
        blocks: [
          { id: '01-B1', type: 'pattern', title: 'Pattern — pares vecinos', targetKeys: ['KeyJ', 'KeyK', 'KeyL', 'Semicolon'], content: ['jk', 'kl', 'lñ', 'kj', 'lk', 'ñl'], difficulty: 2 },
          { id: '01-B2', type: 'pattern', title: 'Rolling', targetKeys: ['KeyJ', 'KeyK', 'KeyL', 'Semicolon'], content: ['jklñ', 'ñlkj', 'jkl', 'klñ', 'ñlk', 'lkj'], difficulty: 2 },
          { id: '01-B3', type: 'combination', instructions: 'Alterna distancia corta y larga sin mirar', targetKeys: ['KeyJ', 'KeyK', 'KeyL', 'Semicolon'], content: ['jklñ ñlkj', 'jk kl lñ kj lk ñl'], difficulty: 2 },
        ],
      },
      {
        id: 'typing-es-01--C',
        title: 'Session C — Control visual',
        objectives: ['Desvanecer dependencia visual'],
        estimatedMinutes: 6,
        blocks: [
          { id: '01-C1', type: 'combination', title: 'Nivel 1 — teclado completo', targetKeys: ['KeyJ', 'KeyK', 'KeyL', 'Semicolon'], content: ['jklñ jklñ', 'ñlkj ñlkj'], difficulty: 2 },
          { id: '01-C2', type: 'combination', title: 'Nivel 2 — solo dedos', instructions: 'Oculta etiquetas, solo puntos de dedo', targetKeys: ['KeyJ', 'KeyK', 'KeyL', 'Semicolon'], content: ['jklñ', 'ñlkj', 'j k l ñ'], difficulty: 3 },
          { id: '01-C3', type: 'challenge', title: 'Nivel 3 — sin teclado visual', instructions: 'Escribe sin ningún teclado en pantalla', targetKeys: ['KeyJ', 'KeyK', 'KeyL', 'Semicolon'], content: ['jklñ', 'ñlkj', 'jk lñ'], difficulty: 3 },
        ],
      },
      {
        id: 'typing-es-01--D',
        title: 'Session D — Ritmo',
        objectives: ['Intervalo regular entre pulsaciones'],
        estimatedMinutes: 6,
        blocks: [
          { id: '01-D1', type: 'pattern', title: 'Ritmo lento — metrónomo', targetKeys: ['KeyJ', 'KeyK', 'KeyL', 'Semicolon'], content: ['j k j k', 'k l k l', 'l ñ l ñ'], difficulty: 2 },
          { id: '01-D2', type: 'zen', title: 'Zen — ritmo medio', instructions: 'Sin medir WPM, solo mantener pulso', targetKeys: ['KeyJ', 'KeyK', 'KeyL', 'Semicolon'], content: ['j k l ñ j k l ñ', 'ñ l k j ñ l k j'], difficulty: 2 },
          { id: '01-D3', type: 'zen', title: 'Zen — ritmo libre', targetKeys: ['KeyJ', 'KeyK', 'KeyL', 'Semicolon'], content: ['jklñ jklñ ñlkj ñlkj'], difficulty: 3 },
        ],
      },
      {
        id: 'typing-es-01--E',
        title: 'Session E — Mastery',
        objectives: ['Demostrar dominio ≥95%'],
        estimatedMinutes: 8,
        blocks: [
          { id: '01-E1', type: 'evaluation', title: 'Evaluation 1/3', instructions: '20–30s · accuracy ≥95% · ≤3 errores críticos', targetKeys: ['KeyJ', 'KeyK', 'KeyL', 'Semicolon'], content: ['jklñ ñlkj jklñ'], difficulty: 5 },
          { id: '01-E2', type: 'evaluation', title: 'Evaluation 2/3', targetKeys: ['KeyJ', 'KeyK', 'KeyL', 'Semicolon'], content: ['j k l ñ ñ l k j'], difficulty: 5 },
          { id: '01-E3', type: 'evaluation', title: 'Evaluation 3/3 — PASS requiere 3 en sesiones diferentes', targetKeys: ['KeyJ', 'KeyK', 'KeyL', 'Semicolon'], content: ['ñlkj jklñ klñ jk'], difficulty: 5 },
        ],
      },
    ],
    get blocks(): Lesson['blocks'] { return mkBlocksFlat(this.sessions); },
    set blocks(v: Lesson['blocks']) { /* compat */ void v; },
    evaluator: { kind: 'typing', allowArrows: false },
    mastery: { minAccuracy: 0.95, minFingerAccuracy: 0.9, consecutivePasses: 3 },
    reviews: [{ afterDays: 1 }, { afterDays: 3 }, { afterDays: 7 }, { afterDays: 14 }, { afterDays: 30 }],
  },

  // ───────────────────────────────── TYPING 02 — Home Row izquierda (a s d f) ─────────────────────────────────
  {
    id: 'typing-es-02',
    courseId: 'typing',
    version: 3,
    domain: 'typing',
    title: 'Home Row izquierda — a s d f',
    description: 'Crear posición base equivalente para mano izquierda. Anclas f/j.',
    objectives: ['Posición a s d f', 'Recall mano derecha', 'Palabra mínima ala/sala'],
    prerequisites: ['typing-es-01'],
    skills: ['home-left'],
    targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF'],
    sessions: [
      {
        id: 'typing-es-02--A',
        title: 'Session A — Recall + Position',
        objectives: ['Recuperar home derecha', 'Introducir home izquierda'],
        estimatedMinutes: 6,
        blocks: [
          { id: '02-A1', type: 'recall', title: 'Recall', instructions: 'Recuperación activa sin pista: jklñ', targetKeys: ['KeyJ', 'KeyK', 'KeyL', 'Semicolon'], content: ['jklñ', 'ñlkj', 'jk kl lñ'], difficulty: 2 },
          { id: '02-A2', type: 'position', title: 'Position — izquierda', instructions: 'a=meñique · s=anular · d=medio · f=índice (ancla)', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF'], content: ['a s d f'], difficulty: 1 },
          { id: '02-A3', type: 'isolation', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF'], content: ['aaaa', 'ssss', 'dddd', 'ffff'], difficulty: 1 },
        ],
      },
      {
        id: 'typing-es-02--B',
        title: 'Session B — Pattern & Rolling',
        objectives: ['Patrones laterales', 'Rolls'],
        estimatedMinutes: 8,
        blocks: [
          { id: '02-B1', type: 'pattern', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF'], content: ['as', 'sd', 'df', 'sa', 'ds', 'fd'], difficulty: 2 },
          { id: '02-B2', type: 'pattern', title: 'Rolling', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF'], content: ['asdf', 'fdsa', 'asd', 'sdf', 'fds', 'dsa'], difficulty: 2 },
          { id: '02-B3', type: 'isolation', instructions: 'Espaciado jj jj style', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF'], content: ['aa aa aa', 'ss ss ss', 'dd dd dd', 'ff ff ff'], difficulty: 1 },
        ],
      },
      {
        id: 'typing-es-02--C',
        title: 'Session C — Combination & Application',
        objectives: ['Primeras palabras reales con ambas manos parcialmente'],
        estimatedMinutes: 8,
        blocks: [
          { id: '02-C1', type: 'combination', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyJ', 'KeyL'], content: ['ala', 'sal', 'sala', 'falda', 'ajada'], difficulty: 3 },
          { id: '02-C2', type: 'application', title: 'Application — palabras', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyJ', 'KeyL'], content: ['ala sal', 'sala falda', 'las ja ja'], difficulty: 3 },
          { id: '02-C3', type: 'challenge', title: 'Challenge — sin teclado visual', instructions: 'Escribe sin pista visual', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF'], content: ['asdf fdsa', 'a s d f'], difficulty: 3 },
        ],
      },
      {
        id: 'typing-es-02--D',
        title: 'Session D — Zen + Control visual',
        objectives: ['30s continuos sin métricas visibles'],
        estimatedMinutes: 6,
        blocks: [
          { id: '02-D1', type: 'zen', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon'], content: ['asdf jklñ asdf jklñ', 'a s d f j k l ñ'], difficulty: 3 },
          { id: '02-D2', type: 'combination', title: 'Sin teclado visual', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF'], content: ['asdf fdsa asdf'], difficulty: 3 },
        ],
      },
      {
        id: 'typing-es-02--E',
        title: 'Session E — Mastery',
        objectives: ['3 PASS ≥95%'],
        estimatedMinutes: 8,
        blocks: [
          { id: '02-E1', type: 'evaluation', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF'], content: ['asdf fdsa asdf'], difficulty: 5 },
          { id: '02-E2', type: 'evaluation', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyL'], content: ['sala falda ala sal'], difficulty: 5 },
          { id: '02-E3', type: 'evaluation', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF'], content: ['a s d f j k l ñ — evaluación final'], difficulty: 5 },
        ],
      },
    ],
    get blocks(): Lesson['blocks'] { return mkBlocksFlat(this.sessions); },
    set blocks(v: Lesson['blocks']) { void v; },
    evaluator: { kind: 'typing', allowArrows: false },
    mastery: { minAccuracy: 0.95, minFingerAccuracy: 0.9, consecutivePasses: 3 },
    reviews: [{ afterDays: 1 }, { afterDays: 3 }, { afterDays: 7 }],
  },

  // ───────────────────────────────── TYPING 03 — Coordinación manos ─────────────────────────────────
  {
    id: 'typing-es-03',
    courseId: 'typing',
    version: 3,
    domain: 'typing',
    title: 'Coordinación de manos — a s d f · j k l ñ',
    description: 'Conectar ambas manos. Alternancia, cruces y palabras.',
    objectives: ['Alternancia rítmica', 'Rolls interior/exterior', 'Palabras con teclado limitado'],
    prerequisites: ['typing-es-02'],
    skills: ['both-hands'],
    targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon'],
    sessions: [
      {
        id: 'typing-es-03--A',
        title: 'Session A — Recall',
        objectives: ['Recuperar ambas homes'],
        estimatedMinutes: 5,
        blocks: [
          { id: '03-A1', type: 'recall', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF'], content: ['asdf fdsa', 'as sd df'], difficulty: 2 },
          { id: '03-A2', type: 'recall', targetKeys: ['KeyJ', 'KeyK', 'KeyL', 'Semicolon'], content: ['jklñ ñlkj', 'jk kl lñ'], difficulty: 2 },
          { id: '03-A3', type: 'combination', instructions: 'Recall cruzado: ambas manos sin pista', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon'], content: ['asdf jklñ', 'fdsa ñlkj'], difficulty: 3 },
        ],
      },
      {
        id: 'typing-es-03--B',
        title: 'Session B — Alternancia',
        objectives: ['Alternar manos sin mirar'],
        estimatedMinutes: 8,
        blocks: [
          { id: '03-B1', type: 'pattern', title: 'Alternancia básica', targetKeys: ['KeyF', 'KeyJ', 'KeyD', 'KeyK', 'KeyS', 'KeyL', 'KeyA', 'Semicolon'], content: ['fj', 'dk', 'sl', 'añ', 'fj dk sl añ'], difficulty: 2 },
          { id: '03-B2', type: 'pattern', title: 'Alternancia doble', targetKeys: ['KeyF', 'KeyJ', 'KeyD', 'KeyK', 'KeyS', 'KeyL', 'Semicolon'], content: ['fjfj', 'dkdk', 'slsl', 'añañ'], difficulty: 2 },
          { id: '03-B3', type: 'pattern', title: 'Cruces', targetKeys: ['KeyF', 'KeyA', 'KeyD', 'KeyJ', 'KeyS', 'KeyK', 'KeyL'], content: ['fa', 'dj', 'sk', 'al', 'fa dj sk al'], difficulty: 2 },
        ],
      },
      {
        id: 'typing-es-03--C',
        title: 'Session C — Rolls & Words',
        objectives: ['Fluidez hacia centro y afuera'],
        estimatedMinutes: 10,
        blocks: [
          { id: '03-C1', type: 'pattern', title: 'Rolls internos', targetKeys: ['KeyS', 'KeyD', 'KeyF', 'KeyJ', 'KeyK', 'KeyL'], content: ['sdf', 'jkl', 'sdf jkl'], difficulty: 2 },
          { id: '03-C2', type: 'pattern', title: 'Rolls externos', targetKeys: ['KeyF', 'KeyD', 'KeyS', 'KeyL', 'KeyK', 'KeyJ'], content: ['fds', 'lkj', 'fds lkj'], difficulty: 2 },
          { id: '03-C3', type: 'combination', title: 'Words', targetKeys: ['KeyA', 'KeyL', 'KeyS', 'KeyF', 'KeyD', 'KeyJ'], content: ['ala', 'sala', 'falda', 'ajada', 'sal'], difficulty: 3 },
          { id: '03-C4', type: 'application', title: 'Application — frases mínimas', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon'], content: ['ala sal', 'la sala es lala'], difficulty: 3 },
        ],
      },
      {
        id: 'typing-es-03--D',
        title: 'Session D — Zen',
        objectives: ['30–60s continuos'],
        estimatedMinutes: 8,
        blocks: [
          { id: '03-D1', type: 'zen', title: 'Zen 30s', instructions: 'Sin WPM visible · sin interrupción por error', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon'], content: ['asdf jklñ asdf jklñ', 'ala sal falda ajada'], difficulty: 3 },
          { id: '03-D2', type: 'zen', title: 'Zen 60s', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon'], content: ['la sala es la jaula del ala'], difficulty: 4 },
        ],
      },
      {
        id: 'typing-es-03--E',
        title: 'Session E — Mastery',
        objectives: ['Combina repetición + alternancia + rolls + palabras'],
        estimatedMinutes: 8,
        blocks: [
          { id: '03-E1', type: 'evaluation', targetKeys: ['KeyF', 'KeyJ', 'KeyD', 'KeyK', 'KeyS', 'KeyL', 'KeyA', 'Semicolon'], content: ['fj dk sl añ fjfj dkdk'], difficulty: 5 },
          { id: '03-E2', type: 'evaluation', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon'], content: ['sala falda al la sal'], difficulty: 5 },
          { id: '03-E3', type: 'evaluation', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon'], content: ['asdf jklñ fj dk sl añ'], difficulty: 5 },
        ],
      },
    ],
    get blocks(): Lesson['blocks'] { return mkBlocksFlat(this.sessions); },
    set blocks(v: Lesson['blocks']) { void v; },
    evaluator: { kind: 'typing', allowArrows: false },
    mastery: { minAccuracy: 0.95, consecutivePasses: 3 },
    reviews: [{ afterDays: 1 }, { afterDays: 3 }, { afterDays: 7 }],
  },

  // ───────────────────────────────── TYPING 04 — Fila superior izq (q w e r t) ─────────────────────────────────
  {
    id: 'typing-es-04',
    courseId: 'typing',
    version: 3,
    domain: 'typing',
    title: 'Fila superior izquierda — q w e r t',
    description: 'Alcance vertical sin desplazar mano. Distinguir R/T.',
    objectives: ['Movimiento vertical a↔q', 'Roll qwert', 'Palabras arte/fresa'],
    prerequisites: ['typing-es-03'],
    skills: ['top-left'],
    targetKeys: ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT'],
    sessions: [
      {
        id: 'typing-es-04--A',
        title: 'Session A — Recall + Position vertical',
        objectives: ['Recuperar home', 'Mapear vertical'],
        estimatedMinutes: 6,
        blocks: [
          { id: '04-A1', type: 'recall', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyJ', 'KeyK'], content: ['asdf', 'fj dk', 'sala falda'], difficulty: 2 },
          { id: '04-A2', type: 'concept', title: 'Concept — vertical', instructions: 'A↔Q · S↔W · D↔E · F↔R · F↔T. Mismo dedo, muñeca fija, solo extiende.', targetKeys: ['KeyA', 'KeyQ', 'KeyS', 'KeyW', 'KeyD', 'KeyE', 'KeyF', 'KeyR', 'KeyT'], content: ['aq sw de fr ft'], difficulty: 1 },
          { id: '04-A3', type: 'position', targetKeys: ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT'], content: ['q w e r t'], difficulty: 1 },
        ],
      },
      {
        id: 'typing-es-04--B',
        title: 'Session B — Isolation & Vertical pairs',
        objectives: ['Fuerza dedo', 'Ida y vuelta'],
        estimatedMinutes: 10,
        blocks: [
          { id: '04-B1', type: 'isolation', targetKeys: ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT'], content: ['qqqq', 'wwww', 'eeee', 'rrrr', 'tttt'], difficulty: 1 },
          { id: '04-B2', type: 'pattern', title: 'Vertical pairs', targetKeys: ['KeyA', 'KeyQ', 'KeyS', 'KeyW', 'KeyD', 'KeyE', 'KeyF', 'KeyR', 'KeyT'], content: ['aq', 'sw', 'de', 'fr', 'ft'], difficulty: 2 },
          { id: '04-B3', type: 'pattern', title: 'Reverse', targetKeys: ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT'], content: ['qa', 'ws', 'ed', 'rf', 'tf'], difficulty: 2 },
        ],
      },
      {
        id: 'typing-es-04--C',
        title: 'Session C — Patterns & Words',
        objectives: ['Rolls superiores', 'Vocabulario controlado'],
        estimatedMinutes: 10,
        blocks: [
          { id: '04-C1', type: 'pattern', targetKeys: ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT'], content: ['qwer', 'wert', 'erty', 'trew', 'rewq'], difficulty: 2 },
          { id: '04-C2', type: 'combination', targetKeys: ['KeyD', 'KeyA', 'KeyR', 'KeyS', 'KeyE', 'KeyT'], content: ['dar', 'ser', 'red', 'arte', 'tarde', 'fresa'], difficulty: 3 },
          { id: '04-C3', type: 'challenge', title: 'Motor Challenge R/T', instructions: 'Distingue R y T sin mover toda la mano. Solo índice se desplaza.', targetKeys: ['KeyR', 'KeyT', 'KeyF'], content: ['fr ft rf tf', 'fresa arte tarde'], difficulty: 3 },
        ],
      },
      {
        id: 'typing-es-04--D',
        title: 'Session D — Zen & Application',
        objectives: ['Frases limitadas a teclas conocidas'],
        estimatedMinutes: 6,
        blocks: [
          { id: '04-D1', type: 'zen', targetKeys: ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyA', 'KeyS', 'KeyD', 'KeyF'], content: ['que tal tarde', 'arte ser dar'], difficulty: 3 },
        ],
      },
      {
        id: 'typing-es-04--E',
        title: 'Session E — Mastery',
        objectives: ['Texto real con qwert'],
        estimatedMinutes: 6,
        blocks: [
          { id: '04-E1', type: 'evaluation', targetKeys: ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT'], content: ['que tal qwert arte tarda'], difficulty: 5 },
          { id: '04-E2', type: 'evaluation', targetKeys: ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyA', 'KeyS'], content: ['fresa que tarde sera'], difficulty: 5 },
        ],
      },
    ],
    get blocks(): Lesson['blocks'] { return mkBlocksFlat(this.sessions); },
    set blocks(v: Lesson['blocks']) { void v; },
    evaluator: { kind: 'typing' },
    mastery: { minAccuracy: 0.95, consecutivePasses: 3 },
    reviews: [{ afterDays: 1 }, { afterDays: 7 }],
  },

  // ───────────────────────────────── TYPING 05 — Fila superior derecha (y u i o p) ─────────────────────────────────
  {
    id: 'typing-es-05',
    courseId: 'typing',
    version: 3,
    domain: 'typing',
    title: 'Fila superior derecha — y u i o p',
    description: 'Mano derecha superior + vocabulario amplio.',
    objectives: ['Vertical J↔Y/U etc', 'Frase real sin mirar'],
    prerequisites: ['typing-es-04'],
    skills: ['top-right'],
    targetKeys: ['KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP'],
    sessions: [
      {
        id: 'typing-es-05--A',
        title: 'Session A — Recall + Position vertical derecha',
        objectives: ['Recall qwert', 'Mapear J↔Y/U · K↔I · L↔O · Ñ↔P'],
        estimatedMinutes: 7,
        blocks: [
          { id: '05-A0', type: 'recall', title: 'Recall — qwert', instructions: 'Recupera sin pista: qwer', targetKeys: ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT'], content: ['qwer', 'wert'], difficulty: 2 },
          { id: '05-A1', type: 'position', targetKeys: ['KeyJ', 'KeyY', 'KeyU', 'KeyK', 'KeyI', 'KeyL', 'KeyO', 'Semicolon', 'KeyP'], content: ['j y u k i l o ñ p'], difficulty: 1 },
          { id: '05-A2', type: 'isolation', targetKeys: ['KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP'], content: ['yyyy', 'uuuu', 'iiii', 'oooo', 'pppp'], difficulty: 1 },
        ],
      },
      {
        id: 'typing-es-05--B',
        title: 'Session B — Vertical patterns',
        objectives: ['Pares verticales derechos'],
        estimatedMinutes: 8,
        blocks: [
          { id: '05-B1', type: 'pattern', targetKeys: ['KeyJ', 'KeyY', 'KeyU', 'KeyK', 'KeyI', 'KeyL', 'KeyO', 'Semicolon', 'KeyP'], content: ['jy', 'ju', 'ki', 'lo', 'ñp'], difficulty: 2 },
          { id: '05-B2', type: 'pattern', title: 'Full upper row', targetKeys: ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP'], content: ['qwert', 'yuiop', 'qwerty', 'yuiop'], difficulty: 3 },
        ],
      },
      {
        id: 'typing-es-05--C',
        title: 'Session C — Words & Phrases',
        objectives: ['Vocabulario notable'],
        estimatedMinutes: 10,
        blocks: [
          { id: '05-C1', type: 'combination', targetKeys: ['KeyT', 'KeyI', 'KeyP', 'KeyO', 'KeyU', 'KeyE', 'KeyR', 'KeyA'], content: ['tipo', 'puerta', 'teoria', 'salir', 'teclado', 'usuario', 'archivo', 'editor'], difficulty: 3 },
          { id: '05-C2', type: 'application', targetKeys: ['KeyE', 'KeyL', 'KeyD', 'KeyI', 'KeyT', 'KeyO', 'KeyR'], content: ['el editor puede leer archivos', 'quiero practicar sin mirar'], difficulty: 4 },
          { id: '05-C3', type: 'zen', targetKeys: ['KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'KeyT', 'KeyE'], content: ['yo quiero tipo puro'], difficulty: 3 },
        ],
      },
      {
        id: 'typing-es-05--D',
        title: 'Session D — Mastery',
        objectives: ['Texto real con yuiop'],
        estimatedMinutes: 6,
        blocks: [
          { id: '05-D1', type: 'evaluation', targetKeys: ['KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP'], content: ['puyo tuyo pio tipo puerta'], difficulty: 5 },
          { id: '05-D2', type: 'evaluation', targetKeys: ['KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT'], content: ['el editor puede leer y quiero practicar'], difficulty: 5 },
        ],
      },
    ],
    get blocks(): Lesson['blocks'] { return mkBlocksFlat(this.sessions); },
    set blocks(v: Lesson['blocks']) { void v; },
    evaluator: { kind: 'typing' },
    mastery: { minAccuracy: 0.95, consecutivePasses: 3 },
  },

  // ───────────────────────────────── TYPING 06 — Fila inferior ─────────────────────────────────
  {
    id: 'typing-es-06',
    courseId: 'typing',
    version: 3,
    domain: 'typing',
    title: 'Fila inferior — z x c v b n m , .',
    description: 'Saltos de fila sin desplazar mano. Tres filas.',
    objectives: ['Vertical A↔Z', 'Three-row fr/fv', 'Frase vim/linux'],
    prerequisites: ['typing-es-05'],
    skills: ['bottom-row'],
    targetKeys: ['KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period'],
    sessions: [
      {
        id: 'typing-es-06--A',
        title: 'Session A — Position inferior + Review',
        objectives: ['Mapa inferior completo', 'Recall top row'],
        estimatedMinutes: 8,
        blocks: [
          { id: '06-A0', type: 'review', title: 'Review — top row', instructions: 'Recuperación espaciada: qwert yuiop (sin pista inicial)', targetKeys: ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP'], content: ['qwert', 'yuiop', 'qwerty'], difficulty: 3 },
          { id: '06-A1', type: 'isolation', targetKeys: ['KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period'], content: ['zzzz', 'xxxx', 'cccc', 'vvvv', 'bbbb', 'nnnn', 'mmmm', ',,,,', '....'], difficulty: 1 },
          { id: '06-A2', type: 'pattern', title: 'Vertical left', targetKeys: ['KeyA', 'KeyZ', 'KeyS', 'KeyX', 'KeyD', 'KeyC', 'KeyF', 'KeyV', 'KeyB'], content: ['az', 'sx', 'dc', 'fv', 'fb'], difficulty: 2 },
          { id: '06-A3', type: 'pattern', title: 'Vertical right', targetKeys: ['KeyJ', 'KeyN', 'KeyM', 'KeyK', 'KeyL', 'Comma', 'Semicolon', 'Period'], content: ['jn', 'jm', 'km', 'l,', 'ñ.'], difficulty: 2 },
        ],
      },
      {
        id: 'typing-es-06--B',
        title: 'Session B — Patterns & Three-row',
        objectives: ['Patrones inferiores', 'Salto 3 filas'],
        estimatedMinutes: 10,
        blocks: [
          { id: '06-B1', type: 'pattern', targetKeys: ['KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period'], content: ['zxcv', 'cvbn', 'bnm', 'nm,.'], difficulty: 2 },
          { id: '06-B2', type: 'pattern', title: 'Three-row movement', targetKeys: ['KeyF', 'KeyR', 'KeyV', 'KeyD', 'KeyE', 'KeyC', 'KeyS', 'KeyW', 'KeyX', 'KeyJ', 'KeyU', 'KeyN', 'KeyK', 'KeyI', 'KeyM', 'KeyL', 'KeyO', 'Comma'], content: ['fr fv', 'de dc', 'sw sx', 'ju jn', 'ki km', 'lo l,'], difficulty: 3 },
        ],
      },
      {
        id: 'typing-es-06--C',
        title: 'Session C — Words & Sentences',
        objectives: ['Vocab técnico'],
        estimatedMinutes: 10,
        blocks: [
          { id: '06-C1', type: 'combination', targetKeys: ['KeyZ', 'KeyO', 'KeyN', 'KeyA', 'KeyC', 'KeyM', 'KeyI', 'KeyV'], content: ['zona', 'casa', 'camino', 'mismo', 'linux', 'codigo', 'vim'], difficulty: 3 },
          { id: '06-C2', type: 'application', targetKeys: ['KeyV', 'KeyI', 'KeyM', 'KeyC', 'KeyA', 'KeyD'], content: ['vim cambia mi forma de editar codigo.'], difficulty: 4 },
          { id: '06-C3', type: 'zen', targetKeys: ['KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period'], content: ['zona vim casa camino mismo'], difficulty: 3 },
        ],
      },
      {
        id: 'typing-es-06--D',
        title: 'Session D — Mastery',
        objectives: ['Evaluación inferior'],
        estimatedMinutes: 6,
        blocks: [
          { id: '06-D1', type: 'evaluation', targetKeys: ['KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM'], content: ['zxcv bnm vez casa vim'], difficulty: 5 },
        ],
      },
    ],
    get blocks(): Lesson['blocks'] { return mkBlocksFlat(this.sessions); },
    set blocks(v: Lesson['blocks']) { void v; },
    evaluator: { kind: 'typing' },
    mastery: { minAccuracy: 0.95, consecutivePasses: 3 },
  },

  // ───────────────────────────────── TYPING 07 — Fluidez alfabética ─────────────────────────────────
  {
    id: 'typing-es-07',
    courseId: 'typing',
    version: 3,
    domain: 'typing',
    title: 'Fluidez alfabética',
    description: 'Sin teclas nuevas — convertir movimientos en escritura continua. Lección más larga.',
    objectives: ['Same finger', 'Alternancia', 'Bigramas/trigramas', 'Párrafos 300 chars'],
    prerequisites: ['typing-es-06'],
    skills: ['fluency-alpha'],
    targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM'],
    sessions: [
      {
        id: 'typing-es-07--A',
        title: 'Session A — Review + Same finger & Alternancia',
        objectives: ['Review bottom row', 'Transición mismo dedo', 'Ritmo entre manos'],
        estimatedMinutes: 10,
        blocks: [
          { id: '07-A0', type: 'review', title: 'Review — bottom row & symbols', instructions: 'Recuperación espaciada: zxcv bnm ,. (vencida +3 días)', targetKeys: ['KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM'], content: ['zxcv', 'bnm', 'az sx dc fv'], difficulty: 3 },
          { id: '07-A1', type: 'recall', instructions: 'Sin pista: fr ju de ki', targetKeys: ['KeyF', 'KeyR', 'KeyJ', 'KeyU'], content: ['fr', 'rf', 'fv', 'vf', 'ju', 'uj', 'jm', 'mj'], difficulty: 2 },
          { id: '07-A2', type: 'pattern', title: 'Same finger transitions', targetKeys: ['KeyF', 'KeyR', 'KeyV', 'KeyJ', 'KeyU', 'KeyN', 'KeyM', 'KeyI', 'KeyK'], content: ['fr', 'rf', 'fv', 'vf', 'ju', 'uj', 'jm', 'mj'], difficulty: 2 },
          { id: '07-A3', type: 'pattern', title: 'Alternancia', targetKeys: ['KeyF', 'KeyA', 'KeyJ', 'KeyO', 'KeyT', 'KeyE', 'KeyN', 'KeyI', 'KeyR', 'KeyM'], content: ['fa', 'jo', 'te', 'ni', 'ra', 'mi'], difficulty: 2 },
        ],
      },
      {
        id: 'typing-es-07--B',
        title: 'Session B — Rolls',
        objectives: ['Interior vs exterior'],
        estimatedMinutes: 8,
        blocks: [
          { id: '07-B1', type: 'pattern', title: 'Interior rolls', targetKeys: ['KeyS', 'KeyD', 'KeyF', 'KeyJ', 'KeyK', 'KeyL', 'KeyW', 'KeyE', 'KeyR', 'KeyU', 'KeyI', 'KeyO'], content: ['sdf', 'jkl', 'wer', 'uio'], difficulty: 2 },
          { id: '07-B2', type: 'pattern', title: 'Exterior rolls', targetKeys: ['KeyF', 'KeyD', 'KeyS', 'KeyL', 'KeyK', 'KeyJ', 'KeyR', 'KeyE', 'KeyW'], content: ['fds', 'lkj', 'rew', 'oiu'], difficulty: 2 },
        ],
      },
      {
        id: 'typing-es-07--C',
        title: 'Session C — Bigramas & Trigramas',
        objectives: ['Automatizar idioma español'],
        estimatedMinutes: 10,
        blocks: [
          { id: '07-C1', type: 'pattern', title: 'Bigramas comunes', targetKeys: ['KeyD', 'KeyE', 'KeyL', 'KeyA', 'KeyN', 'KeyS', 'KeyQ', 'KeyU', 'KeyP', 'KeyO', 'KeyC'], content: ['de', 'la', 'el', 'en', 'es', 'que', 'un', 'por', 'con'], difficulty: 3 },
          { id: '07-C2', type: 'pattern', title: 'Trigramas', targetKeys: ['KeyQ', 'KeyU', 'KeyE', 'KeyN', 'KeyT', 'KeyS', 'KeyL', 'KeyO', 'KeyD', 'KeyP', 'KeyR'], content: ['que', 'ent', 'est', 'los', 'del', 'por'], difficulty: 3 },
        ],
      },
      {
        id: 'typing-es-07--D',
        title: 'Session D — Palabras & Frases',
        objectives: ['50–100 palabras frecuentes', 'Frases crecientes'],
        estimatedMinutes: 12,
        blocks: [
          { id: '07-D1', type: 'combination', targetKeys: ['KeyD', 'KeyE', 'KeyL', 'KeyA', 'KeyC', 'KeyS', 'KeyN', 'KeyP', 'KeyR', 'KeyO'], content: ['de la casa en la sala por con todo', 'que del los esta para'], difficulty: 3 },
          { id: '07-D2', type: 'application', title: 'Frases', targetKeys: ['KeyE', 'KeyL', 'KeyD', 'KeyI', 'KeyT', 'KeyO', 'KeyR'], content: ['El editor abre el archivo.', 'La practica precisa mejora el control del teclado.'], difficulty: 4 },
        ],
      },
      {
        id: 'typing-es-07--E',
        title: 'Session E — Párrafos + Zen + Mastery',
        objectives: ['80→300 chars', 'Texto no visto'],
        estimatedMinutes: 15,
        blocks: [
          { id: '07-E1', type: 'application', title: 'Párrafos 80–150', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyJ', 'KeyK'], content: ['El teclado responde a la memoria muscular y la practica diaria sostiene el ritmo.'], difficulty: 4 },
          { id: '07-E2', type: 'application', title: 'Párrafos 150–300', targetKeys: ['KeyA', 'KeyS', 'KeyD'], content: ['La fluidez no se compra con velocidad. Se construye con repeticion precisa, alternancia regular y retorno a home sin mirar.'], difficulty: 4 },
          { id: '07-E3', type: 'zen', title: 'Zen 60s', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon'], content: ['la casa es azul y la sala es fina'], difficulty: 4 },
          { id: '07-E4', type: 'zen', title: 'Zen 120s', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon'], content: ['El editor abre el archivo y la practica precisa mejora el control del teclado.'], difficulty: 4 },
          { id: '07-E5', type: 'evaluation', title: 'Mastery — texto nunca visto', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon'], content: ['la sala es la jaula del alma y el ritmo construye velocidad'], difficulty: 5 },
          { id: '07-E6', type: 'evaluation', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyJ'], content: ['evaluacion fluidez alfabética sin palabras repetidas'], difficulty: 5 },
        ],
      },
    ],
    get blocks(): Lesson['blocks'] { return mkBlocksFlat(this.sessions); },
    set blocks(v: Lesson['blocks']) { void v; },
    evaluator: { kind: 'typing' },
    mastery: { minAccuracy: 0.95, consecutivePasses: 3 },
    reviews: [{ afterDays: 3 }, { afterDays: 7 }, { afterDays: 14 }],
  },

  // ───────────────────────────────── TYPING 08 — Shift, mayúsculas y números ─────────────────────────────────
  {
    id: 'typing-es-08',
    courseId: 'typing',
    version: 3,
    domain: 'typing',
    title: 'Shift, mayúsculas y números',
    description: 'Módulos separados: Shift opuesto, frases, números y datos reales.',
    objectives: ['Shift mano opuesta', 'Números', 'IP/puertos'],
    prerequisites: ['typing-es-07'],
    skills: ['shift-numbers'],
    targetKeys: ['ShiftLeft', 'ShiftRight', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0'],
    sessions: [
      {
        id: 'typing-es-08--A',
        title: 'Session A — Review + Módulo Shift',
        objectives: ['Review fluidez alfabética', 'Regla mano opuesta'],
        estimatedMinutes: 9,
        blocks: [
          { id: '08-A0', type: 'review', title: 'Review — fluidez', instructions: 'Recupera bigramas de/ la el en sin pista', targetKeys: ['KeyD', 'KeyE', 'KeyL', 'KeyA'], content: ['de la el en', 'que por con'], difficulty: 3 },
          { id: '08-A1', type: 'concept', title: 'Concept — Shift', instructions: 'Letra derecha → Shift izquierdo · Letra izquierda → Shift derecho.', targetKeys: ['ShiftLeft', 'ShiftRight'], content: ['Aa Ss Dd Ff'], difficulty: 1 },
          { id: '08-A2', type: 'isolation', targetKeys: ['ShiftLeft', 'ShiftRight'], content: ['Marco', 'Linux', 'Python', 'NeoType', 'Docker', 'GitHub'], difficulty: 2 },
        ],
      },
      {
        id: 'typing-es-08--B',
        title: 'Session B — Frases con mayúsculas',
        objectives: ['Frase técnica'],
        estimatedMinutes: 6,
        blocks: [
          { id: '08-B1', type: 'application', targetKeys: ['ShiftLeft', 'ShiftRight'], content: ['Python funciona en Linux.', 'NeoType utiliza React.'], difficulty: 3 },
        ],
      },
      {
        id: 'typing-es-08--C',
        title: 'Session C — Números',
        objectives: ['Teclado numérico superior'],
        estimatedMinutes: 10,
        blocks: [
          { id: '08-C1', type: 'position', targetKeys: ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0'], content: ['1 2 3 4 5', '6 7 8 9 0'], difficulty: 1 },
          { id: '08-C2', type: 'isolation', targetKeys: ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0'], content: ['111', '222', '333', '444', '555'], difficulty: 1 },
          { id: '08-C3', type: 'pattern', targetKeys: ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0'], content: ['12345', '67890', '09876', '54321'], difficulty: 2 },
        ],
      },
      {
        id: 'typing-es-08--D',
        title: 'Session D — Datos reales & Application',
        objectives: ['IPs y puertos'],
        estimatedMinutes: 10,
        blocks: [
          { id: '08-D1', type: 'application', targetKeys: ['Digit1', 'Digit2', 'Digit6', 'Digit0', 'Period', 'Digit8', 'Digit3'], content: ['2026', '192.168.1.1', '10.10.0.130', '8080', '5173', '3000'], difficulty: 3 },
          { id: '08-D2', type: 'application', targetKeys: ['Digit1', 'Digit0', 'Period', 'Digit8', 'Digit3'], content: ['Server 10.10.0.130:8080'], difficulty: 4 },
          { id: '08-D3', type: 'evaluation', targetKeys: ['ShiftLeft', 'Digit1', 'Digit0', 'Period', 'Digit8'], content: ['Server 10.10.0.130:8080 Python 2026'], difficulty: 5 },
        ],
      },
    ],
    get blocks(): Lesson['blocks'] { return mkBlocksFlat(this.sessions); },
    set blocks(v: Lesson['blocks']) { void v; },
    evaluator: { kind: 'typing' },
    mastery: { minAccuracy: 0.92, consecutivePasses: 2 },
  },

  // ───────────────────────────────── TYPING 09 — Símbolos programación ─────────────────────────────────
  {
    id: 'typing-es-09',
    courseId: 'typing',
    version: 3,
    domain: 'typing',
    title: 'Símbolos de programación — () [] {} \'\"` + - * / = , . : ; / \\ |',
    description: 'Lección extensa — grupos progresivos. No todos juntos.',
    objectives: ['Delimitadores', 'Quotes', 'Operadores', 'Terminal', 'Código Python/Go'],
    prerequisites: ['typing-es-08'],
    skills: ['symbols'],
    targetKeys: ['Digit9', 'Digit0', 'BracketLeft', 'BracketRight', 'BraceLeft', 'BraceRight', 'Quote', 'Backquote', 'Equal', 'Minus', 'Slash', 'Comma', 'Period', 'Semicolon', 'IntlBackslash', 'Backslash'],
    sessions: [
      {
        id: 'typing-es-09--A',
        title: 'Session A — Review + Grupo A Delimitadores + Grupo B Quotes',
        objectives: ['Recall spaced: asdf jklñ fr ju 1234', '() [] {} <> · \' " `'],
        estimatedMinutes: 10,
        blocks: [
          { id: '09-A0', type: 'review', title: 'Review — spaced', instructions: 'Antes de símbolos, recupera: asdf jklñ · fr ju · 1234 (ejemplo spec §6)', targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'KeyR', 'KeyU', 'Digit1', 'Digit2'], content: ['asdf jklñ', 'fr ju', '1234'], difficulty: 3 },
          { id: '09-A1', type: 'isolation', title: 'Delimitadores', targetKeys: ['Digit9', 'Digit0', 'BracketLeft', 'BracketRight'], content: ['()', '()()', '[]', '[][]', '{}', '{}{}'], difficulty: 1 },
          { id: '09-A2', type: 'isolation', title: 'Quotes', targetKeys: ['Quote', 'Backquote'], content: ["''", '""', '``'], difficulty: 1 },
          { id: '09-A3', type: 'application', targetKeys: ['Quote', 'Backquote'], content: ['"hello"', "'name'", '`command`'], difficulty: 2 },
        ],
      },
      {
        id: 'typing-es-09--B',
        title: 'Session B — Grupo C Operators + Grupo D Separadores',
        objectives: ['+ - * / = == != >= <= · , . : ;'],
        estimatedMinutes: 10,
        blocks: [
          { id: '09-B1', type: 'isolation', targetKeys: ['Equal', 'Minus', 'Slash'], content: ['+', '-', '*', '/', '='], difficulty: 1 },
          { id: '09-B2', type: 'pattern', targetKeys: ['Equal', 'Minus'], content: ['==', '!=', '>=', '<=', '+=', '-='], difficulty: 2 },
          { id: '09-B3', type: 'isolation', targetKeys: ['Comma', 'Period', 'Semicolon'], content: [',', '.', ':', ';'], difficulty: 1 },
        ],
      },
      {
        id: 'typing-es-09--C',
        title: 'Session C — Grupo E Terminal',
        objectives: ['/ \\ | > < ~ _ -'],
        estimatedMinutes: 8,
        blocks: [
          { id: '09-C1', type: 'application', targetKeys: ['Slash', 'Backslash', 'IntlBackslash'], content: ['cd /home/user', 'docker ps | grep app'], difficulty: 3 },
          { id: '09-C2', type: 'pattern', targetKeys: ['Slash', 'Minus'], content: ['/', '\\', '|', '>', '<', '~', '_', '-'], difficulty: 2 },
        ],
      },
      {
        id: 'typing-es-09--D',
        title: 'Session D — Grupo F Código Python + G Go',
        objectives: ['Transcribir código real'],
        estimatedMinutes: 12,
        blocks: [
          { id: '09-D1', type: 'application', title: 'Código Python', targetKeys: ['Equal', 'Quote', 'Semicolon'], content: ['name = "NeoType"', 'if name != "":', '    print(name)'], difficulty: 4 },
          { id: '09-D2', type: 'application', title: 'Código Go', targetKeys: ['Equal', 'Quote', 'Semicolon'], content: ['func main() {', '    fmt.Println("NeoType")', '}'], difficulty: 4 },
          { id: '09-D3', type: 'challenge', title: 'Symbol Challenge — sin mirar', instructions: 'Transcribe sin mirar teclado', targetKeys: ['BracketLeft', 'BracketRight', 'Quote', 'Equal', 'Slash'], content: ['const x = () => {}', 'if (a) { return b; }'], difficulty: 4 },
        ],
      },
      {
        id: 'typing-es-09--E',
        title: 'Session E — Mastery',
        objectives: ['Combinación completa símbolos'],
        estimatedMinutes: 8,
        blocks: [
          { id: '09-E1', type: 'evaluation', targetKeys: ['Digit9', 'Digit0', 'BracketLeft', 'BracketRight', 'Equal'], content: ['() {} [] => == !='], difficulty: 5 },
          { id: '09-E2', type: 'evaluation', targetKeys: ['Quote', 'Backquote', 'Slash', 'Equal'], content: ['name = "NeoType"'], difficulty: 5 },
        ],
      },
    ],
    get blocks(): Lesson['blocks'] { return mkBlocksFlat(this.sessions); },
    set blocks(v: Lesson['blocks']) { void v; },
    evaluator: { kind: 'typing' },
    mastery: { minAccuracy: 0.95, consecutivePasses: 2 },
  },

  // ───────────────────────────────── TYPING 10 — Fluidez completa ─────────────────────────────────
  {
    id: 'typing-es-10',
    courseId: 'typing',
    version: 3,
    domain: 'typing',
    title: 'Fluidez completa — integración',
    description: 'Integra natural + técnico + terminal + paths + código Python/Go.',
    objectives: ['100 palabras', 'Símbolos+mayús+ números combinados'],
    prerequisites: ['typing-es-09'],
    skills: ['full-fluency'],
    targetKeys: ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Digit1', 'Digit0', 'Slash', 'Equal', 'Quote'],
    sessions: [
      {
        id: 'typing-es-10--A',
        title: 'Session A — Review + Natural & Technical English',
        objectives: ['Review símbolos', '100 palabras + vocab técnico'],
        estimatedMinutes: 10,
        blocks: [
          { id: '10-A0', type: 'review', title: 'Review — símbolos', instructions: 'Recupera () {} [] => ==', targetKeys: ['Digit9', 'BracketLeft', 'Quote', 'Equal'], content: ['() {} [] =>'], difficulty: 3 },
          { id: '10-A1', type: 'application', title: 'Stage 1 — Natural language', targetKeys: ['KeyS', 'KeyE', 'KeyR', 'KeyV'], content: ['server repository function database keyboard deployment'], difficulty: 4 },
          { id: '10-A2', type: 'application', title: 'Stage 2 — Technical English', targetKeys: ['KeyS', 'KeyE', 'KeyR', 'KeyV'], content: ['The keyboard controls the editor and the editor controls the system.'], difficulty: 4 },
        ],
      },
      {
        id: 'typing-es-10--B',
        title: 'Session B — Terminal & Paths',
        objectives: ['Comandos y rutas'],
        estimatedMinutes: 10,
        blocks: [
          { id: '10-B1', type: 'application', title: 'Stage 3 — Terminal', targetKeys: ['Slash', 'Minus'], content: ['git status', 'git add .', 'git commit -m "feat: add keyboard"', 'docker compose up -d'], difficulty: 4 },
          { id: '10-B2', type: 'application', title: 'Stage 4 — Paths', targetKeys: ['Slash', 'Period'], content: ['/home/marco/projects/neotype', '/etc/nginx/conf.d/default.conf', 'src/components/Keyboard.tsx'], difficulty: 4 },
        ],
      },
      {
        id: 'typing-es-10--C',
        title: 'Session C — Código Python & Go',
        objectives: ['Código real'],
        estimatedMinutes: 10,
        blocks: [
          { id: '10-C1', type: 'application', title: 'Stage 5 — Python', targetKeys: ['Semicolon', 'Quote', 'Equal'], content: ['def greet(name):', '    return f"Hello {name}"'], difficulty: 4 },
          { id: '10-C2', type: 'application', title: 'Stage 6 — Go', targetKeys: ['Semicolon', 'Quote', 'Equal'], content: ['func add(a int, b int) int {', '    return a + b', '}'], difficulty: 4 },
        ],
      },
      {
        id: 'typing-es-10--D',
        title: 'Session D — Final Challenge',
        objectives: ['accuracy ≥95% sin exigir WPM mínimo'],
        estimatedMinutes: 12,
        blocks: [
          { id: '10-D1', type: 'challenge', title: 'Combinado — texto+números+símbolos', targetKeys: ['KeyA', 'Digit1', 'Slash', 'Quote'], content: ['Server 10.10.0.130:8080 — NeoType v2026'], difficulty: 4 },
          { id: '10-D2', type: 'evaluation', title: 'Final typing challenge', targetKeys: ['KeyA', 'Digit1', 'Slash', 'Quote', 'Equal'], content: ['git commit -m "feat: neotype 2026"'], difficulty: 5 },
          { id: '10-D3', type: 'evaluation', targetKeys: ['KeyA', 'Digit1', 'Slash', 'Quote', 'Equal'], content: ['def greet(name): return f"Hello {name}" // 10.10.0.130'], difficulty: 5 },
        ],
      },
    ],
    get blocks(): Lesson['blocks'] { return mkBlocksFlat(this.sessions); },
    set blocks(v: Lesson['blocks']) { void v; },
    evaluator: { kind: 'typing' },
    mastery: { minAccuracy: 0.95, consecutivePasses: 3 },
    reviews: [{ afterDays: 1 }, { afterDays: 3 }, { afterDays: 7 }, { afterDays: 14 }, { afterDays: 30 }],
  },
];

export function getLesson(id: string): Lesson | undefined {
  return TYPING_ES.find((l) => l.id === id);
}
export const ALL_TYPING_IDS = TYPING_ES.map((l) => l.id);
