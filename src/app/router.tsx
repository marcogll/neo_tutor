import { createBrowserRouter } from 'react-router-dom';
import { Shell } from './Shell';
import { CalibrationWizard } from '@/features/calibration/CalibrationWizard';
import { Diagnostic } from '@/features/diagnostic/Diagnostic';
import { LessonRunner } from '@/features/course/LessonRunner';
import { Zen } from '@/features/zen/Zen';
import { Progress } from '@/features/progress/Progress';
import { Lab } from '@/features/neovim/Lab';
import { Settings } from '@/features/settings/Settings';
import { Home } from './Home';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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

function getBasename(): string | undefined {
  // code-server proxy: https://.../proxy/5173/ -> window.pathname = /proxy/5173/
  // Vite preview con base './' deja el subpath visible al router
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/proxy/')) {
    const parts = window.location.pathname.split('/').filter(Boolean); // ['proxy','5173',...]
    if (parts.length >= 2) return `/${parts[0]}/${parts[1]}`;
  }
  return undefined;
}

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Shell />,
      children: [
        { index: true, element: <Home /> },
        { path: 'calibracion', element: <CalibrationWizard /> },
        { path: 'diagnostico', element: <Diagnostic /> },
      { path: 'leccion', element: <LessonRunner /> },
      { path: 'leccion/:id', element: <LessonRunner /> },
      { path: 'zen', element: <Zen /> },
      { path: 'neovim', element: <Lab /> },
      { path: 'progreso', element: <Progress /> },
      { path: 'ajustes', element: <Settings /> },
        { path: 'ajustes', element: <Placeholder title="Ajustes" /> },
      ],
    },
  ],
  { basename: getBasename() },
);
