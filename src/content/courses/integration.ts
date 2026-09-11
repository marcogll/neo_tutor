import type { Lesson } from '@/domains/lesson';

function flat(s: Lesson['sessions']): Lesson['blocks'] {
  return (s ?? []).flatMap((x) => x.blocks);
}

// §12 Proyectos de integración — no cuentan como nuevas lecciones, consolidan conocimientos
export const INTEGRATIONS: Lesson[] = [
  {
    id: 'integration-01',
    courseId: 'typing',
    version: 1,
    domain: 'typing',
    title: 'Integration 01 — Terminal transcription',
    description: 'Después de Typing 10: git/docker/systemctl',
    objectives: ['Transcribir comandos reales sin mirar', 'Ritmo en símbolos'],
    prerequisites: ['typing-es-10'],
    skills: ['full-fluency', 'symbols'],
    sessions: [
      {
        id: 'integration-01--A',
        title: 'Session A — Terminal real',
        estimatedMinutes: 10,
        blocks: [
          { id: 'int01-A1', type: 'application', instructions: 'Transcribe sin mirar, mantén home', targetKeys: ['KeyG', 'KeyI', 'KeyT', 'Slash'], content: ['git status', 'docker compose ps', 'systemctl status docker'], difficulty: 4 },
          { id: 'int01-A2', type: 'zen', targetKeys: ['KeyG', 'KeyI', 'KeyT', 'Slash'], content: ['git status', 'docker compose ps', 'systemctl status docker'], difficulty: 4 },
          { id: 'int01-A3', type: 'evaluation', targetKeys: ['KeyG', 'KeyI', 'KeyT', 'Slash'], content: ['git status'], difficulty: 5 },
        ],
      },
    ],
    get blocks(): Lesson['blocks'] { return flat(this.sessions); },
    set blocks(v: Lesson['blocks']) { void v; },
    evaluator: { kind: 'typing' },
    mastery: { minAccuracy: 0.95, consecutivePasses: 2 },
  },
  {
    id: 'integration-02',
    courseId: 'neovim',
    version: 1,
    domain: 'neovim',
    title: 'Integration 02 — Edit configuration',
    description: 'Después de Vim 05: editar YAML solo con comandos aprendidos',
    objectives: ['Editar server host/port sin mouse', 'Usar 0 ^ $ gg G'],
    prerequisites: ['neovim-es-05'],
    skills: ['vim-document'],
    sessions: [
      {
        id: 'integration-02--A',
        title: 'Session A — Config YAML',
        estimatedMinutes: 10,
        blocks: [
          { id: 'int02-A1', type: 'application', instructions: 'Archivo: server: host 10.10.0.130 port 8080 → editar solo con 0 ^ $', content: ['server:', '  host: 10.10.0.130', '  port: 8080'], difficulty: 4 },
          { id: 'int02-A2', type: 'challenge', instructions: 'Cambia host a 10.10.0.10 sin Insert innecesario', content: ['10.10.0.10'], difficulty: 4 },
          { id: 'int02-A3', type: 'evaluation', targetKeys: ['Digit0', 'Equal'], content: ['host: 10.10.0.10'], difficulty: 5 },
        ],
      },
    ],
    get blocks(): Lesson['blocks'] { return flat(this.sessions); },
    set blocks(v: Lesson['blocks']) { void v; },
    evaluator: { kind: 'vim' },
    mastery: { minAccuracy: 0.9, consecutivePasses: 2 },
  },
  {
    id: 'integration-03',
    courseId: 'neovim',
    version: 1,
    domain: 'neovim',
    title: 'Integration 03 — Refactor with Vim',
    description: 'Después de Vim 09: refactor Python corto',
    objectives: ['Renombrar variable, eliminar línea, duplicar bloque, buscar, repetir con .'],
    prerequisites: ['neovim-es-09'],
    skills: ['vim-search', 'vim-operators'],
    sessions: [
      {
        id: 'integration-03--A',
        title: 'Session A — Refactor',
        estimatedMinutes: 12,
        blocks: [
          { id: 'int03-A1', type: 'application', instructions: 'Código Python: renombra variable con ciw, busca con /', content: ['def add(a, b):', '    return a + b'], difficulty: 4 },
          { id: 'int03-A2', type: 'challenge', instructions: 'Duplica bloque con yy p, busca palabra con *', content: ['yy p'], difficulty: 4 },
          { id: 'int03-A3', type: 'evaluation', content: ['def add(a, b):'], difficulty: 5 },
        ],
      },
    ],
    get blocks(): Lesson['blocks'] { return flat(this.sessions); },
    set blocks(v: Lesson['blocks']) { void v; },
    evaluator: { kind: 'vim' },
    mastery: { minAccuracy: 0.9, consecutivePasses: 2 },
  },
  {
    id: 'integration-04',
    courseId: 'python',
    version: 1,
    domain: 'python',
    title: 'Integration 04 — Python CLI (completo)',
    description: 'Después de Python 07: NeoInventory CLI con todos los módulos',
    objectives: ['Integrar variables→CLI', 'Tests deben pasar'],
    prerequisites: ['python-es-07'],
    skills: ['py-cli'],
    sessions: [
      {
        id: 'integration-04--A',
        title: 'Session A — CLI final',
        estimatedMinutes: 15,
        blocks: [
          { id: 'int04-A1', type: 'application', instructions: 'add/list/show/update/delete con JSON y argparse', content: ['python app.py list', 'python app.py add server'], difficulty: 4 },
          { id: 'int04-A2', type: 'evaluation', content: ['python app.py list'], difficulty: 5 },
        ],
      },
    ],
    get blocks(): Lesson['blocks'] { return flat(this.sessions); },
    set blocks(v: Lesson['blocks']) { void v; },
    evaluator: { kind: 'code' },
    mastery: { minAccuracy: 0.85, consecutivePasses: 2 },
  },
  {
    id: 'integration-05',
    courseId: 'go',
    version: 1,
    domain: 'go',
    title: 'Integration 05 — Go API (completo)',
    description: 'Después de Go 07: NeoInventory API HTTP',
    objectives: ['Integrar types→HTTP', 'Endpoints health/devices'],
    prerequisites: ['go-es-07'],
    skills: ['go-http'],
    sessions: [
      {
        id: 'integration-05--A',
        title: 'Session A — API final',
        estimatedMinutes: 15,
        blocks: [
          { id: 'int05-A1', type: 'application', instructions: 'GET /health GET /devices POST /devices con json', content: ['GET /health', 'GET /devices', 'POST /devices'], difficulty: 4 },
          { id: 'int05-A2', type: 'evaluation', content: ['GET /devices'], difficulty: 5 },
        ],
      },
    ],
    get blocks(): Lesson['blocks'] { return flat(this.sessions); },
    set blocks(v: Lesson['blocks']) { void v; },
    evaluator: { kind: 'code' },
    mastery: { minAccuracy: 0.85, consecutivePasses: 2 },
  },
];
