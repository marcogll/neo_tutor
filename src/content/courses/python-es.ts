import type { Lesson } from '@/domains/lesson';

// PRD §16 — 7 módulos Python, reutiliza contrato Lesson §18, ejecución aislada reservada (PG002)
export const PYTHON_ES: Lesson[] = [
  {
    id: 'python-es-01', version: 1, domain: 'python', title: 'Expresiones y variables', objectives: ['Tipos básicos', 'Asignación'], prerequisites: ['typing-es-05'],
    blocks: [
      { id: 'b1', kind: 'code', prompt: 'Predice salida', content: 'x = 2 + 3\nprint(x)  # ¿5?' },
      { id: 'b2', kind: 'code', prompt: 'Completa', content: 'nombre = "Neo"\n# completa print(nombre)' },
    ], evaluator: { kind: 'code' }, mastery: { minAccuracy: 0.85, consecutivePasses: 2 },
  },
  {
    id: 'python-es-02', version: 1, domain: 'python', title: 'Condicionales y ciclos', objectives: ['if/for/while'], prerequisites: ['python-es-01'],
    blocks: [{ id: 'b1', kind: 'code', prompt: 'Corrige con dw/ciw', content: 'for i in range(3):\n    print(i)' }], evaluator: { kind: 'code' }, mastery: { minAccuracy: 0.85, consecutivePasses: 2 },
  },
  {
    id: 'python-es-03', version: 1, domain: 'python', title: 'Funciones', objectives: ['def, return, parámetros'], prerequisites: ['python-es-02'],
    blocks: [{ id: 'b1', kind: 'code', prompt: 'Escribe función suma', content: 'def suma(a, b):\n    return a + b' }], evaluator: { kind: 'code' }, mastery: { minAccuracy: 0.85, consecutivePasses: 2 },
  },
  {
    id: 'python-es-04', version: 1, domain: 'python', title: 'Colecciones', objectives: ['list, dict, comprehension'], prerequisites: ['python-es-03'],
    blocks: [{ id: 'b1', kind: 'code', prompt: 'Comprensión', content: 'nums = [x*2 for x in range(5)]' }], evaluator: { kind: 'code' }, mastery: { minAccuracy: 0.85, consecutivePasses: 2 },
  },
  {
    id: 'python-es-05', version: 1, domain: 'python', title: 'Archivos y errores', objectives: ['open, try/except'], prerequisites: ['python-es-04'],
    blocks: [{ id: 'b1', kind: 'code', prompt: 'Maneja FileNotFoundError', content: 'try:\n    open("no.txt")\nexcept FileNotFoundError:\n    print("no existe")' }], evaluator: { kind: 'code' }, mastery: { minAccuracy: 0.85, consecutivePasses: 2 },
  },
  {
    id: 'python-es-06', version: 1, domain: 'python', title: 'Pruebas', objectives: ['pytest básico'], prerequisites: ['python-es-05'],
    blocks: [{ id: 'b1', kind: 'code', prompt: 'Escribe test', content: 'def test_suma():\n    assert suma(2,2)==4' }], evaluator: { kind: 'code' }, mastery: { minAccuracy: 0.85, consecutivePasses: 2 },
  },
  {
    id: 'python-es-07', version: 1, domain: 'python', title: 'Proyecto — CLI corta', objectives: ['Integrar todo'], prerequisites: ['python-es-06'],
    blocks: [{ id: 'b1', kind: 'code', prompt: 'Proyecto', content: '# mini CLI que suma args' }], evaluator: { kind: 'code' }, mastery: { minAccuracy: 0.85, consecutivePasses: 2 },
  },
];
export const getPythonLesson = (id: string) => PYTHON_ES.find((l) => l.id === id);
