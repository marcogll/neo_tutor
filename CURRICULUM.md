# NeoType — Currículo Integrado (v3 — Unidades Completas)

> Touch Typing → Neovim → Python / Go — **cada lección es una unidad completa de aprendizaje**, no un tema.

Filosofía: `recordar → descubrir → practicar aislado → combinar → usar → resolver → demostrar dominio → volver después`. Una habilidad puede tomar 15 min, 1 hora o varios días.

---

## 1. Anatomía de una lección (bloques §4)

Cada lección puede usar:

```
RECALL · CONCEPT · POSITION · ISOLATION · PATTERN · COMBINATION · APPLICATION · CHALLENGE · ZEN · DEBUG · REVIEW · EVALUATION
```

- **RECALL**: recuperación activa sin mostrar respuesta (ej. `fj dk sl añ` o “¿qué movimiento para final de línea?”)
- **CONCEPT**: breve (qué es / por qué existe / cómo / cuándo usar)
- **POSITION**: tecla/dedo/mano/posición visual ÁMBAR=conjunto activo · NEGRO=objetivo · PUNTO=dedo
- **ISOLATION**: una sola habilidad `ffff rrrr`
- **PATTERN**: patrones motores `fr de sw aq` o `dw d$ de`
- **COMBINATION**: nuevo + anterior `fra ser dar`
- **APPLICATION**: tarea reconocible `name = "Marco"`
- **CHALLENGE**: objetivo sin pasos
- **ZEN**: solo contenido/cursor/errores/progreso (sin WPM/leaderboard)
- **DEBUG**: código incorrecto a reparar
- **REVIEW**: repetición espaciada
- **EVALUATION**: mide dominio sin enseñar — 3 PASS (pueden ser en sesiones diferentes, ≥95%)

---

## 2. Arquitectura curricular — 33 lecciones

| Curso | Lecciones | Objetivo |
|---|---:|---|
| Touch Typing | 10 | Control completo teclado |
| Neovim | 9 | Edición estructural sin mouse |
| Python | 7 | Pensamiento computacional |
| Go | 7 | Tipada, concurrente y sistemas |
| **Total** | **33** | |

```
Touch Typing → Neovim ─┬─→ Python
                       └─→ Go
```

### Sesión diaria (§13) — composición automática, no solo “continuar lección”

```
5 min:  Warmup 2 + Current 3
10 min: Warmup 2 + Recall 3 + Current 5
15/20/30 min: Warmup 2 + Recall 3 + Current 8 + Weak 3 + Application 5 + Challenge 3
```

---

## 3. Detalle Touch Typing (10) — cada una con Sessions A-E

| ID | Título | Sesiones (A-D/E) | Bloques clave |
|---|---|---|---|
| `typing-es-01` | Home Row derecha jklñ | A Discover (position+isolation) · B Pattern/Rolling · C Control visual 3 niveles · D Ritmo · E Mastery 3 eval | `jjjj kkkk` → `jklñ ñlkj` → sin teclado visual → `j k j k` |
| `typing-es-02` | Home Row izquierda asdf | A Recall+Position · B Pattern/Rolling · C Combination `ala sala falda` · D Zen · E Mastery | `aaaa` → `asdf fdsa` → `sala falda` |
| `typing-es-03` | Ambas manos + ritmo | A Recall · B Alternancia `fj dk sl añ` · C Rolls `sdf jkl` + Words · D Zen 30-60s · E Mastery | `fjfj dkdk` → `sala falda ajada` |
| `typing-es-04` | Fila sup izq qwert | A Recall+Concept vertical · B Isolation+Vertical pairs · C Patterns+Words `fresa` · D Zen · E Mastery | `aq sw de fr ft` → `qwer` → `fresa` |
| `typing-es-05` | Fila sup der yuiop | A Position · B Vertical · C Words `puerta teclado editor` + frases · D Mastery | `jy ju ki lo ñp` → `qwerty yuiop` |
| `typing-es-06` | Fila inferior zxcv+m | A Isolation+Vertical · B Patterns+Three-row · C Words `zona linux vim`+sentence · D Mastery | `az sx dc fv` → `zxcv bnm` → `fr fv de dc` |
| `typing-es-07` | Fluidez alfabética (sin nuevas teclas, la más larga) | A Same finger+Alternancia · B Rolls · C Bigramas/trigramas · D Palabras+Frases · E Párrafos 80→300+Zen 60/120+Mastery texto no visto | `de la el en que por` → `que ent est` → párrafos |
| `typing-es-08` | Shift, mayúsculas y números | A Mód Shift `Marco Linux Python` · B Frases · C Números `12345 67890` · D Datos reales `192.168.1.1 10.10.0.130 8080` → `Server 10.10.0.130:8080` | Shift opuesto |
| `typing-es-09` | Símbolos programación (extensa) | A `() [] {} <>` + `'"`` ` · B `+ - * / = == !=` + `, . : ;` · C Terminal `/ \|` → `cd /home` · D Código Python `name = "NeoType"` + Go `func main` + Challenge · E Mastery | Grupos progresivos |
| `typing-es-10` | Fluidez completa (integración) | A Natural+Technical `server repository` · B Terminal `git status` + Paths · C Python `def greet` + Go `func add` · D Final challenge combo ≥95% | Integra todo |

---

## 4. Neovim (9) — progreso `VERBO + OBJETO`

| ID | Título | Atajos protagonistas | Labs/Challenge |
|---|---|---|---|
| `neovim-es-01` | Modos Normal/Insert | `i a I A Esc` | hola → hola mundo con mínimo cambio modo |
| `neovim-es-02` | h/j/k/l | `h j k l` | Maze horizontal→vertical→diagonal→obstáculo, sin flechas NV004 |
| `neovim-es-03` | Palabras w/b/e | `w b e` + `dw` (primer operador) | Borra 1/2 palabras |
| `neovim-es-04` | Líneas 0 ^ $ | `0 ^ $` + `d$ c$ y$` | `server_name example.com;` |
| `neovim-es-05` | Documento gg G { } | `gg G { }` + `Ctrl-d/u` | README/config/logs sin scroll |
| `neovim-es-06` | Edición x r u | `x r u Ctrl-r` | `dokcer→docker`, 10 errores sin Insert |
| `neovim-es-07` | Operators d/c/y | `dw de d$ cw ciw diw yiw` + `iw aw` | Generador: “elimina/cambia/copia” sin decir comando |
| `neovim-es-08` | Líneas dd yy p | `dd yy p P` + `2w 3j 5dd` | Reorganizar A B C D |
| `neovim-es-09` | Search / . | `/ ? n N . * #` | `localhost→10.10.0.130` x3 vía `/ ciw n .` — evaluación final solo objetivos |

---

## 5. Python (7) — cada lección contiene EXPLAIN → PREDICT → TYPE → RUN → BREAK → FIX → BUILD (§10)

| ID | Título | Bloques destacados | Proyecto |
|---|---|---|---|
| `python-es-01` | Valores, variables y expresiones | `int/float/str/bool/None`, Predict `x+y*2`, Break `age="30"+5` | System Card `hostname/ip/port/online` |
| `python-es-02` | Control de flujo | `if/elif/else and/or/not for range while`, Access/Server status | FizzBuzz + Port Scanner `[22,80,443,5173]` |
| `python-es-03` | Funciones | `def/return/scope`, descomposición `read/validate/calc/display` | Cotizador `precio/cantidad/descuento/IVA→total` |
| `python-es-04` | Colecciones | `list/dict/tuple/set`, nested `devices=[{name,ip,online}]` | Mini inventory `add/remove/find/list` |
| `python-es-05` | Files, JSON y errores | `with open json.load/dump try/except/finally`, Failure inexistente/JSON/permisos | `devices.json` persistente |
| `python-es-06` | Testing y debugging | `pytest`, 5 errores `syntax/type/logic/off-by-one/condition` | 2 passing 3 failing → 5 passing |
| `python-es-07` | CLI Project | `argparse modules/imports`, `python app.py list/add/remove` | **NeoInventory CLI** `add/list/show/update/delete` integra todo |

---

## 6. Go (7) — de “¿cómo programo?” a “¿cómo diseño software explícito y confiable?”

| ID | Título | Conceptos | Proyecto |
|---|---|---|---|
| `go-es-01` | Variables, tipos y funciones | `package main var := string/int/float64/bool func add` | Calculadora CLI |
| `go-es-02` | Structs y métodos | `type Device struct {Name,IP} func (d Device) Display()` | Device/Server/Service |
| `go-es-03` | Slices, maps y ranges | `[]string map[string]int for _,d:=range` | Inventario memoria |
| `go-es-04` | Errors | `value,err:=op() if err!=nil`, `errors.New fmt.Errorf wrapping` | Leer config archivo |
| `go-es-05` | Testing | `func TestAdd(t *testing.T)` + table driven | Completar desde tests |
| `go-es-06` | Goroutines y channels | `go checkServer() make(chan string)` | Concurrent Service Checker `server-01..04` |
| `go-es-07` | HTTP Service | `HandleFunc ListenAndServe json.NewEncoder` endpoints `GET /health /devices POST /devices` | **NeoInventory API** `cmd/internal/device/service/storage/http` |

---

## 7. Sistema de dominio y repetición

- **Estados:** `locked → available → in_progress → review → mastered`. `mastered` ≠ solo `completed`: puede volver a `review` si decae.
- **Mastery 0–100:** 0–20 introduced, 21–40 learning, 41–60 developing, 61–80 proficient, 81–95 strong, 96–100 automatic.
- **Evaluación:** 3 PASS ≥95% (≤3 errores críticos) — pueden ser en sesiones diferentes.
- **Repetition:** +1/3/7/14/30 días; recall insertada dentro de lecciones posteriores (ej. lección símbolos pide `asdf jklñ`).
- **Motores:** `adaptive/mastery.ts` (canUnlock, decay, nextReview, difficulty 1..5), `typing/generator.ts` (generateTypingExercise respeta unlockedKeys + weakBigrams), `storage/progress.ts` (v3 con skillStates/errorStats, `dueReviews()`, `weakSkills()`).

---

## 8. Sistema de errores (§7,16)

Clasifica por: tecla, bigram, mano, dedo, movimiento, comando, concepto, símbolo → tipo `motor/memory/concept/syntax/logic/navigation/attention`. Ejemplo ` {target:"r",mistypedAs:"t",count:14,context:"typing",movement:"f-r"}` → genera `fr rf fra fer fre` sin repetir lección.

Métricas typing: `accuracy correctKeys incorrectKeys correctedErrors WPM rawWPM consistency duration` + `accuracyByKey/Finger/Hand/Bigram`. Vim: `taskSuccess commandsUsed keystrokes optimalKeystrokes efficiency`. Code: `attempts runCount syntaxErrors testFailures`.

---

## 9. Cómo se ve el avance

```
Home responde: ¿Dónde estoy? → CONTINUAR (Typing 06 S-C) · ¿Qué debo practicar? → REVISIÓN R/T 89% 2min / PRÓXIMO Fluidez · ¿Por qué? → motor prioriza habilidad crítica
Curso: 6/10 lessons · 42 skills mastered · 4 developing · Current: Fila inferior · Needs work: R/T movement
Lección: Typing 04 · Session 2/5 · bloques 1..n + keyboard (ámbar=conjunto, negro=objetivo, punto=dedo) + accuracy/pass/mastery
```

Skill Graph: `home-left ─┐ → both-hands → top-row → bottom-row → symbols → vim` y `variables → conditions → loops → functions → collections → files → testing → project` permite añadir Git/Shell/Docker sin reescribir.

*Archivos:* `src/domains/lesson.ts` (§23-26), `src/content/courses/*` (33 lecciones con sessions), `src/storage/progress.ts` (v3), `src/engines/{typing,adaptive,vim}`, `src/features/course/LessonRunner.tsx` (sesiones+bloques), `src/app/Home.tsx` (3 preguntas).

