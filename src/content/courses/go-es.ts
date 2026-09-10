import type { Lesson } from '@/domains/lesson';

// PRD §17 — 7 módulos Go
export const GO_ES: Lesson[] = [
  { id: 'go-es-01', version: 1, domain: 'go', title: 'Variables y funciones', objectives: ['var, :=, func'], prerequisites: ['python-es-03'],
    blocks: [{ id: 'b1', kind: 'code', prompt: 'Declara y usa', content: 'package main\nfunc main(){ x := 3; println(x) }' }], evaluator: { kind: 'code' }, mastery: { minAccuracy: 0.85, consecutivePasses: 2 } },
  { id: 'go-es-02', version: 1, domain: 'go', title: 'Structs e interfaces', objectives: ['type struct, métodos'], prerequisites: ['go-es-01'],
    blocks: [{ id: 'b1', kind: 'code', prompt: 'Define struct', content: 'type User struct{ Name string }' }], evaluator: { kind: 'code' }, mastery: { minAccuracy: 0.85, consecutivePasses: 2 } },
  { id: 'go-es-03', version: 1, domain: 'go', title: 'Slices, maps, punteros', objectives: ['make, slice'], prerequisites: ['go-es-02'],
    blocks: [{ id: 'b1', kind: 'code', prompt: 'Slice', content: 's := []int{1,2,3}\nfmt.Println(s[0])' }], evaluator: { kind: 'code' }, mastery: { minAccuracy: 0.85, consecutivePasses: 2 } },
  { id: 'go-es-04', version: 1, domain: 'go', title: 'Errores', objectives: ['if err != nil'], prerequisites: ['go-es-03'],
    blocks: [{ id: 'b1', kind: 'code', prompt: 'Maneja error', content: 'if err != nil { return err }' }], evaluator: { kind: 'code' }, mastery: { minAccuracy: 0.85, consecutivePasses: 2 } },
  { id: 'go-es-05', version: 1, domain: 'go', title: 'Paquetes y tests', objectives: ['go test'], prerequisites: ['go-es-04'],
    blocks: [{ id: 'b1', kind: 'code', prompt: 'Test en Go', content: 'func TestSuma(t *testing.T){}' }], evaluator: { kind: 'code' }, mastery: { minAccuracy: 0.85, consecutivePasses: 2 } },
  { id: 'go-es-06', version: 1, domain: 'go', title: 'Goroutines y channels', objectives: ['go, chan, select'], prerequisites: ['go-es-05'],
    blocks: [{ id: 'b1', kind: 'code', prompt: 'Channel', content: 'ch := make(chan int)\ngo func(){ ch <- 1 }()' }], evaluator: { kind: 'code' }, mastery: { minAccuracy: 0.85, consecutivePasses: 2 } },
  { id: 'go-es-07', version: 1, domain: 'go', title: 'HTTP pequeño', objectives: ['net/http'], prerequisites: ['go-es-06'],
    blocks: [{ id: 'b1', kind: 'code', prompt: 'Server', content: 'http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request){ fmt.Fprint(w,"ok") })' }], evaluator: { kind: 'code' }, mastery: { minAccuracy: 0.85, consecutivePasses: 2 } },
];
export const getGoLesson = (id: string) => GO_ES.find((l) => l.id === id);
