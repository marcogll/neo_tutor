import type { Lesson } from '@/domains/lesson';

function flat(s: Lesson['sessions']): Lesson['blocks'] {
  return (s ?? []).flatMap((x) => x.blocks);
}

// Curriculum §10 — Python 7 módulos con flujo EXPLAIN → PREDICT → TYPE → RUN → BREAK → FIX → BUILD
export const PYTHON_ES: Lesson[] = [
  {
    id: 'python-es-01',
    courseId: 'python',
    version: 3,
    domain: 'python',
    title: 'Valores, variables y expresiones',
    description: 'int float str bool None — assignment y expresiones.',
    objectives: ['Tipos básicos', 'Asignación', 'Precedencia', 'Detectar TypeError'],
    prerequisites: ['typing-es-05'],
    skills: ['py-values'],
    sessions: [
      {
        id: 'python-es-01--A',
        title: 'Session A — Concept & Predict',
        objectives: ['Tipos y variables', 'Predecir sin ejecutar'],
        estimatedMinutes: 8,
        blocks: [
          { id: 'py01-A1', type: 'concept', title: 'Concept — valores', instructions: 'Qué es int/float/str/bool/None, por qué existen, cómo crear variables, cuándo usar cada uno.', content: ['int float str bool None'], difficulty: 1 },
          { id: 'py01-A2', type: 'concept', title: 'Variables & expresiones', instructions: 'name="NeoType", port=5173, price*quantity, name+"!"', content: ['name = "NeoType"', 'port = 5173', 'running = True'], difficulty: 1 },
          { id: 'py01-A3', type: 'recall', title: 'Predict', instructions: 'Predice antes de Run: x=10 y=4 print(x + y*2) ¿18 o 28?', content: ['x = 10', 'y = 4', 'print(x + y * 2)  # ¿?'], difficulty: 2 },
        ],
      },
      {
        id: 'python-es-01--B',
        title: 'Session B — Type/Run',
        objectives: ['Escribir y ejecutar expresión'],
        estimatedMinutes: 8,
        blocks: [
          { id: 'py01-B1', type: 'application', title: 'Type — expresión', instructions: 'Escribe print con precedencia correcta', content: ['print(10 + 4 * 2)'], difficulty: 2 },
          { id: 'py01-B2', type: 'combination', title: 'Run — System Card', instructions: 'Crea variables hostname/ip/port/online y muestra', content: ['hostname = "srv"', 'ip = "10.10.0.1"', 'port = 8080', 'online = True', 'print(hostname, ip, port, online)'], difficulty: 3 },
        ],
      },
      {
        id: 'python-es-01--C',
        title: 'Session C — Break / Fix',
        objectives: ['Diagnosticar TypeError'],
        estimatedMinutes: 8,
        blocks: [
          { id: 'py01-C1', type: 'debug', title: 'Break it', instructions: 'age="30" +5 falla: TypeError str+int. Descubre y repara.', content: ['age = "30"', 'print(age + 5)  # TypeError'], difficulty: 3 },
          { id: 'py01-C2', type: 'challenge', title: 'Fix', instructions: 'Corrige con int(age) o age=30', content: ['age = int("30")', 'print(age + 5)'], difficulty: 3 },
        ],
      },
      {
        id: 'python-es-01--D',
        title: 'Session D — Build & Evaluation',
        objectives: ['Mini project System Card'],
        estimatedMinutes: 10,
        blocks: [
          { id: 'py01-D1', type: 'application', title: 'Build — System Card completo', content: ['hostname = "neotype"', 'ip = "10.10.0.130"', 'port = 5173', 'online = True', 'print(f"{hostname} {ip}:{port} {online}")'], difficulty: 4 },
          { id: 'py01-D2', type: 'evaluation', content: ['name = "NeoType"', 'port = 5173', 'print(name, port)'], difficulty: 5 },
        ],
      },
    ],
    get blocks(): Lesson['blocks'] { return flat(this.sessions); },
    set blocks(v: Lesson['blocks']) { void v; },
    evaluator: { kind: 'code' },
    mastery: { minAccuracy: 0.85, consecutivePasses: 2 },
  },
  {
    id: 'python-es-02',
    courseId: 'python',
    version: 3,
    domain: 'python',
    title: 'Control de flujo',
    description: 'if/elif/else, and/or/not, for range, while.',
    objectives: ['Condicionales', 'Bucles', 'FizzBuzz'],
    prerequisites: ['python-es-01'],
    skills: ['py-control'],
    sessions: [
      {
        id: 'python-es-02--A',
        title: 'Session A — Concept & Predict (if/for)',
        objectives: ['if/elif/else + boolean'],
        estimatedMinutes: 8,
        blocks: [
          { id: 'py02-A1', type: 'concept', instructions: 'if/elif/else y and/or/not. Qué es condición, por qué ramifica.', content: ['if age >= 18:', '    print("allowed")'], difficulty: 1 },
          { id: 'py02-A2', type: 'concept', instructions: 'for range y while', content: ['for i in range(3):', '    print(i)', 'while online:', '    check()'], difficulty: 1 },
          { id: 'py02-A3', type: 'recall', instructions: 'Predict: if online: print... else ...', content: ['if online:', '    print("Server online")', 'else:', '    print("Server offline")'], difficulty: 2 },
        ],
      },
      {
        id: 'python-es-02--B',
        title: 'Session B — Type/Run Exercises',
        estimatedMinutes: 8,
        blocks: [
          { id: 'py02-B1', type: 'application', title: 'Access', content: ['if age >= 18:', '    print("allowed")', 'else:', '    print("denied")'], difficulty: 2 },
          { id: 'py02-B2', type: 'application', title: 'Server status', content: ['if online:', '    print("Server online")', 'else:', '    print("Server offline")'], difficulty: 2 },
          { id: 'py02-B3', type: 'debug', title: 'Break — indentation', content: ['if True:', 'print("bad indent")  # IndentationError'], difficulty: 3 },
        ],
      },
      {
        id: 'python-es-02--C',
        title: 'Session C — FizzBuzz & Port Scanner',
        estimatedMinutes: 12,
        blocks: [
          { id: 'py02-C1', type: 'challenge', title: 'Challenge — FizzBuzz simplificado', instructions: 'Sin instrucciones paso a paso: Fizz si %3, Buzz si %5', content: ['for i in range(1, 16):', '    if i % 3 == 0:', '        print("Fizz")'], difficulty: 3 },
          { id: 'py02-C2', type: 'challenge', title: 'FizzBuzz completo', content: ['for i in range(1, 21):', '    if i % 15 == 0: print("FizzBuzz")', '    elif i % 3 == 0: print("Fizz")', '    elif i % 5 == 0: print("Buzz")', '    else: print(i)'], difficulty: 4 },
          { id: 'py02-C3', type: 'application', title: 'Project — Port Scanner Simulator', content: ['ports = [22, 80, 443, 5173]', 'for p in ports:', '    print(p, "open" if p==80 else "closed")'], difficulty: 4 },
          { id: 'py02-C4', type: 'evaluation', content: ['for i in range(3):', '    print(i)'], difficulty: 5 },
        ],
      },
    ],
    get blocks(): Lesson['blocks'] { return flat(this.sessions); },
    set blocks(v: Lesson['blocks']) { void v; },
    evaluator: { kind: 'code' },
    mastery: { minAccuracy: 0.85, consecutivePasses: 2 },
  },
  {
    id: 'python-es-03',
    courseId: 'python',
    version: 3,
    domain: 'python',
    title: 'Funciones',
    description: 'def, parámetros, return, scope y descomposición.',
    objectives: ['Definir y descomponer', 'Cotizador'],
    prerequisites: ['python-es-02'],
    skills: ['py-functions'],
    sessions: [
      {
        id: 'python-es-03--A',
        title: 'Session A — Recall + Concept & First function',
        objectives: ['Recuperar if/for', 'Funciones'],
        estimatedMinutes: 9,
        blocks: [
          { id: 'py03-A0', type: 'recall', instructions: 'Recupera sin pista: if age >=18 / for i in range(3)', targetKeys: [], content: ['if age >= 18:', '    print("allowed")', 'for i in range(3):', '    print(i)'], difficulty: 2 },
          { id: 'py03-A1', type: 'concept', instructions: 'def, parameter, argument, return, scope. Qué es abstraer, por qué encapsular.', content: ['def greet(name):', '    return f"Hello {name}"'], difficulty: 1 },
          { id: 'py03-A2', type: 'application', content: ['def greet(name):', '    return f"Hello {name}"', 'print(greet("Neo"))'], difficulty: 2 },
        ],
      },
      {
        id: 'python-es-03--B',
        title: 'Session B — Decomposition',
        estimatedMinutes: 8,
        blocks: [
          { id: 'py03-B1', type: 'combination', instructions: 'Convierte programa largo en read_data/validate/calculate/display', content: ['def read_data(): pass', 'def validate(): pass', 'def calculate(): pass', 'def display(): pass'], difficulty: 3 },
          { id: 'py03-B2', type: 'challenge', title: 'calculate_total/tax/format_currency', content: ['def calculate_total(p,q): return p*q', 'def calculate_tax(t): return t*0.21'], difficulty: 3 },
        ],
      },
      {
        id: 'python-es-03--C',
        title: 'Session C — Debug & Build Cotizador',
        estimatedMinutes: 10,
        blocks: [
          { id: 'py03-C1', type: 'debug', title: 'Break — scope', content: ['def f():', '    x = 1', 'print(x)  # NameError fuera de scope'], difficulty: 3 },
          { id: 'py03-C2', type: 'application', title: 'Mini project — Cotizador (precio, cantidad, descuento, IVA → subtotal/IVA/total)', content: ['def total(precio, cantidad, descuento, iva):', '    sub = precio*cantidad', '    return sub - descuento + sub*iva'], difficulty: 4 },
          { id: 'py03-C3', type: 'evaluation', content: ['def suma(a, b):', '    return a + b'], difficulty: 5 },
        ],
      },
    ],
    get blocks(): Lesson['blocks'] { return flat(this.sessions); },
    set blocks(v: Lesson['blocks']) { void v; },
    evaluator: { kind: 'code' },
    mastery: { minAccuracy: 0.85, consecutivePasses: 2 },
  },
  {
    id: 'python-es-04',
    courseId: 'python',
    version: 3,
    domain: 'python',
    title: 'Colecciones',
    description: 'list, dict, tuple, set y datos anidados.',
    objectives: ['Modelar inventario de dispositivos'],
    prerequisites: ['python-es-03'],
    skills: ['py-collections'],
    sessions: [
      {
        id: 'python-es-04--A',
        title: 'Session A — Concept list/dict/tuple/set',
        estimatedMinutes: 8,
        blocks: [
          { id: 'py04-A1', type: 'concept', instructions: 'list ordenada mutable, dict clave-valor, tuple inmutable, set único.', content: ['servers = ["docker","nextcloud","gitea"]', 'server = {"name":"docker","ip":"10.1.1.225"}', 'position = (10,20)', 'ports = {80,443,8080}'], difficulty: 1 },
          { id: 'py04-A2', type: 'concept', title: 'Nested data', content: ['devices = [{"name":"server","ip":"10.10.0.10","online":True}]'], difficulty: 1 },
        ],
      },
      {
        id: 'python-es-04--B',
        title: 'Session B — Combination & Filter',
        estimatedMinutes: 8,
        blocks: [
          { id: 'py04-B1', type: 'application', content: ['devices = [{"name":"a","online":True},{"name":"b","online":False}]', 'online = [d for d in devices if d["online"]]'], difficulty: 3 },
          { id: 'py04-B2', type: 'challenge', title: 'Filtrar online', content: ['# filtra dispositivos online'], difficulty: 3 },
          { id: 'py04-B3', type: 'debug', title: 'Break — KeyError', content: ['d = {}', 'print(d["ip"])  # KeyError'], difficulty: 3 },
        ],
      },
      {
        id: 'python-es-04--C',
        title: 'Session C — Project Mini inventory',
        estimatedMinutes: 10,
        blocks: [
          { id: 'py04-C1', type: 'application', title: 'Project — add/remove/find/list', content: ['def add_device(devs, d): devs.append(d)', 'def find_device(devs, name): return next((x for x in devs if x["name"]==name), None)'], difficulty: 4 },
          { id: 'py04-C2', type: 'evaluation', content: ['nums = [x*2 for x in range(5)]'], difficulty: 5 },
        ],
      },
    ],
    get blocks(): Lesson['blocks'] { return flat(this.sessions); },
    set blocks(v: Lesson['blocks']) { void v; },
    evaluator: { kind: 'code' },
    mastery: { minAccuracy: 0.85, consecutivePasses: 2 },
  },
  {
    id: 'python-es-05',
    courseId: 'python',
    version: 3,
    domain: 'python',
    title: 'Archivos, JSON y errores',
    description: 'open/with, json.load/dump, try/except/finally.',
    objectives: ['Persistir inventario en devices.json'],
    prerequisites: ['python-es-04'],
    skills: ['py-files'],
    sessions: [
      {
        id: 'python-es-05--A',
        title: 'Session A — Concept files & JSON',
        estimatedMinutes: 8,
        blocks: [
          { id: 'py05-A1', type: 'concept', instructions: 'open/read/write + with, json.load/dump, try/except/finally', content: ['with open("f.txt") as file:', '    data = file.read()', 'import json', 'json.load(open("devices.json"))'], difficulty: 1 },
        ],
      },
      {
        id: 'python-es-05--B',
        title: 'Session B — Failure exercises',
        estimatedMinutes: 8,
        blocks: [
          { id: 'py05-B1', type: 'debug', title: 'Archivo inexistente', content: ['try:', '    open("no.txt")', 'except FileNotFoundError:', '    print("no existe")'], difficulty: 2 },
          { id: 'py05-B2', type: 'debug', title: 'JSON inválido & permisos', content: ['try:', '    json.load(open("bad.json"))', 'except json.JSONDecodeError:', '    print("json bad")'], difficulty: 3 },
        ],
      },
      {
        id: 'python-es-05--C',
        title: 'Session C — Project persistente',
        estimatedMinutes: 10,
        blocks: [
          { id: 'py05-C1', type: 'application', title: 'Device inventory persistente: cargar/editar/guardar devices.json', content: ['import json', 'with open("devices.json") as f: devs=json.load(f)', 'devs.append({"name":"srv"})', 'json.dump(devs, open("devices.json","w"))'], difficulty: 4 },
          { id: 'py05-C2', type: 'evaluation', content: ['try:', '    open("no.txt")', 'except FileNotFoundError:', '    print("no existe")'], difficulty: 5 },
        ],
      },
    ],
    get blocks(): Lesson['blocks'] { return flat(this.sessions); },
    set blocks(v: Lesson['blocks']) { void v; },
    evaluator: { kind: 'code' },
    mastery: { minAccuracy: 0.85, consecutivePasses: 2 },
  },
  {
    id: 'python-es-06',
    courseId: 'python',
    version: 3,
    domain: 'python',
    title: 'Testing y debugging',
    description: 'expected/actual/assertion, edge cases, pytest.',
    objectives: ['Escribir tests, depurar 5 tipos de error'],
    prerequisites: ['python-es-05'],
    skills: ['py-testing'],
    sessions: [
      {
        id: 'python-es-06--A',
        title: 'Session A — Concept pytest',
        estimatedMinutes: 8,
        blocks: [
          { id: 'py06-A1', type: 'concept', instructions: 'expected/actual/assertion/test case/edge case', content: ['def test_add():', '    assert add(2,3)==5'], difficulty: 1 },
          { id: 'py06-A2', type: 'application', content: ['def test_add():', '    assert add(2,3)==5', '    assert add(-1,1)==0  # edge'], difficulty: 2 },
        ],
      },
      {
        id: 'python-es-06--B',
        title: 'Session B — Debug exercises',
        estimatedMinutes: 10,
        blocks: [
          { id: 'py06-B1', type: 'debug', title: '5 errores: syntax/type/logic/off-by-one/condition', content: ['# syntax: for i range(10):', '# type: "30"+5', '# logic: if x=5 (assignment)', '# off-by-one: range(len(a)) vs len(a)-1', '# condition: if x > 10 cuando debe >='], difficulty: 3 },
          { id: 'py06-B2', type: 'debug', title: 'Corrige uno por uno', content: ['for i in range(10):', '    print(i)'], difficulty: 3 },
        ],
      },
      {
        id: 'python-es-06--C',
        title: 'Session C — Challenge 2/3 → 5/5',
        estimatedMinutes: 10,
        blocks: [
          { id: 'py06-C1', type: 'challenge', title: '5 tests: 2 passing 3 failing → 5 passing', content: ['def test_suma(): assert suma(2,2)==4'], difficulty: 4 },
          { id: 'py06-C2', type: 'evaluation', content: ['def test_suma():', '    assert suma(2,2)==4'], difficulty: 5 },
        ],
      },
    ],
    get blocks(): Lesson['blocks'] { return flat(this.sessions); },
    set blocks(v: Lesson['blocks']) { void v; },
    evaluator: { kind: 'code' },
    mastery: { minAccuracy: 0.85, consecutivePasses: 2 },
  },
  {
    id: 'python-es-07',
    courseId: 'python',
    version: 3,
    domain: 'python',
    title: 'CLI Project — NeoInventory',
    description: 'Integra variables→tests→CLI con argparse. Proyecto final.',
    objectives: ['modules/imports/args', 'add/list/show/update/delete'],
    prerequisites: ['python-es-06'],
    skills: ['py-cli'],
    sessions: [
      {
        id: 'python-es-07--A',
        title: 'Session A — Concept modules & argparse',
        estimatedMinutes: 8,
        blocks: [
          { id: 'py07-A1', type: 'concept', instructions: 'modules/imports/args y estructura app', content: ['import argparse', 'parser = argparse.ArgumentParser()', 'parser.add_argument("cmd")'], difficulty: 1 },
          { id: 'py07-A2', type: 'application', content: ['# python app.py list', '# python app.py add server', '# python app.py remove server'], difficulty: 2 },
        ],
      },
      {
        id: 'python-es-07--B',
        title: 'Session B — Build NeoInventory CLI',
        estimatedMinutes: 12,
        blocks: [
          { id: 'py07-B1', type: 'application', title: 'Estructura JSON', content: ['{"name":"docker","ip":"10.1.1.225","status":"online","services":["portainer","frigate"]}'], difficulty: 3 },
          { id: 'py07-B2', type: 'challenge', title: 'Implementa add/list/show/update/delete', content: ['def list_devices():', '    print(json.load(open("devices.json")))'], difficulty: 4 },
        ],
      },
      {
        id: 'python-es-07--C',
        title: 'Session C — Evaluation (integra todo)',
        estimatedMinutes: 10,
        blocks: [
          { id: 'py07-C1', type: 'evaluation', instructions: 'Debe usar variables/conditions/loops/functions/collections/JSON/exceptions/tests/CLI', content: ['# mini CLI que suma args'], difficulty: 5 },
        ],
      },
    ],
    get blocks(): Lesson['blocks'] { return flat(this.sessions); },
    set blocks(v: Lesson['blocks']) { void v; },
    evaluator: { kind: 'code' },
    mastery: { minAccuracy: 0.85, consecutivePasses: 2 },
  },
];
export const getPythonLesson = (id: string) => PYTHON_ES.find((l) => l.id === id);
