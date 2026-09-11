import type { Lesson } from '@/domains/lesson';

function flat(s: Lesson['sessions']): Lesson['blocks'] {
  return (s ?? []).flatMap((x) => x.blocks);
}

// Curriculum §11 — Go: de "¿cómo programo?" a "¿cómo diseño software explícito y confiable?"
export const GO_ES: Lesson[] = [
  {
    id: 'go-es-01',
    courseId: 'go',
    version: 3,
    domain: 'go',
    title: 'Variables, tipos y funciones',
    description: 'package main, var vs :=, string/int/float64/bool, func add.',
    objectives: ['Estructura Go', 'Tipos explícitos', 'Funciones tipadas'],
    prerequisites: ['python-es-03'],
    skills: ['go-vars'],
    sessions: [
      {
        id: 'go-es-01--A',
        title: 'Session A — Concept structure',
        objectives: ['package/import/func main'],
        estimatedMinutes: 6,
        blocks: [
          { id: 'go01-A1', type: 'concept', instructions: 'package main + import "fmt" + func main(){ fmt.Println }', content: ['package main', 'import "fmt"', 'func main(){', '    fmt.Println("Hello")', '}'], difficulty: 1 },
          { id: 'go01-A2', type: 'concept', title: 'Variables y tipos', content: ['var name string', 'name := "NeoType"', 'var port int = 8080'], difficulty: 1 },
        ],
      },
      {
        id: 'go-es-01--B',
        title: 'Session B — Functions',
        estimatedMinutes: 8,
        blocks: [
          { id: 'go01-B1', type: 'application', content: ['func add(a int, b int) int {', '    return a + b', '}'], difficulty: 2 },
          { id: 'go01-B2', type: 'debug', title: 'Break — tipos', content: ['var x int = "3"  // compile error'], difficulty: 3 },
        ],
      },
      {
        id: 'go-es-01--C',
        title: 'Session C — Project calculadora CLI',
        estimatedMinutes: 8,
        blocks: [
          { id: 'go01-C1', type: 'challenge', title: 'Calculadora CLI pequeña', content: ['package main', 'func main(){ x:=3; println(x) }'], difficulty: 3 },
          { id: 'go01-C2', type: 'evaluation', content: ['package main', 'func main(){ x := 3; println(x) }'], difficulty: 5 },
        ],
      },
    ],
    get blocks(): Lesson['blocks'] { return flat(this.sessions); },
    set blocks(v: Lesson['blocks']) { void v; },
    evaluator: { kind: 'code' },
    mastery: { minAccuracy: 0.85, consecutivePasses: 2 },
  },
  {
    id: 'go-es-02',
    courseId: 'go',
    version: 3,
    domain: 'go',
    title: 'Structs y métodos',
    description: 'type Device struct + método Display().',
    objectives: ['Modelar Device/Server/Service', 'Método vs función'],
    prerequisites: ['go-es-01'],
    skills: ['go-structs'],
    sessions: [
      {
        id: 'go-es-02--A',
        title: 'Session A — Concept struct',
        estimatedMinutes: 6,
        blocks: [
          { id: 'go02-A1', type: 'concept', content: ['type Device struct {', '    Name string', '    IP string', '}'], difficulty: 1 },
          { id: 'go02-A2', type: 'concept', title: 'Methods', content: ['func (d Device) Display(){', '    fmt.Println(d.Name)', '}'], difficulty: 1 },
        ],
      },
      {
        id: 'go-es-02--B',
        title: 'Session B — Project Modelar',
        estimatedMinutes: 8,
        blocks: [
          { id: 'go02-B1', type: 'application', title: 'Modelar Device/Server/Service con métodos', content: ['type Server struct { Device }', 'type Service struct { Name string }'], difficulty: 3 },
          { id: 'go02-B2', type: 'evaluation', content: ['type User struct{ Name string }'], difficulty: 5 },
        ],
      },
    ],
    get blocks(): Lesson['blocks'] { return flat(this.sessions); },
    set blocks(v: Lesson['blocks']) { void v; },
    evaluator: { kind: 'code' },
    mastery: { minAccuracy: 0.85, consecutivePasses: 2 },
  },
  {
    id: 'go-es-03',
    courseId: 'go',
    version: 3,
    domain: 'go',
    title: 'Slices, maps y ranges',
    description: 'make, slice, map, for range.',
    objectives: ['Slices y maps', 'Iterar con range'],
    prerequisites: ['go-es-02'],
    skills: ['go-slices'],
    sessions: [
      {
        id: 'go-es-03--A',
        title: 'Session A — Concept slice/map',
        estimatedMinutes: 6,
        blocks: [
          { id: 'go03-A1', type: 'concept', content: ['devices := []string{"server","router"}', 'ports := map[string]int{"http":80,"https":443}'], difficulty: 1 },
          { id: 'go03-A2', type: 'application', content: ['for _, d := range devices {', '    fmt.Println(d)', '}'], difficulty: 2 },
        ],
      },
      {
        id: 'go-es-03--B',
        title: 'Session B — Project inventario memoria',
        estimatedMinutes: 8,
        blocks: [
          { id: 'go03-B1', type: 'application', content: ['s := []int{1,2,3}', 'fmt.Println(s[0])'], difficulty: 3 },
          { id: 'go03-B2', type: 'evaluation', content: ['s := []int{1,2,3}'], difficulty: 5 },
        ],
      },
    ],
    get blocks(): Lesson['blocks'] { return flat(this.sessions); },
    set blocks(v: Lesson['blocks']) { void v; },
    evaluator: { kind: 'code' },
    mastery: { minAccuracy: 0.85, consecutivePasses: 2 },
  },
  {
    id: 'go-es-04',
    courseId: 'go',
    version: 3,
    domain: 'go',
    title: 'Errores explícitos',
    description: 'value, err := op(); if err != nil',
    objectives: ['errors.New, fmt.Errorf, wrapping, propagation'],
    prerequisites: ['go-es-03'],
    skills: ['go-errors'],
    sessions: [
      {
        id: 'go-es-04--A',
        title: 'Session A — Concept error handling',
        estimatedMinutes: 6,
        blocks: [
          { id: 'go04-A1', type: 'concept', content: ['value, err := operation()', 'if err != nil {', '    return err', '}'], difficulty: 1 },
          { id: 'go04-A2', type: 'concept', title: 'Wrapping', content: ['errors.New("fail")', 'fmt.Errorf("wrap: %w", err)'], difficulty: 1 },
        ],
      },
      {
        id: 'go-es-04--B',
        title: 'Session B — Challenge & Project',
        estimatedMinutes: 10,
        blocks: [
          { id: 'go04-B1', type: 'debug', title: 'Corrige programa que ignora errores', content: ['v, _ := risky()  // ignora err → bug'], difficulty: 3 },
          { id: 'go04-B2', type: 'application', title: 'Leer config desde archivo', content: ['data, err := os.ReadFile("config.json")', 'if err != nil { return err }'], difficulty: 3 },
          { id: 'go04-B3', type: 'evaluation', content: ['if err != nil { return err }'], difficulty: 5 },
        ],
      },
    ],
    get blocks(): Lesson['blocks'] { return flat(this.sessions); },
    set blocks(v: Lesson['blocks']) { void v; },
    evaluator: { kind: 'code' },
    mastery: { minAccuracy: 0.85, consecutivePasses: 2 },
  },
  {
    id: 'go-es-05',
    courseId: 'go',
    version: 3,
    domain: 'go',
    title: 'Paquetes y tests',
    description: 'go test + table driven.',
    objectives: ['Escribir TestAdd, table driven desde tests'],
    prerequisites: ['go-es-04'],
    skills: ['go-testing'],
    sessions: [
      {
        id: 'go-es-05--A',
        title: 'Session A — Concept test',
        estimatedMinutes: 6,
        blocks: [
          { id: 'go05-A1', type: 'concept', content: ['func TestAdd(t *testing.T){', '    got := Add(2,3)', '    if got !=5 { t.Errorf("got %d", got)}', '}'], difficulty: 1 },
          { id: 'go05-A2', type: 'concept', title: 'Table driven', content: ['tests := []struct{a int; b int; want int}{}', 'for _, tc := range tests { }'], difficulty: 1 },
        ],
      },
      {
        id: 'go-es-05--B',
        title: 'Session B — Challenge completar desde tests',
        estimatedMinutes: 8,
        blocks: [
          { id: 'go05-B1', type: 'challenge', title: 'Implementa para que tests pasen', content: ['func TestSuma(t *testing.T){}'], difficulty: 3 },
          { id: 'go05-B2', type: 'evaluation', content: ['func TestSuma(t *testing.T){}'], difficulty: 5 },
        ],
      },
    ],
    get blocks(): Lesson['blocks'] { return flat(this.sessions); },
    set blocks(v: Lesson['blocks']) { void v; },
    evaluator: { kind: 'code' },
    mastery: { minAccuracy: 0.85, consecutivePasses: 2 },
  },
  {
    id: 'go-es-06',
    courseId: 'go',
    version: 3,
    domain: 'go',
    title: 'Goroutines y channels',
    description: 'Hacer varios trabajos simultáneamente y comunicar resultados.',
    objectives: ['go checkServer(), make(chan string)', 'Concurrent checker'],
    prerequisites: ['go-es-05'],
    skills: ['go-concurrency'],
    sessions: [
      {
        id: 'go-es-06--A',
        title: 'Session A — Concept concurrency',
        estimatedMinutes: 6,
        blocks: [
          { id: 'go06-A1', type: 'concept', instructions: 'Hacer trabajo → varios simultáneos → comunicar. go f() lança goroutine, canal comunica.', content: ['go checkServer()', 'results := make(chan string)'], difficulty: 1 },
        ],
      },
      {
        id: 'go-es-06--B',
        title: 'Session B — Project Concurrent Service Checker',
        estimatedMinutes: 10,
        blocks: [
          { id: 'go06-B1', type: 'application', title: 'Revisar server-01..04 en paralelo', content: ['for _, s := range []string{"server-01","server-02","server-03","server-04"} {', '    go check(s, results)', '}'], difficulty: 3 },
          { id: 'go06-B2', type: 'challenge', content: ['ch := make(chan int)', 'go func(){ ch <- 1 }()'], difficulty: 3 },
          { id: 'go06-B3', type: 'evaluation', content: ['ch := make(chan int)'], difficulty: 5 },
        ],
      },
    ],
    get blocks(): Lesson['blocks'] { return flat(this.sessions); },
    set blocks(v: Lesson['blocks']) { void v; },
    evaluator: { kind: 'code' },
    mastery: { minAccuracy: 0.85, consecutivePasses: 2 },
  },
  {
    id: 'go-es-07',
    courseId: 'go',
    version: 3,
    domain: 'go',
    title: 'HTTP pequeño — NeoInventory API',
    description: 'Proyecto final: cmd/internal/device/service/storage/http',
    objectives: ['HandleFunc, ListenAndServe, JSON, endpoints'],
    prerequisites: ['go-es-06'],
    skills: ['go-http'],
    sessions: [
      {
        id: 'go-es-07--A',
        title: 'Session A — Concept HTTP & JSON',
        estimatedMinutes: 8,
        blocks: [
          { id: 'go07-A1', type: 'concept', content: ['http.HandleFunc("/health", h)', 'http.ListenAndServe(":8080", nil)', 'json.NewEncoder(w).Encode(v)'], difficulty: 1 },
          { id: 'go07-A2', type: 'recall', title: 'Endpoints', content: ['GET /health', 'GET /devices', 'POST /devices', 'GET /devices/{id}', 'DELETE /devices/{id}'], difficulty: 2 },
        ],
      },
      {
        id: 'go-es-07--B',
        title: 'Session B — Build API',
        estimatedMinutes: 14,
        blocks: [
          { id: 'go07-B1', type: 'application', title: 'Arquitectura cmd/internal/...', content: ['cmd/', 'internal/', '    device/', '    service/', '    storage/', '    http/'], difficulty: 3 },
          { id: 'go07-B2', type: 'application', content: ['http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request){ fmt.Fprint(w,"ok") })'], difficulty: 3 },
          { id: 'go07-B3', type: 'challenge', title: 'Integrar types/funcs/structs/slices/maps/errors/tests/goroutines/HTTP/JSON', content: ['// NeoInventory API — integra todo'], difficulty: 4 },
        ],
      },
      {
        id: 'go-es-07--C',
        title: 'Session C — Evaluation',
        estimatedMinutes: 8,
        blocks: [
          { id: 'go07-C1', type: 'evaluation', content: ['http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request){ fmt.Fprint(w,"ok") })'], difficulty: 5 },
        ],
      },
    ],
    get blocks(): Lesson['blocks'] { return flat(this.sessions); },
    set blocks(v: Lesson['blocks']) { void v; },
    evaluator: { kind: 'code' },
    mastery: { minAccuracy: 0.85, consecutivePasses: 2 },
  },
];
export const getGoLesson = (id: string) => GO_ES.find((l) => l.id === id);
