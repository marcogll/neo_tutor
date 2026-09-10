# NeoType — Currículo Integrado

**Filosofía:** precisión → ritmo → velocidad → edición → código. Una habilidad por incremento, progreso local simple y teclado siempre visible con colores.

**Progreso simplificado:** cada lección guarda `currentBlock`, `passes 0/3`, `bestAccuracy`, `status locked/available/in_progress/completed`. Al aprobar 3 evaluaciones ≥95% se desbloquea la siguiente. Todo en `neotype:progress-v2` (persist + Dexie para eventos). Botón “Continuar donde quedaste” (FR001) y “Reiniciar lección” sin borrar todo (FR004).

**Teclado con colores (shadcn Mac minimal):**
- **● negro** = tecla objetivo actual
- **✕ rojo** = error
- **ámbar** = teclas que ocupa esta lección/bloque (todas las `targetKeys` en ámbar claro `bg-amber-100`)
- **gris** = resto del teclado
- **punto** = dedo recomendado (rosa/violeta/cielo/esmeralda)

---

## Listado de lecciones (33) — 4 cursos integrados

### 1) TrueType — Mecanografía (10) — 7 niveles PRD §12.1

| # | ID | Título | Objetivo | Bloques clave |
|---|----|--------|----------|---------------|
| 1 | `typing-es-01` | N1 — Fila central jklñ | Mano derecha postura | position jklñ → `jjjj kkkk` → `jklñ` → `al la ña` |
| 2 | `typing-es-02` | N1 — Fila central asdf | Mano izquierda ancla f/j | `aaaa ssss` → `asdf fdsa` → `asa ala` |
| 3 | `typing-es-03` | N1 — Ambas manos + ritmo | Alternancia `fj dk` | `fj dk sl añ` → `fdfd jkjk` → `al la sal` |
| 4 | `typing-es-04` | N2 — Fila superior qwert | Alcance vertical | `q w e r t` → `qwer` → `que tal` |
| 5 | `typing-es-05` | N2 — Fila superior yuiop | Mano derecha sup. | `yuiop` → `puyo tuyo` |
| 6 | `typing-es-06` | N3 — Fila inferior zxcv+m | Saltos de fila | `az aqz` → `zxcv bnm` → `casa vez` |
| 7 | `typing-es-07` | N4 — Mayúsculas y números | Shift opuesto | `Aa Ss` → `123 456` → `Hola 123` |
| 8 | `typing-es-08` | N5 — Bigramas es/de/la | Palabras frecuentes | `de en la es el` → `de la casa en la sala` |
| 9 | `typing-es-09` | N6 — Símbolos `(){}[]=>` | Código 95% | `() {} []` → `const x = () => {}` |
| 10 | `typing-es-10` | N7 — Texto libre | Sesión larga | `la sala es la jaula...` |

*Prerrequisitos encadenados 01→10. Evaluación 95% / 3.*

### 2) Neovim — Edición modal (9) — PRD §14

| # | ID | Título | Qué explica | Atajos protagonistas |
|---|----|--------|-------------|----------------------|
| 1 | `neovim-es-01` | Modos Normal/Insert | Insert con `i/a`, `Esc` vuelve | `i a Esc` |
| 2 | `neovim-es-02` | h/j/k/l sin flechas | Mnemotecnia h-left, l-right | `h j k l` |
| 3 | `neovim-es-03` | Palabras w/b/e | Saltos palabra | `w b e` + `dw` |
| 4 | `neovim-es-04` | Líneas 0 ^ $ | Inicio/fin | `0 ^ $` + `a !` |
| 5 | `neovim-es-05` | Documento gg G { } | Archivo/párrafo | `gg G { }` |
| 6 | `neovim-es-06` | Edición x r ~ | Borrar/reemplazar char | `x r` |
| 7 | `neovim-es-07` | Operadores d/c/y | Verbo + movimiento | `dw ciw yy` |
| 8 | `neovim-es-08` | Líneas dd yy p | Cortar/copiar/pegar | `dd yy p P` |
| 9 | `neovim-es-09` | Búsqueda / . u | `/ n N . u Ctrl-r` | `/ n . u` |

*Cada lección: `position` (explica) → `pattern` → `vim-challenge` con pista NV003. Motor determinista §14.*

### 3) Python — 7 módulos PRD §16

| # | ID | Título |
|---|----|--------|
| 1 | `python-es-01` | Expresiones y variables |
| 2 | `python-es-02` | Condicionales y ciclos |
| 3 | `python-es-03` | Funciones |
| 4 | `python-es-04` | Colecciones |
| 5 | `python-es-05` | Archivos y errores |
| 6 | `python-es-06` | Pruebas |
| 7 | `python-es-07` | Proyecto CLI |

*Requiere `typing-es-05` → encadena typing. Evaluador local PG001-004 (sin red).*

### 4) Go — 7 módulos PRD §17

| # | ID | Título |
|---|----|--------|
| 1 | `go-es-01` | Variables y funciones |
| 2 | `go-es-02` | Structs e interfaces |
| 3 | `go-es-03` | Slices, maps, punteros |
| 4 | `go-es-04` | Errores |
| 5 | `go-es-05` | Paquetes y tests |
| 6 | `go-es-06` | Goroutines y channels |
| 7 | `go-es-07` | HTTP pequeño |

*Requiere `python-es-03`. GO001 `gofmt`, GO002 sin red.*

---

## Cómo se integran y se ve el avance

```
Inicio (hero) → Calibración (5 pasos) → Diagnóstico (3 tests) → Lecciones (grid 2 cols)
  │  barra global 33 lecciones · % total
  └→ Continuar donde quedaste (lastLessonId) + Siguiente recomendada (primera unlocked no completada)
Cursos (4 cards por dominio con barra por dominio)
  └→ Typing 10 · Vim 9 · Python 7 · Go 7 — click abre lección o /code/:id
Lección → bloques 1..n con puntos (● actual, 40% completado, gris resto) → Evaluación 95% → racha 0/3
  └→ al completar 3 → desbloquea dependientes (no solo siguiente lineal)
Progreso → 3 columnas: resumen global + grid por lección + explicación FR010
Zen → 6 formatos (letras/patrones/sílabas/frases/código/neovim) × 5/10/20min, sin métricas durante
```

**Mapa de dependencias:** `typing 01-03` → `neovim 01` → resto neovim → `typing 04-10` paralelo → `python` → `go`. Todo sobre contrato `Lesson §18`.

---

## Teclado — leyenda ámbar

En cada bloque el teclado pinta en ámbar todas las teclas que ocupan esa lección (ej: `j k l ñ` en N1), negro la tecla inmediata a pulsar, punto dedo. Así ves de un vistazo “qué parte del teclado estás entrenando” sin leer texto.

*Archivos:* `src/components/Keyboard/Keyboard.tsx` prop `activeCodes`, `src/features/course/LessonRunner.tsx` pasa `block.targetKeys` y `lesson.blocks.flatMap(targetKeys)`, `src/content/courses/*`.
