import { Link, Outlet, useLocation } from 'react-router-dom';
import { Moon, Sun, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useTheme } from './theme';

const NAV = [
  { to: '/', label: 'Inicio' },
  { to: '/calibracion', label: 'Calibración' },
  { to: '/diagnostico', label: 'Diagnóstico' },
  { to: '/leccion', label: 'Lecciones' },
  { to: '/zen', label: 'Zen' },
  { to: '/neovim', label: 'Neovim Lab' },
  { to: '/progreso', label: 'Progreso' },
  { to: '/ajustes', label: 'Ajustes' },
] as const;

export function Shell() {
  const { pathname } = useLocation();
  const { theme, setTheme } = useTheme();
  function cycle() {
    setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light');
  }
  return (
    <div className="min-h-svh flex flex-col bg-background">
      {/* Header Mac — translúcido, minimal, tipografía SF */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-lg bg-foreground text-background text-[11px] font-semibold tracking-widest">
              N
            </span>
            <span className="text-[15px] font-semibold tracking-tight">NeoType</span>
            <span className="hidden sm:inline text-xs text-muted-foreground font-normal tracking-wide">— mecanografía</span>
          </Link>
          <div className="flex items-center gap-2">
            <nav aria-label="Principal" className="flex items-center gap-1">
              {NAV.map((item) => {
                const active = pathname === item.to || (item.to !== '/' && pathname.startsWith(item.to));
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all',
                      active
                        ? 'bg-foreground text-background shadow-sm'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <Button variant="ghost" size="icon" onClick={cycle} aria-label={`Tema actual ${theme}, clic para cambiar`} title={`Tema: ${theme} (light→dark→system)`} className="rounded-full">
              {theme === 'light' ? <Sun className="size-4" /> : theme === 'dark' ? <Moon className="size-4" /> : <Monitor className="size-4" />}
            </Button>
          </div>
        </div>
      </header>
      <Separator />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <Outlet />
      </main>
      <footer className="border-t py-4 text-center text-xs text-muted-foreground">
        NeoType — local-first · PWA · sin telemetría
      </footer>
    </div>
  );
}
