<p align="center">
  <img src="https://raw.githubusercontent.com/marcogll/mg_data_storage/refs/heads/main/soul23/logo/soul23_logo.svg" width="110" alt="NeoType">
</p>

<h1 align="center">NeoType</h1>

<p align="center">
  Entrenador de mecanografía táctil y Neovim. PWA local-first con motor determinista, progreso offline y calibración de teclado.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-3a3a3a?style=flat-square&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-3a3a3a?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-3a3a3a?style=flat-square&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Zustand-3a3a3a?style=flat-square&logo=zustand&logoColor=white" alt="Zustand">
  <img src="https://img.shields.io/badge/Dexie-3a3a3a?style=flat-square&logo=dexie&logoColor=white" alt="Dexie">
  <img src="https://img.shields.io/badge/CodeMirror-3a3a3a?style=flat-square&logo=codemirror&logoColor=white" alt="CodeMirror">
  <img src="https://img.shields.io/badge/Docker-3a3a3a?style=flat-square&logo=docker&logoColor=white" alt="Docker">
</p>

---

## Descripción

NeoType es una aplicación web para el aprendizaje de mecanografía táctil con diez dedos y uso práctico de Neovim. Prioriza precisión y ritmo sobre velocidad, mide patrones motores por tecla, dedo y transición, y opera completamente en local sin backend en el MVP.

Optimizada para MacBook Air M1 con soporte para layouts ANSI e ISO y distribuciones US, ES y LA. La detección de teclado combina señales técnicas del navegador y calibración guiada. Preparada para expansión futura a Python y Go sobre el mismo modelo de lecciones y evaluación.

PRD v1.0 — 10 de septiembre de 2026. Plataforma web React desplegable vía Docker. Idioma inicial español con estructura para inglés.

## Características

**Calibración de teclado.** Detección por `KeyboardEvent.code` vs `KeyboardEvent.key`, `navigator.keyboard.getLayoutMap` y heurística de teclas físicas. Wizard de 5 pasos con confirmación visual y perfiles versionados. Tres fixtures incluidos: Mac ANSI US, Mac ISO ES, Mac ISO LA.

**Motor de mecanografía.** Transiciones físicas entre estados, métricas por tecla, dedo, mano, fila, bigrama y trigrama. Medición de latencia inter-pulsación y variación de ritmo. Contenido generado solo con teclas desbloqueadas.

**Progresión curricular.** 7 niveles desde fila central hasta texto libre y código. Tipos de patrón: repetición, misma fila, vertical, alternancia, rodamientos, mismo dedo, bigrama y código. Bloques por lección: posición, movimiento aislado, patrones, sílabas, frase Zen y evaluación.

**Modo Zen.** Línea centrada, interfaz mínima y retroalimentación tenue. Sin WPM ni cronómetro durante la ejecución. Formatos: letras, patrones, sílabas, frases, código y Neovim. Sesiones de 5, 10 y 20 minutos.

**Simulador Neovim.** Motor determinista propio sobre CodeMirror 6 como superficie visual. Modos Normal, Insert, Visual y Command. Comandos: `h j k l`, `w b e`, `0 ^ $`, `gg G { }`, `i a o x r`, operadores `d c y`, compuestos `dw ciw dd yy p`, búsqueda `/ n N` e historial `. u Ctrl-r`. Evaluación por estado final, secuencia y eficiencia `óptimas/usadas*100`.

**Motor adaptativo.** Dominio 0–1 por habilidad con decaimiento temporal para repetición espaciada. Desbloqueo con 95% precisión, 90% uso correcto de dedos y 3 ejercicios aprobados. Sin aumento de dificultad si la precisión cae.

**Persistencia local.** IndexedDB vía Dexie, event sourcing ligero de `KeystrokeEvent`, exportación e importación JSON, funcionamiento offline tras primera carga y PWA instalable.

## Stack

| Capa | Tecnología | Uso |
|---|---|---|
| Interfaz | React 19 + TypeScript 6 | Componentes, rutas y accesibilidad |
| Build | Vite 8 | Desarrollo y bundle |
| Estado | Zustand 5 | Sesión y preferencias |
| Datos | Dexie 4 sobre IndexedDB | Progreso, eventos y perfiles |
| Editor | CodeMirror 6 | Superficie de texto |
| Motores | TypeScript puro | keyboard, typing, adaptive, vim |
| Pruebas | Vitest 5 + Testing Library | Unidad e integración |
| PWA | vite-plugin-pwa | Offline y manifest |
| Entrega | Docker + Nginx | Imagen multi-stage, usuario no root |

Futuro reservado: Fastify, PostgreSQL, Drizzle y workers aislados para Python y Go.

## Arquitectura

```
src/
├── app/          router, providers, shell
├── components/   Keyboard, Hands, Editor
├── features/     calibration, typing, neovim, course, progress, settings
├── engines/      keyboard, typing, adaptive, vim
├── domains/      lesson (contrato común typing|neovim|python|go)
├── content/      layouts/*.json, courses/*.json, i18n/{es,en}.json
├── storage/      db.ts, repositories, migrations
├── workers/      metrics.worker.ts
└── tests/        fixtures y setup
```

Decisiones: local-first, motor Vim determinista sin emulación completa, contenido desacoplado en JSON versionado, dominios futuros declarados desde el esquema sin ejecución de código en el MVP.

## Estructura de Lección

```ts
interface Lesson {
  id: string;
  version: number;
  domain: "typing" | "neovim" | "python" | "go";
  title: string;
  objectives: string[];
  prerequisites: string[];
  blocks: LessonBlock[];
  evaluator: EvaluatorConfig;
  mastery: MasteryRule;
}
```

Cada lección limita teclas, movimientos y comandos a una sola habilidad por incremento.

## Modelo de Datos

| Entidad | Campos principales |
|---|---|
| UserProfile | id, language, preferences, createdAt |
| KeyboardProfile | id, physical, logical, platform, keys, modifiers, version |
| Lesson | id, domain, objectives, prerequisites, blocks, evaluator |
| PracticeSession | id, lessonId, domain, startedAt, endedAt, mode |
| KeystrokeEvent | code, key, expected, time, modifiers, context |
| SkillState | domain, skillId, mastery 0–1, lastPracticedAt, intervalDays |
| VimAttempt | initialState, actions, result, efficiency, hintsUsed |

## Instalación

Requisitos: Node 22, npm.

```bash
npm install
npm run dev
```

Build y preview:

```bash
npm run build
npm run preview
```

Docker:

```bash
docker compose up --build
# http://localhost:8080
# health: http://localhost:8080/health → ok
```

La imagen es multi-stage Node 22 Alpine con Nginx Alpine, healthcheck dedicado, `read_only: true` y `no-new-privileges:true`.

## CI/CD

Pipeline en `.github/workflows/ci.yml`:

```
quality (lint+typecheck+test) → build (vite + artifact dist) → docker (buildx + push GHCR) → deploy (Coolify webhook)
```

- **CI en cada PR y push a `main`:** `quality` + `build` siempre se ejecutan. `docker` y `deploy` solo en `push` a `main` (los PR verifican que compila sin publicar).
- **Imágenes en GHCR:** `ghcr.io/<owner>/neo_tutor:latest` + `ghcr.io/<owner>/neo_tutor:sha-<short>` (via `docker/metadata-action`). Cache `gha` para builds rápidos.
- **Release:** `.github/workflows/release.yml` se dispara en tags `v*.*.*` y publica imagen versionada `vX.Y.Z`, `vX.Y`, `vX`, `latest` + GitHub Release con `dist`.
- **Deploy Coolify:** el job `deploy` dispara `COOLIFY_WEBHOOK_URL` si está configurado (Coolify → App → Webhooks). Alternativa API con `COOLIFY_TOKEN` + `COOLIFY_APP_UUID` (+ `COOLIFY_HOST` si es self-hosted). Si no hay secrets, hace skip con aviso y la imagen queda disponible en GHCR para deploy manual (`docker compose pull`).

Configurar en GitHub → Settings → Secrets and variables → Actions:

```
COOLIFY_WEBHOOK_URL  # recomendado: URL del webhook de la App en Coolify
# o bien
COOLIFY_TOKEN        # token API Coolify
COOLIFY_APP_UUID     # UUID de la aplicación
COOLIFY_HOST         # opcional, default https://app.coolify.io
```

Dependabot en `.github/dependabot.yml` actualiza `npm` y `docker` semanalmente.

Requerido como branch protection: `ci-success` (agrega `quality` + `build` como checks obligatorios).

## Scripts

```bash
npm run dev              # Vite dev server
npm run build            # tsc -b + vite build
npm run preview          # preview del build
npm run lint             # oxlint
npm run typecheck        # tsc -b --noEmit
npm run test             # vitest run
npm run test:watch       # vitest watch
npm run test:coverage    # vitest con coverage
```

## Flujo Principal

1. Inferencia de plataforma y layout lógico.
2. Calibración en 5 pasos y confirmación visual.
3. Diagnóstico breve de fila central y coordinación.
4. Generación de ruta inicial y apertura de lección.
5. Bloques guiados y práctica Zen.
6. Actualización de dominio por tecla, dedo, transición y comando.
7. Desbloqueo progresivo de retos Neovim.

## Roadmap

| Versión | Alcance | Estado |
|---|---|---|
| MVP 0.1 | Calibración, teclado visual, captura y diagnóstico | Primera entrega |
| MVP 0.2 | Curso mecanografía, Zen y métricas adaptativas | MVP |
| MVP 0.3 | Simulador Neovim y retos combinados | MVP completo |
| 1.0 | PWA, importación/exportación, accesibilidad WCAG 2.2 AA | Producto estable |
| 2.0 | Perfil sincronizado y autoría de cursos | Posterior |
| 3.0 | Tutor Python | Futuro |
| 3.5 | Tutor Go | Futuro |

## Principios

- Precisión antes que velocidad.
- Posición física separada del carácter.
- Una habilidad por incremento.
- Retroalimentación proporcional: corrección inmediata en guiado, sin interrupciones en Zen.
- Datos locales por defecto.

## Privacidad y Seguridad

Solo se capturan eventos con foco en superficies de práctica. Sin telemetría por defecto. Sin ejecución de código arbitrario en el cliente. Eventos permanecen en el dispositivo. Exportación e importación bajo acción explícita.

## Accesibilidad

WCAG 2.2 AA, navegación completa por teclado, foco visible independiente del highlight de tecla, sin dependencia exclusiva del color, etiquetas para lectores de pantalla, `prefers-reduced-motion` y escalado hasta 200%.

## Licencia

Privado. Todos los derechos reservados.
