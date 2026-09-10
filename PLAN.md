# NeoType — Plan de Implementación

**Origen:** `PRD.md` v1.0 (2026-09-10)
**Stack cerrado:** React + TypeScript + Vite, Zustand, Dexie (IndexedDB), CodeMirror 6, Vitest + Playwright, Nginx Docker
**Estrategia:** Local-first, sin backend en MVP. Python/Go solo como contrato de datos reservado.

---

## 1. Resumen de fases

| Fase | Nombre | PRD Ref | Entregable | Criterio de salida |
|------|--------|---------|------------|---------------------|
| 0 | Fundación | §30 Fase 0, §21, §25, §32 | Repo + CI + Docker + Design System | `docker compose up` sirve SPA + healthcheck OK, lint/typecheck/test verdes |
| 1 | Captura & Calibración | §11, §21.2 | Keyboard Engine + Layouts + Calibración | 3 perfiles Mac (ANSI US, ISO ES, ISO LA) calibrados y persistidos; `code` vs `key` distinguido |
| 2 | Teclado visual & Diagnóstico | §10, §11.3 KB001-005 | Teclado SVG/CSS + Asignación dedos + Diagnóstico | Ruta inicial generada tras diagnóstico; lecciones bloqueadas si teclas faltan |
| 3 | Motor Typing & Curso | §12, §18, §22 | Typing Engine + Generador contenido + 5 lecciones fila central | TY001-TY006 cumplidos; precisión/ritmo/transición medidos |
| 4 | Zen & Adaptativo | §13, §15 | Modo Zen + Adaptive Engine + SkillState | ZN001-ZN004 y reglas §15.2 operativas; repetición espaciada |
| 5 | Neovim Lab | §14, §18 | Vim Engine determinista + Laboratorio + Retos | NV001-NV005; eficiencia = óptimas/usadas*100 con alternativas declaradas |
| 6 | Integración & Hardening | §19, §20, §24, §27 | PWA + Export/Import + a11y WCAG 2.2 AA + E2E | 10 criterios §27 en verde |

Fases 7-9 (backend, Python, Go) **fuera de MVP**, solo se reservan tipos/esquema.

---

## 2. Arquitectura objetivo (PRD §21.1)

```
src/
├── app/          router, providers, shell, pwa
├── components/   Keyboard, Hands, Editor, Charts, UI primitives
├── features/     calibration, typing, neovim, course, progress, settings
├── engines/      keyboard, typing, adaptive, vim  (TS puro, sin React)
├── domains/      typing, neovim, python, go  (tipos Lesson compartidos)
├── content/      layouts/*.json, courses/*.json, i18n/{es,en}
├── storage/      db.ts (Dexie), repositories, migrations
├── workers/      metrics.worker.ts
└── tests/        fixtures, e2e, property-based
```

**Decisiones fijas PRD §21.2:**
- Local-first → Dexie + event sourcing ligero (`KeystrokeEvent` append-only)
- Vim propio determinista, CodeMirror 6 solo como superficie de texto
- Contenido desacoplado del código (JSON versionado)

---

## 3. Detalle por fase

### Fase 0 — Fundación (1-2 días)

**Objetivo:** Base reproducible.

- [ ] `npm create vite@latest` React-TS + `strict: true`, ESLint, Prettier, `tsc --noEmit`
- [ ] Router (React Router), Zustand, Dexie, CodeMirror 6 instalados pero sin uso aún
- [ ] Estructura `src/` anterior + alias `@/*`
- [ ] Design tokens: tema oscuro/claro/cálido, tipografía monoespaciada, focus visible (WCAG §24)
- [ ] CI: GitHub Actions `lint + typecheck + vitest + build`
- [ ] Docker multi-stage: `node:22-alpine` build → `nginx:alpine` serve, user `nginx` (no root), `HEALTHCHECK CMD wget -qO- http://localhost:8080/health` (§25), `read_only: true`, `no-new-privileges`
- [ ] `docker-compose.yml` puerto `8080:8080`, `tmpfs: /tmp`
- [ ] i18n scaffold: `src/content/i18n/es.json` como fuente, `en.json` estructural

**DoD:** `npm run build` y `docker compose up --build` sirven SPA con fallback SPA (`try_files $uri /index.html`).

### Fase 1 — Keyboard Engine & Calibración (§11)

**Prioridad máxima — bloquea todo.**

- [ ] `src/content/layouts/` JSON Schema:
  ```ts
  interface KeyboardLayout { id: string; physical: "ANSI"|"ISO"; logical: "US"|"ES"|"LA"; keys: { code:string; label:string; finger:string }[] }
  ```
  Fixtures: `mac-ansi-us.json`, `mac-iso-es.json`, `mac-iso-la.json` (KB001)
- [ ] `engines/keyboard/`:
  - `capture.ts` — listener solo con foco en superficie (`keydown` → {code, key, modifiers, timestamp}), distingue `code` vs `key` (TY005, §7.2)
  - `detect.ts` — heurística `getLayoutMap` + presencia `IntlBackslash`, `Enter`, `Meta` (§11.1)
  - `profile.ts` — `KeyboardProfile` versionado, CRUD + `KB002` re-etiquetado sin mover `code`, `KB003` reset
- [ ] `features/calibration/` wizard 5 pasos (§11.2):
  1. A/Z/Q → QWERTY check
  2. Ñ / ; → ES vs US
  3. `< >` → ISO via `IntlBackslash`
  4. Command/Option → Mac modifiers
  5. Confirmación visual editable
- [ ] `storage/db.ts` Dexie v1: `keyboardProfiles`, `userProfile` (§22), migración stub (§20 persistencia)
- [ ] Visualizador diagnóstico (temporal, §31.2): tabla `code | key | modifiers` en tiempo real
- [ ] Tests: unidad `detect` con mocks `KeyboardEvent`, property test transiciones (§26)

**DoD:** KB001-KB005 verificables; ninguna lección inicia si `KB005` falla.

### Fase 2 — Teclado Visual, Manos y Diagnóstico (§10-§12)

- [ ] `components/Keyboard/` SVG o CSS Grid responsivo, prop `profile: KeyboardProfile`, highlights: tecla esperada, error (no solo color, §24), dedo recomendado
- [ ] `components/Hands/` silueta con dedos, mapeo `code → finger` por layout
- [ ] `features/diagnostic/` 3 micro-tests sin penalización (§10): fila central, coordinación, hábitos → genera `SkillState` inicial (§15.1)
- [ ] Guard `KB005`: filtrado de lecciones por teclas disponibles
- [ ] Pantallas: `Inicio`, `Calibración`, `Diagnóstico` con navegación sin mouse (FR007, §24)

**DoD:** Usuario completa calibración → diagnóstico → ruta inicial (flujo §9 pasos 1-4).

### Fase 3 — Typing Engine & Curso (§12, §18, §22)

**Núcleo pedagógico.**

- [ ] `engines/typing/` TS puro:
  - `sessionRecorder.ts` — append `KeystrokeEvent` {code, key, expected, time, modifiers, context} (TY002)
  - `metrics.ts` — WPM bruto/neto, precisión, latencia inter-key, desviación ritmo (TY003), cálculo determinista
  - `mastery.ts` — dominio 0-1 por tecla/dedo/bigrama, decaimiento temporal (§15)
- [ ] `engines/adaptive/` reglas §15.2: desbloqueo ≥95% precisión + ≥90% dedos + 3 aprobadas; no subir dificultad si precisión baja; ≤40% repetición
- [ ] `content/courses/typing-es.json` — 7 niveles §12.1, cada `Lesson` respeta contrato §18:
  ```ts
  // domains/lesson.ts — común a typing/neovim/python/go
  interface Lesson { id, version, domain, title, objectives, prerequisites, blocks: LessonBlock[], evaluator, mastery }
  ```
- [ ] Generador restringido (§31.6): dado `unlockedKeys`, produce patrones §12.2 (repetición, misma fila, vertical, alternancia, rodamientos, bigrama, código) sin filtrar contenido externo
- [ ] `features/course/` Lesson runner: bloques §12.3 (posición → movimiento → patrones → sílabas → Zen → evaluación), `TY001` contenido filtrado, `TY006` toggle Backspace
- [ ] Ruta vertical 5 lecciones fila central (§31.7) como smoke content
- [ ] Tests unidad: WPM/precisión/ritmo con fixtures (§26)

**DoD:** Lecciones generan solo teclas desbloqueadas; métricas persisten en Dexie tras cada bloque (FR002).

### Fase 4 — Modo Zen & Progreso (§13, §15)

- [ ] `features/zen/`:
  - Una línea centrada, cursor claro, feedback tenue; `ZN001` sin WPM/cronómetro por defecto, `ZN002` ocultar ayudas, `ZN003` no interrumpir línea, `ZN004` 3 temas accesibles
  - Formatos §13.1 (letras, patrones, sílabas, frases, código, neovim) + duraciones 5/10/20 min (§13.2)
  - Resumen post-sesión con métricas completas
- [ ] `features/progress/`:
  - `SkillState` por habilidad (§22), mapas de calor por tecla/dedo/transición, evolución temporal
  - `PracticeSession` + `KeystrokeEvent` event sourcing (§21.2)
  - Explicación reproducible "por qué se recomienda" (FR010)
- [ ] Pantallas: `Zen`, `Progreso`, `Inicio` continúa desde última actividad (FR001)

### Fase 5 — Simulador Neovim (§14)

**Motor determinista, no emulación.**

- [ ] `engines/vim/`:
  - `state.ts` — `VimState { mode: Normal|Insert|Visual|Command, cursor, buffer: string[], registers }`
  - `operations.ts` — movimientos `h j k l w b e 0 ^ $ gg G { }`, ediciones `i a o x r`, operadores `d c y` + compuestos `dw ciw dd yy p`, búsqueda `/ n N`, historial `. u C-r` (§14.1)
  - `evaluator.ts` — compara `estadoFinal` + `secuencia` vs `solucionesAceptadas` (§14.2), eficiencia = `óptimas/usadas*100`, penaliza flechas (NV004), mide tiempo primera acción
  - `history.ts` — log reproducible (NV005)
- [ ] `features/neovim/` Lab: CodeMirror 6 como vista, overlay modo persistente (NV001), declaración reto `{initial, expected, acceptedSolutions}` (NV002), pistas incrementales (NV003), bloqueo flechas configurable
- [ ] Contenido: `content/courses/neovim-es.json` módulos progresivos Modos → Movimiento → Edición compuesta
- [ ] Retos combinados typing+neovim (§9.7)

**DoD:** §27.6 y §27.7 en verde; tests property: secuencias aleatorias no corrompen buffer (§26).

### Fase 6 — Integración, PWA, a11y, E2E (§19, §20, §24, §26, §27)

- [ ] PWA: `vite-plugin-pwa`, offline tras primera carga (FR006), precache contenido
- [ ] Export/Import JSON perfil+progreso (FR003, FR005 versionado), reinicio habilidad sin borrar perfil (FR004)
- [ ] Atajos sin mouse (FR007), consentimiento telemetría separado (FR009, deshabilitado)
- [ ] a11y WCAG 2.2 AA: foco visible no colisiona con highlight, no solo color, labels SR, `prefers-reduced-motion`, zoom 200% (§24), auditoría `axe`
- [ ] Perf: feedback <50ms (NFR), `workers/metrics.worker.ts` para cálculos pesados
- [ ] E2E Playwright (§26): calibración, primera lección, Zen, reto Neovim, export/import, persistencia reload
- [ ] Compatibilidad: Chrome/Edge/Firefox/Safari últimas 2 (NFR), degradación `getLayoutMap`
- [ ] Hardening final: CSP restrictiva, deps auditadas, sin `eval` (Seguridad §23), `read_only` Docker verificado

**DoD:** 10 criterios §27 + indicadores §28 (latencia <50ms, 100% sesiones sin pérdida).

---

## 4. Modelo de datos mínimo (Dexie v1)

```ts
// storage/db.ts
db.version(1).stores({
  userProfiles: "id",
  keyboardProfiles: "id, physical, logical",
  courses: "id, domain",
  lessons: "id, domain",
  practiceSessions: "id, lessonId, startedAt",
  keystrokeEvents: "++id, sessionId, time",
  skillStates: "[domain+skillId]",
  vimAttempts: "++id, lessonId"
});
```

Reservar `codeAttempts` (PG001) sin implementar ejecución (PG002-PG004 bloqueados hasta fase 8).

---

## 5. Backlog ordenado (PRD §31, priorizado para ejecución)

1. Schema layouts + fixtures Mac (Fase 1)
2. Capture `code/key/modifiers` + visualizador diagnóstico (F1)
3. Wizard calibración + persistencia `KeyboardProfile` (F1)
4. Teclado SVG + asignación dedos (F2)
5. `SessionRecorder` + métricas deterministas (F3)
6. Generador patrones restringido (F3)
7. Ruta 5 lecciones fila central (F3)
8. Modo Zen + resumen (F4)
9. Núcleo Vim modos+movimientos (F5)
10. Retos + eficiencia + pistas (F5)
11. Contenido completo + E2E + PWA + Docker hardening (F6)

---

## 6. Riesgos y mitigaciones activas

| Riesgo PRD §29 | Mitigación en plan |
|---|---|
| Detección teclado incompleta | Wizard 5 pasos + edición manual siempre disponible |
| Diferencias navegadores | Feature-detect `getLayoutMap`, tests en 4 navegadores |
| Vim scope creep | Subconjunto §14.1 cerrado; motor determinista sin plugins |
| Obsesión WPM | Gate 95% precisión + ritmo antes de velocidad (§15.2) |
| IndexedDB corrupta | Export JSON + migraciones versionadas + test pérdida 0% |

---

## 7. Próximo paso propuesto

**Ejecutar Fase 0 ahora:** inicializar Vite+TS+Docker+CI en este repo vacío. ¿Confirmo y arranco?

Alternativa: si prefieres revisar primero, ajusto el plan (alcance, orden o stack) antes de tocar código.
