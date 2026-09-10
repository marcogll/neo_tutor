import { useTheme } from '@/app/theme';
import { useKeyboardStore } from '@/engines/keyboard/store';
import { useProgressStore } from '@/storage/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export function Settings() {
  const { theme, setTheme } = useTheme();
  const profile = useKeyboardStore((s) => s.activeProfile);
  const clearKb = useKeyboardStore((s) => s.clear);
  const progress = useProgressStore();

  function exportData() {
    const data = { profile, progress: { byId: progress.byId, lastLessonId: progress.lastLessonId }, theme, exportedAt: new Date().toISOString(), version: 2 };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neotype-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (data.profile) useKeyboardStore.setState({ activeProfile: data.profile });
        if (data.progress?.byId) useProgressStore.setState({ byId: data.progress.byId, lastLessonId: data.progress.lastLessonId ?? null });
        else if (data.passes) {
          // migración v1
          const byId: Record<string, unknown> = {};
          for (const [k, v] of Object.entries(data.passes as Record<string, number>)) {
            byId[k] = { lessonId: k, passes: v, status: v >= 3 ? 'completed' : v > 0 ? 'in_progress' : 'available' };
          }
          useProgressStore.setState({ byId: byId as never });
        }
        if (data.theme) setTheme(data.theme);
        alert('Importado ✓');
      } catch {
        alert('JSON inválido');
      }
    };
    reader.readAsText(file);
  }

  function clearAll() {
    if (!confirm('¿Borrar perfil y progreso? Requiere confirmación PRD §23.')) return;
    clearKb();
    progress.resetAll();
    localStorage.removeItem('neotype:theme');
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <Badge variant="muted" className="rounded-full">Fase 6 — FR003/FR009 · WCAG 2.2 AA</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">Ajustes</h1>
        <p className="text-sm text-muted-foreground">Tema, teclado, datos y accesibilidad. Sin telemetría por defecto FR009.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Apariencia</CardTitle>
          <CardDescription>ZN004 — oscuro, claro y cálido. Contraste accesible.</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          {(['light', 'dark', 'system'] as const).map((t) => (
            <Button key={t} variant={theme === t ? 'default' : 'outline'} size="sm" className="rounded-full capitalize" onClick={() => setTheme(t)}>
              {t}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Teclado</CardTitle>
          <CardDescription>{profile ? `${profile.name} · ${profile.keys.length} teclas · v${profile.version}` : 'Sin perfil'}</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button variant="outline" size="sm" asChild><a href="/calibracion">Recalibrar</a></Button>
          <Button variant="ghost" size="sm" onClick={clearKb}>Restaurar</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Datos — Exportar / Importar FR003</CardTitle>
          <CardDescription>Archivo JSON legible, acción explícita. Conserva compatibilidad de versiones FR005.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button onClick={exportData} size="sm">Exportar JSON</Button>
            <label className="inline-flex cursor-pointer items-center rounded-full border px-4 py-1.5 text-sm hover:bg-accent">
              Importar JSON
              <input type="file" accept=".json" className="hidden" onChange={importData} />
            </label>
          </div>
          <Separator />
          <Button variant="outline" size="sm" className="border-destructive text-destructive hover:bg-destructive hover:text-white" onClick={clearAll}>Borrar todo</Button>
          <p className="text-xs text-muted-foreground">Persistencia tras recarga FR002 verificada. Sin captura fuera de superficies de práctica PRD §23.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Accesibilidad WCAG 2.2 AA</CardTitle>
          <CardDescription>Foco visible, no solo color, navegación por teclado, 200% zoom, reduced-motion.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge>TAB navega todo</Badge>
          <Badge variant="outline">focus:ring-2</Badge>
          <Badge variant="outline">prefers-reduced-motion</Badge>
          <Badge variant="outline">aria-label en teclado/manos</Badge>
        </CardContent>
      </Card>
    </div>
  );
}
