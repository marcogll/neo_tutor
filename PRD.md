# NeoType

## Documento de requisitos del producto

Aprendizaje de mecanografía táctil y Neovim con expansión futura a Python y Go

**Versión** 1.0

**Estado** Definición para diseño y desarrollo

**Plataforma** Aplicación web React ejecutable en Docker

**Idioma inicial** Español con soporte estructural para inglés

**Fecha** 10 de septiembre de 2026

**Decisión de alcance** El MVP desarrolla memoria muscular, precisión y dominio operativo de Neovim. Los tutores de Python y Go pertenecen a una fase posterior, pero comparten desde el inicio el modelo de lecciones, evaluación y progreso.

## 1 Resumen ejecutivo

NeoType será una aplicación web local y desplegable que enseña mecanografía táctil con los diez dedos y uso práctico de Neovim mediante ejercicios progresivos, sesiones Zen y retos verificables. El sistema partirá de la posición física del teclado del usuario y medirá patrones motores, no solo palabras por minuto.

La primera experiencia estará optimizada para MacBook Air M1, contemplando teclados ANSI e ISO y distribuciones US, español y latinoamericano. Debido a que los navegadores no revelan con certeza el modelo físico del teclado, la aplicación combinará detección técnica con una calibración guiada.

La arquitectura reservará un dominio de aprendizaje de programación para incorporar después tutores de Python y Go. Esa expansión reutilizará el motor de cursos, el editor, la evaluación, la repetición adaptativa y el perfil de progreso, sin formar parte del criterio de salida del MVP.

## 2 Problema

- Los entrenadores de mecanografía suelen priorizar velocidad y texto aleatorio, sin enseñar patrones de movimiento, postura ni retorno a la fila central.

- Los tutoriales de Neovim explican comandos de forma aislada, pero no construyen memoria muscular ni evalúan eficiencia.

- Los usuarios de Mac pueden tener layouts físicos y lógicos diferentes; una representación incorrecta rompe la instrucción por dedos.

- Aprender mecanografía, Neovim y programación en herramientas separadas fragmenta el progreso y duplica conceptos.

## 3 Visión del producto

Convertir la práctica del teclado en un sistema de entrenamiento motor y cognitivo: primero precisión y ritmo; después velocidad; luego edición eficiente con Neovim; finalmente resolución de problemas reales en Python y Go.

## 4 Objetivos y resultados

| **Objetivo**        | **Resultado verificable**                                                                             |
|---------------------|-------------------------------------------------------------------------------------------------------|
| Mecanografía táctil | Escribir sin mirar el teclado con uso correcto de dedos y precisión sostenida de 95 por ciento o más. |
| Ritmo               | Reducir la variación entre pulsaciones antes de aumentar la velocidad.                                |
| Neovim              | Resolver tareas de navegación y edición sin mouse ni flechas, usando secuencias eficientes.           |
| Personalización     | Representar correctamente el teclado físico y lógico del usuario mediante calibración.                |
| Continuidad         | Conservar progreso local, funcionar sin conexión y permitir exportación.                              |
| Expansión           | Añadir Python y Go sobre el mismo sistema de contenidos y evaluación sin rehacer la arquitectura.     |

## 5 Fuera de alcance inicial

- Emular Neovim completo o ejecutar sus complementos.

- Sincronización multiusuario, comunidad, rankings o competición pública.

- Tutor con inteligencia artificial generativa en el MVP.

- Ejecución remota de código Python o Go durante las primeras versiones.

- Identificación garantizada del modelo exacto del equipo desde el navegador.

## 6 Usuarios y escenarios

| **Perfil**                    | **Necesidad**                          | **Escenario principal**                                             |
|-------------------------------|----------------------------------------|---------------------------------------------------------------------|
| Principiante de mecanografía  | Aprender posiciones y dedos desde cero | Sesiones guiadas de letras, patrones, sílabas y frases.             |
| Usuario técnico               | Escribir código con precisión          | Práctica de símbolos, nombres de variables y estructuras de código. |
| Principiante de Neovim        | Comprender modos y movimientos         | Retos dentro de un editor simulado con ayuda contextual.            |
| Usuario intermedio            | Reducir pulsaciones y malos hábitos    | Retos evaluados contra una solución eficiente.                      |
| Futuro estudiante Python o Go | Aprender sintaxis y razonamiento       | Lecciones ejecutables dentro del mismo entorno.                     |

## 7 Principios de producto

1. Precisión antes que velocidad. La app no premia escribir rápido con errores.

2. Posición física separada del carácter. Se registra KeyboardEvent.code y KeyboardEvent.key.

3. Una habilidad por incremento. Cada lección limita teclas, movimientos y comandos.

4. Transferencia práctica. Los patrones terminan en lenguaje, código o una operación real de edición.

5. Retroalimentación proporcional. La práctica guiada corrige de inmediato; el modo Zen evita interrupciones.

6. Datos locales por defecto. La cuenta y la nube son capacidades posteriores.

## 8 Alcance por versión

| **Versión** | **Alcance**                                                             | **Estado**       |
|-------------|-------------------------------------------------------------------------|------------------|
| MVP 0.1     | Calibración, teclado visual, motor de captura y diagnóstico inicial     | Primera entrega  |
| MVP 0.2     | Curso de mecanografía, sesiones Zen y métricas adaptativas              | MVP              |
| MVP 0.3     | Simulador Neovim, lecciones y retos combinados                          | MVP completo     |
| 1.0         | PWA, contenido ampliado, importación y exportación, accesibilidad final | Producto estable |
| 2.0         | Perfil sincronizado y autoría de cursos                                 | Posterior        |
| 3.0         | Tutor de Python                                                         | Futuro           |
| 3.5         | Tutor de Go                                                             | Futuro           |

## 9 Flujo principal

1. El usuario abre la aplicación y el sistema intenta inferir plataforma y layout lógico.

2. La calibración solicita teclas críticas y confirma ANSI o ISO, idioma y modificadores.

3. Un diagnóstico breve mide fila central, coordinación, precisión y hábitos.

4. La app genera una ruta inicial y abre una lección de una sola habilidad.

5. El usuario completa bloques de posición, movimiento, patrón, lenguaje y práctica Zen.

6. El motor actualiza dominio por tecla, dedo, transición y comando.

7. Al dominar fundamentos, se habilitan ejercicios combinados con Neovim.

## 10 Navegación y pantallas

| **Pantalla**       | **Contenido**                                                | **Acción primaria** |
|--------------------|--------------------------------------------------------------|---------------------|
| Inicio             | Continuar, precisión, ritmo, nivel y debilidades             | Continuar sesión    |
| Calibración        | Teclado visual, teclas críticas y layout propuesto           | Confirmar teclado   |
| Diagnóstico        | Pruebas cortas sin penalización                              | Crear ruta          |
| Lección            | Objetivo, ejercicio, dedos, teclado y ayuda                  | Completar bloque    |
| Zen                | Una línea central, interfaz mínima y retroalimentación tenue | Mantener ritmo      |
| Laboratorio Neovim | Editor, modo, objetivo e historial                           | Resolver reto       |
| Progreso           | Mapas de calor y evolución por habilidad                     | Revisar debilidades |
| Ajustes            | Layout, sonido, tema, accesibilidad y datos                  | Personalizar        |

## 11 Calibración del teclado

La aplicación no afirmará detectar el modelo exacto. Propondrá una configuración mediante señales disponibles y pedirá confirmación visual. La configuración resultante se guardará como un perfil de teclado versionado.

### 11.1 Señales técnicas

- KeyboardEvent.code para posición física.

- KeyboardEvent.key para carácter producido.

- navigator.keyboard.getLayoutMap cuando esté disponible.

- Plataforma reportada por el navegador solo como pista no concluyente.

- Presencia y posición de teclas como Enter, Backslash, IntlBackslash, Meta y Alt.

### 11.2 Secuencia de calibración

| **Paso** | **Entrada**                 | **Decisión**                             |
|----------|-----------------------------|------------------------------------------|
| 1        | A, Z y Q                    | Distribución base y consistencia QWERTY. |
| 2        | Ñ o punto y coma            | Español frente a US.                     |
| 3        | Tecla menor que y mayor que | Indicador ISO mediante IntlBackslash.    |
| 4        | Command y Option            | Modificadores Mac.                       |
| 5        | Confirmación visual         | Aceptar o editar la propuesta.           |

### 11.3 Requisitos

- KB 001 La aplicación debe incluir Mac ANSI US, Mac ISO español y Mac ISO latinoamericano.

- KB 002 Debe permitir reasignar etiquetas sin cambiar la posición física.

- KB 003 Debe conservar perfiles personalizados y restaurar valores predeterminados.

- KB 004 Debe reconocer teclados externos como una configuración separada.

- KB 005 Ninguna lección debe iniciar si sus teclas objetivo no existen en el perfil activo.

## 12 Motor de mecanografía

El motor procesa cada pulsación como una transición entre dos estados físicos. Mantiene estadísticas por tecla, dedo, mano, fila, bigrama, trigrama y patrón motor. La velocidad es secundaria hasta lograr estabilidad.

### 12.1 Progresión curricular

| **Nivel** | **Contenido**                           | **Criterio de dominio**                             |
|-----------|-----------------------------------------|-----------------------------------------------------|
| 1         | Fila central, postura y retorno         | 95 por ciento de precisión y uso correcto de dedos. |
| 2         | Fila superior y movimientos verticales  | Tres ejercicios aprobados consecutivos.             |
| 3         | Fila inferior y saltos de fila          | Latencia estable sin desplazar la mano.             |
| 4         | Mayúsculas, números y puntuación        | Uso correcto del modificador opuesto.               |
| 5         | Bigrama, trigrama y palabras frecuentes | Ritmo estable en lenguaje natural.                  |
| 6         | Símbolos y fragmentos de código         | Precisión mínima de 95 por ciento.                  |
| 7         | Texto libre y pruebas                   | Rendimiento sostenible en sesiones largas.          |

### 12.2 Tipos de patrón

| **Patrón**          | **Ejemplo**    | **Objetivo**              |
|---------------------|----------------|---------------------------|
| Repetición          | ffff jjjj      | Control y retorno         |
| Misma fila          | asdf jklñ      | Movimiento lateral        |
| Vertical            | fr fv ju jn    | Subir y bajar             |
| Alternancia         | fj dk sl       | Ritmo entre manos         |
| Rodamiento interior | sdf jkl        | Fluidez hacia el centro   |
| Rodamiento exterior | fds lkj        | Fluidez hacia afuera      |
| Mismo dedo          | fr ft          | Alcance sin mover la mano |
| Bigrama             | de en la es    | Automatización del idioma |
| Código              | () {} \[\] =\> | Precisión técnica         |

### 12.3 Estructura de una lección

1. Posición: presentación de teclas, dedos y postura.

2. Movimiento aislado: pulsaciones lentas sin presión de velocidad.

3. Patrones: pares y secuencias controladas.

4. Sílabas y palabras: contenido generado solo con teclas desbloqueadas.

5. Frase Zen: aplicación sin reloj visible.

6. Evaluación: precisión, ritmo y movimiento objetivo.

### 12.4 Requisitos

- TY 001 El contenido debe respetar las teclas desbloqueadas en cada lección.

- TY 002 Cada error debe conservar tecla esperada, tecla recibida, tiempo y contexto.

- TY 003 El sistema debe medir latencia entre pulsaciones y variación del ritmo.

- TY 004 Debe admitir español e inglés mediante paquetes de contenido.

- TY 005 Debe distinguir exactitud física de exactitud del carácter.

- TY 006 El usuario debe poder desactivar Backspace en evaluaciones específicas.

## 13 Modo Zen

El modo Zen elimina indicadores que alteran el ritmo durante la ejecución. Presenta una línea centrada, un cursor claro y retroalimentación tenue. Las métricas completas aparecen al terminar.

### 13.1 Formatos

| **Formato** | **Ejemplo**                         | **Uso**                       |
|-------------|-------------------------------------|-------------------------------|
| Letras      | f j f j                             | Coordinación básica           |
| Patrones    | fj dk sl añ                         | Alternancia                   |
| Sílabas     | la de en un                         | Transición a lenguaje         |
| Frases      | la precisión construye la velocidad | Ritmo continuo                |
| Código      | const ritmo = crearPractica();      | Símbolos técnicos             |
| Neovim      | Cambia lento por estable            | Edición orientada a objetivos |

### 13.2 Duraciones

- Sesión de 5 minutos: calentamiento, patrón específico y frase.

- Sesión de 10 minutos: fila central, debilidad, lenguaje y práctica libre.

- Sesión de 20 minutos: diagnóstico, técnica, lenguaje, Neovim y enfriamiento.

### 13.3 Requisitos

- ZN 001 No mostrar WPM ni cronómetro durante la sesión por defecto.

- ZN 002 Permitir ocultar teclado, manos, ayudas y correcciones.

- ZN 003 No interrumpir la línea por un error; registrar el evento y continuar.

- ZN 004 Ofrecer tema oscuro, claro y cálido con contraste accesible.

## 14 Simulador Neovim

El MVP usará un motor determinista de estados y operaciones sobre texto. No intentará ejecutar Neovim real en el navegador. CodeMirror 6 podrá proporcionar visualización y modelo de texto, mientras el motor propio controla comandos y evaluación.

### 14.1 Contenido

| **Módulo**        | **Comandos**                     |
|-------------------|----------------------------------|
| Modos             | Normal, Insert, Visual y Command |
| Movimiento básico | h j k l                          |
| Palabras          | w b e                            |
| Líneas            | 0 ^ \$                           |
| Documento         | gg G { }                         |
| Edición           | i a o x r                        |
| Operadores        | d c y combinados con movimientos |
| Edición compuesta | dw ciw dd yy p                   |
| Búsqueda          | / n N                            |
| Historial         | . u Ctrl r                       |

### 14.2 Evaluación

- Resultado final del texto.

- Secuencia de teclas utilizada.

- Número de pulsaciones comparado con una referencia eficiente.

- Errores de modo, uso innecesario de movimientos unitarios y uso de flechas.

- Tiempo hasta la primera acción y tiempo total.

La eficiencia se calcula como pulsaciones óptimas divididas entre pulsaciones utilizadas, multiplicado por cien. Las rutas alternativas correctas deben poder declararse en la definición del reto.

### 14.3 Requisitos

- NV 001 Debe existir un indicador persistente del modo actual.

- NV 002 Cada reto debe declarar estado inicial, estado esperado y soluciones aceptadas.

- NV 003 El usuario debe poder solicitar una pista incremental.

- NV 004 Las flechas deben poder bloquearse o penalizarse según la lección.

- NV 005 El motor debe producir un historial reproducible de acciones.

## 15 Motor adaptativo y progreso

Cada habilidad mantiene un dominio entre cero y uno. El dominio aumenta por precisión y consistencia, disminuye por errores recientes y decae levemente con el tiempo para activar repetición espaciada.

### 15.1 Señales

| **Dimensión** | **Datos**                                    |
|---------------|----------------------------------------------|
| Tecla         | Aciertos, errores, latencia y correcciones   |
| Dedo          | Precisión, retraso y carga relativa          |
| Transición    | Bigrama físico, dirección y tiempo           |
| Ritmo         | Media, mediana, desviación y pausas          |
| Neovim        | Comando, modo, contexto, eficiencia y pistas |
| Retención     | Última práctica, repeticiones y recuperación |

### 15.2 Reglas iniciales

- Desbloquear una habilidad con precisión igual o superior a 95 por ciento, uso correcto de dedos igual o superior a 90 por ciento y tres ejercicios aprobados.

- No aumentar dificultad si la velocidad sube pero la precisión disminuye.

- Priorizar patrones débiles sin repetir más de 40 por ciento del mismo contenido en una sesión.

- Separar resultado de práctica y resultado de evaluación.

### 15.3 Métricas

| **Área**             | **Métricas**                                                              |
|----------------------|---------------------------------------------------------------------------|
| Mecanografía         | WPM bruto y neto, precisión, consistencia, Backspace y errores por tecla. |
| Biomecánica inferida | Dedo recomendado, mano, fila, dirección y desplazamiento.                 |
| Neovim               | Objetivos, pulsaciones, eficiencia, errores de modo, flechas y pistas.    |
| Curso                | Lecciones aprobadas, retención, tiempo activo y dominio por habilidad.    |
| Privacidad           | Todo el análisis permanece local en el MVP.                               |

## 16 Tutor futuro de Python

El tutor de Python será una expansión posterior. Su objetivo será enseñar sintaxis, lectura de código, resolución de problemas y uso del editor sin convertir el MVP en una plataforma genérica de cursos.

### 16.1 Ruta prevista

1. Expresiones, variables y tipos básicos.

2. Condicionales y ciclos.

3. Funciones, parámetros y retorno.

4. Colecciones y comprensión de datos.

5. Archivos, errores y módulos.

6. Pruebas y depuración.

7. Proyectos pequeños ejecutables.

### 16.2 Tipos de ejercicio

- Predicción de salida antes de ejecutar.

- Completar una expresión o bloque limitado.

- Corregir un error con comandos Neovim específicos.

- Escribir una solución con restricciones de sintaxis.

- Ejecutar pruebas visibles y ocultas dentro de un entorno aislado.

### 16.3 Requisitos arquitectónicos reservados

- PG 001 El modelo Lesson debe admitir contenido, código inicial, pruebas y capacidades de ejecución.

- PG 002 La evaluación de código debe usar un servicio aislado y límites estrictos de tiempo, memoria y red.

- PG 003 La interfaz debe separar diagnóstico del compilador, prueba fallida y explicación pedagógica.

- PG 004 La ejecución remota no se habilitará hasta completar una revisión de seguridad.

## 17 Tutor futuro de Go

El tutor de Go reutilizará la infraestructura de Python, pero tendrá una ruta propia centrada en tipos, manejo explícito de errores, paquetes, herramientas del lenguaje y concurrencia.

### 17.1 Ruta prevista

1. Variables, tipos y funciones.

2. Structs, métodos e interfaces.

3. Slices, maps y punteros.

4. Errores y control de flujo.

5. Paquetes, módulos y pruebas.

6. Goroutines, channels y contexto.

7. Servicio HTTP pequeño.

### 17.2 Requisitos reservados

- GO 001 El motor debe soportar formato gofmt como parte de la evaluación.

- GO 002 Las pruebas deben ejecutarse en un entorno aislado sin acceso de red por defecto.

- GO 003 Las lecciones deben distinguir error de compilación, fallo de prueba y condición de carrera.

- GO 004 Los ejercicios de concurrencia deben establecer límites deterministas cuando sea posible.

## 18 Modelo de contenido común

Typing, Neovim, Python y Go serán dominios distintos sobre un contrato común. Esto permite versionar lecciones, registrar prerrequisitos y compartir el sistema de progreso sin forzar una evaluación idéntica.

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

## 19 Requisitos funcionales transversales

| **ID** | **Requisito**                                                               | **Prioridad** |
|--------|-----------------------------------------------------------------------------|---------------|
| FR 001 | Continuar automáticamente desde la última actividad incompleta.             | Must          |
| FR 002 | Guardar progreso local después de cada bloque.                              | Must          |
| FR 003 | Exportar e importar perfil y progreso en JSON.                              | Must          |
| FR 004 | Permitir reiniciar una habilidad sin borrar todo el perfil.                 | Should        |
| FR 005 | Versionar contenido y conservar compatibilidad de resultados.               | Must          |
| FR 006 | Funcionar sin conexión después de la primera carga.                         | Should        |
| FR 007 | Ofrecer atajos completos sin mouse.                                         | Must          |
| FR 008 | Permitir paquetes de idioma y layouts adicionales.                          | Must          |
| FR 009 | Registrar consentimiento separado para telemetría futura.                   | Must          |
| FR 010 | Mostrar una explicación reproducible de por qué se recomienda una práctica. | Should        |

## 20 Requisitos no funcionales

| **Área**             | **Requisito**                                                                                             |
|----------------------|-----------------------------------------------------------------------------------------------------------|
| Rendimiento          | Respuesta visual a pulsaciones menor a 50 ms en un equipo objetivo sin carga anormal.                     |
| Compatibilidad       | Últimas dos versiones estables de Chrome, Edge, Firefox y Safari; degradación controlada de Keyboard API. |
| Accesibilidad        | WCAG 2.2 AA, navegación por teclado, foco visible, reducción de movimiento y temas de alto contraste.     |
| Disponibilidad       | El MVP debe funcionar localmente aun sin backend.                                                         |
| Persistencia         | Migraciones de IndexedDB sin pérdida silenciosa de progreso.                                              |
| Seguridad            | Sin ejecución de código arbitrario en el cliente del MVP; CSP restrictiva y dependencias auditadas.       |
| Privacidad           | Sin capturar texto fuera de las superficies de práctica y sin telemetría por defecto.                     |
| Mantenibilidad       | Motores de dominio desacoplados de los componentes visuales y cubiertos por pruebas unitarias.            |
| Despliegue           | Imagen Docker reproducible, usuario no root en producción y healthcheck HTTP.                             |
| Internacionalización | Textos de interfaz y contenido separados, con español como paquete inicial.                               |

## 21 Arquitectura técnica

| **Capa**         | **Tecnología**                | **Responsabilidad**                                 |
|------------------|-------------------------------|-----------------------------------------------------|
| Interfaz         | React y TypeScript            | Pantallas, componentes, navegación y accesibilidad. |
| Construcción     | Vite                          | Desarrollo y bundle estático.                       |
| Estado           | Zustand                       | Sesión activa y preferencias.                       |
| Datos            | IndexedDB con Dexie           | Progreso, eventos, contenido y migraciones.         |
| Editor           | CodeMirror 6                  | Superficie de texto y selección.                    |
| Motores          | TypeScript puro               | Typing, teclado, adaptación y Neovim.               |
| Pruebas          | Vitest y Playwright           | Unidad, integración y flujos completos.             |
| Entrega          | Nginx en Docker               | Aplicación estática y rutas SPA.                    |
| Futuro backend   | Fastify, PostgreSQL y Drizzle | Cuenta, sincronización y contenido remoto.          |
| Futuro ejecución | Workers aislados              | Python y Go con límites de recursos.                |

### 21.1 Organización propuesta

```text
src/
├── app/          router, providers y shell
├── components/   teclado, manos, editor y gráficos
├── features/     calibración, typing, neovim, cursos y progreso
├── engines/      keyboard, typing, adaptive y vim
├── domains/      typing, neovim, python y go
├── content/      layouts, idiomas, cursos y retos
├── storage/      esquema, repositorios y migraciones
├── workers/      cálculo de métricas
└── tests/        fixtures y pruebas de integración
```

### 21.2 Decisiones

- Aplicación local primero para reducir infraestructura y proteger los datos de pulsación.

- Motor Neovim propio y determinista en lugar de emulación completa.

- Contenido separado del código para permitir autoría y traducción.

- Event sourcing ligero para reproducir sesiones y recalcular métricas.

- Dominios futuros declarados desde el esquema, sin habilitar ejecución de código anticipadamente.

## 22 Modelo de datos

| **Entidad**        | **Campos principales**                                             |
|--------------------|--------------------------------------------------------------------|
| UserProfile        | id, idioma, preferencias, fecha de creación                        |
| KeyboardProfile    | id, tipo físico, layout lógico, plataforma, teclas y modificadores |
| Course             | id, dominio, versión, idioma y módulos                             |
| Lesson             | id, dominio, objetivos, prerrequisitos, bloques y evaluación       |
| PracticeSession    | id, lección, inicio, fin, modo y resumen                           |
| KeystrokeEvent     | code, key, esperado, tiempo, modificadores y contexto              |
| SkillState         | habilidad, dominio, última práctica, intervalo y dificultad        |
| VimAttempt         | estado inicial, acciones, resultado, eficiencia y pistas           |
| CodeAttempt futuro | lenguaje, código, pruebas, resultado y diagnóstico                 |

## 23 Privacidad y seguridad

- La aplicación solo escucha eventos mientras una superficie de práctica tiene foco.

- No debe almacenar texto escrito en otros campos, páginas o aplicaciones.

- Los eventos detallados permanecen en el dispositivo durante el MVP.

- La exportación exige una acción explícita y produce un archivo legible.

- La eliminación de datos requiere confirmación y borra perfil, sesiones y eventos.

- La futura ejecución de Python y Go ocurrirá fuera del contenedor web, en entornos efímeros sin red y con cuotas.

## 24 Accesibilidad

- Uso completo sin mouse, excepto la calibración visual cuando sea necesario.

- Foco visible que no interfiera con la interpretación de la tecla objetivo.

- No depender exclusivamente del color para errores, dedos o estados.

- Etiquetas para lectores de pantalla y resumen textual del teclado.

- Modo de movimiento reducido y control de sonidos.

- Escalado de interfaz hasta 200 por ciento sin pérdida funcional.

## 25 Docker y operación

```yaml
services:
  neotype:
    build: .
    restart: unless-stopped
    ports:
      - "8080:8080"
    read_only: true
    security_opt:
      - no-new-privileges:true
    tmpfs:
      - /tmp
```

- Construcción multi-stage con Node 22 Alpine y servidor web final mínimo.

- Proceso final sin privilegios de root.

- Healthcheck sobre una ruta dedicada.

- Configuración mediante variables públicas de build solo cuando sea necesario.

- Despliegue compatible con Docker Compose y Coolify.

## 26 Estrategia de pruebas

| **Nivel**      | **Cobertura**                                                         |
|----------------|-----------------------------------------------------------------------|
| Unidad         | Cálculo de WPM, precisión, ritmo, dominio, layouts y comandos Neovim. |
| Propiedades    | Secuencias aleatorias para invariantes del editor y transiciones.     |
| Integración    | Captura de eventos, persistencia y actualización de progreso.         |
| E2E            | Calibración, primera lección, sesión Zen, reto Neovim y exportación.  |
| Compatibilidad | Layouts Mac ANSI e ISO en navegadores objetivo.                       |
| Visual         | Teclado, manos, estados de error, responsive y temas.                 |
| Accesibilidad  | Auditoría automatizada y recorridos manuales por teclado.             |

## 27 Criterios de aceptación del MVP

1. Un usuario con MacBook puede completar la calibración y corregir el layout propuesto.

2. La representación visual distingue tecla física, carácter y dedo recomendado.

3. Las lecciones generan contenido solo con habilidades desbloqueadas.

4. El motor registra precisión, ritmo, transición, dedo y corrección.

5. El modo Zen funciona sin métricas visibles y muestra análisis al finalizar.

6. El usuario completa una ruta básica de Neovim desde modos hasta operaciones compuestas.

7. Los retos comparan resultado y secuencia, aceptando alternativas declaradas.

8. El progreso persiste después de cerrar y abrir el navegador.

9. La exportación e importación recuperan el perfil sin pérdida verificable.

10. La aplicación funciona desde una imagen Docker documentada y supera el healthcheck.

## 28 Indicadores de calidad del producto

| **Indicador**                  | **Meta inicial**                                  |
|--------------------------------|---------------------------------------------------|
| Finalización de calibración    | 90 por ciento de sesiones iniciadas               |
| Precisión de layout confirmada | 99 por ciento después de confirmación del usuario |
| Latencia de retroalimentación  | Menor a 50 ms en dispositivo objetivo             |
| Precisión de usuarios activos  | Tendencia sostenida hacia 95 por ciento           |
| Sesiones sin pérdida de datos  | 100 por ciento en pruebas controladas             |
| Accesibilidad                  | Sin fallos críticos WCAG 2.2 AA                   |

## 29 Riesgos y mitigaciones

| **Riesgo**                             | **Impacto**               | **Mitigación**                                            |
|----------------------------------------|---------------------------|-----------------------------------------------------------|
| Detección incompleta del teclado       | Instrucciones incorrectas | Calibración guiada y edición manual.                      |
| Diferencias entre navegadores          | Captura inconsistente     | Matriz de compatibilidad y degradación explícita.         |
| Simulador Neovim demasiado amplio      | Retraso del MVP           | Subconjunto curricular con motor determinista.            |
| Obsesión por WPM                       | Mala técnica              | Bloquear progresión por precisión y ritmo.                |
| Contenido artificial                   | Baja transferencia        | Pasar de patrón a lenguaje y código real.                 |
| IndexedDB corrupta o migración fallida | Pérdida de progreso       | Exportación, migraciones probadas y copias versionadas.   |
| Ejecución futura de código             | Riesgo de seguridad       | Servicio aislado, sin red y con cuotas.                   |
| Alcance Python y Go anticipado         | Producto disperso         | Mantenerlos fuera del MVP y reutilizar contratos comunes. |

## 30 Plan de implementación

| **Fase** | **Entregable**                                         | **Salida**               |
|----------|--------------------------------------------------------|--------------------------|
| 0        | Repositorio, convenciones, CI, Docker y sistema visual | Base reproducible        |
| 1        | Eventos de teclado, layouts y calibración Mac          | Perfil confiable         |
| 2        | Teclado visual, manos y diagnóstico                    | Ruta inicial             |
| 3        | Motor typing, contenido básico y métricas              | Curso funcional          |
| 4        | Modo Zen y sistema adaptativo                          | Práctica personal        |
| 5        | Motor Neovim y laboratorio                             | Edición verificable      |
| 6        | Integración, PWA, exportación y accesibilidad          | MVP estable              |
| 7        | Backend opcional y sincronización                      | Cuenta multi dispositivo |
| 8        | Runner seguro y tutor Python                           | Programación fase uno    |
| 9        | Runner Go y tutor Go                                   | Programación fase dos    |

## 31 Orden recomendado del backlog

1. Definir esquema JSON de layouts y crear fixtures Mac ANSI US, ISO español e ISO latinoamericano.

2. Implementar captura de code, key y modificadores con un visualizador de diagnóstico.

3. Construir calibración y persistencia del KeyboardProfile.

4. Crear teclado SVG o CSS responsivo y asignación de dedos.

5. Implementar SessionRecorder y cálculos deterministas.

6. Crear generador restringido de patrones y contenido.

7. Implementar una ruta vertical de cinco lecciones de fila central.

8. Añadir modo Zen y resumen posterior.

9. Construir el núcleo de modos y movimientos Neovim.

10. Añadir retos, eficiencia y ayudas incrementales.

11. Completar contenido, pruebas E2E, PWA y endurecimiento del contenedor.

## 32 Definición de terminado

- Código revisado, tipado y sin errores de lint.

- Pruebas unitarias e integración correspondientes aprobadas.

- Flujo E2E afectado actualizado.

- Accesibilidad verificada por teclado y auditoría automatizada.

- Migración de datos probada cuando cambie el esquema.

- Imagen Docker construida y healthcheck aprobado.

- Documentación de contenido y criterio pedagógico actualizada.

## 33 Decisiones cerradas

| **Tema**          | **Decisión**                                           |
|-------------------|--------------------------------------------------------|
| Nombre de trabajo | NeoType                                                |
| Frontend          | React con TypeScript y Vite                            |
| Entrega inicial   | Docker con aplicación local primero                    |
| Datos MVP         | IndexedDB en el navegador                              |
| Neovim            | Simulador controlado, no emulación completa            |
| Teclado           | Inferencia más calibración, sin prometer modelo exacto |
| Pedagogía         | Patrones motores, precisión y ritmo antes de WPM       |
| Python y Go       | Arquitectura preparada ahora; producto posterior       |

## 34 Resultado esperado

El MVP estará terminado cuando una persona pueda calibrar su MacBook, aprender la posición correcta de los diez dedos, practicar patrones de movimiento y lenguaje en sesiones guiadas o Zen, y completar retos fundamentales de Neovim con progreso persistente. Python y Go quedarán definidos como extensiones compatibles, pero no retrasarán la validación del núcleo de mecanografía y edición.
