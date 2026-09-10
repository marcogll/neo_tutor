import { createBrowserRouter } from 'react-router-dom';
import { Shell } from './Shell';
import { CalibrationWizard } from '@/features/calibration/CalibrationWizard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function Home() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Badge variant="muted" className="rounded-full">MVP 0.1 — Calibración</Badge>
        <h1 className="text-4xl font-semibold tracking-tight">Mecanografía táctil.</h1>
        <p className="max-w-xl text-muted-foreground leading-relaxed">
          Precisión antes que velocidad. Calibra tu Mac, practica patrones motores y domina Neovim — todo local, sin cloud.
        </p>
        <div className="flex gap-2 pt-2">
          <Button asChild><a href="/calibracion">Calibrar teclado</a></Button>
          <Button variant="outline" asChild><a href="/diagnostico">Diagnóstico</a></Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { title: 'Calibración', desc: 'ANSI / ISO ES / LA. 5 pasos.', href: '/calibracion' },
          { title: 'Teclado visual', desc: 'Dedo recomendado, sin solo-color.', href: '/calibracion' },
          { title: 'Diagnóstico', desc: 'Fila central y coordinación.', href: '/diagnostico' },
        ].map((c) => (
          <Card key={c.title} className="transition hover:shadow-md">
            <CardHeader>
              <CardTitle className="text-base">{c.title}</CardTitle>
              <CardDescription>{c.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" size="sm" asChild><a href={c.href}>Abrir →</a></Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>En construcción — Fase 1→2</CardDescription>
      </CardHeader>
    </Card>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Shell />,
    children: [
      { index: true, element: <Home /> },
      { path: 'calibracion', element: <CalibrationWizard /> },
      { path: 'diagnostico', element: <Placeholder title="Diagnóstico" /> },
      { path: 'leccion/:id', element: <Placeholder title="Lección" /> },
      { path: 'zen', element: <Placeholder title="Zen" /> },
      { path: 'neovim', element: <Placeholder title="Laboratorio Neovim" /> },
      { path: 'progreso', element: <Placeholder title="Progreso" /> },
      { path: 'ajustes', element: <Placeholder title="Ajustes" /> },
    ],
  },
]);
