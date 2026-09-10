import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun, Monitor, ChevronLeft, ChevronRight, Menu, X, Home as HomeIcon, BookOpen, Keyboard, Wind, Terminal, BarChart3, Settings } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useTheme } from './theme';

const NAV = [
  { to: '/', label: 'Inicio', icon: HomeIcon },
  { to: '/cursos', label: 'Cursos', icon: BookOpen },
  { to: '/leccion', label: 'Lecciones', icon: Keyboard },
  { to: '/calibracion', label: 'Teclado', icon: Keyboard },
  { to: '/zen', label: 'Zen', icon: Wind },
  { to: '/neovim', label: 'Neovim', icon: Terminal },
  { to: '/progreso', label: 'Progreso', icon: BarChart3 },
  { to: '/ajustes', label: 'Ajustes', icon: Settings },
] as const;

function Breadcrumbs({ pathname }: { pathname: string }) {
  const segs = pathname.split('/').filter(Boolean);
  if (segs.length === 0) return null;
  return (
    <nav aria-label="Miga de pan" className="flex items-center gap-1 text-xs text-muted-foreground">
      <Link to="/" className="hover:text-foreground">Inicio</Link>
      {segs.map((s, i) => {
        const href = '/' + segs.slice(0, i + 1).join('/');
        const isLast = i === segs.length - 1;
        return (
          <span key={href} className="flex items-center gap-1">
            <ChevronRight className="size-3" />
            {isLast ? <span className="font-medium text-foreground">{decodeURIComponent(s)}</span> : <Link to={href} className="hover:text-foreground">{decodeURIComponent(s)}</Link>}
          </span>
        );
      })}
    </nav>
  );
}

export function Shell() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  function cycle() {
    setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light');
  }
  return (
    <div className="min-h-svh flex flex-col bg-background">
      {/* Skip link a11y */}
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-foreground focus:px-3 focus:py-2 focus:text-background">
        Saltar al contenido
      </a>

      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setMobileOpen((v) => !v)} aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={mobileOpen}>
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex size-7 items-center justify-center rounded-lg bg-foreground text-background text-[11px] font-semibold tracking-widest">N</span>
              <span className="hidden sm:inline text-[15px] font-semibold tracking-tight">NeoType</span>
            </Link>
            <div className="hidden sm:flex items-center gap-1 ml-2">
              <Button variant="ghost" size="icon" className="size-8 rounded-full" onClick={() => navigate(-1)} aria-label="Atrás" title="Atrás (Alt+←)">
                <ChevronLeft className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" className="size-8 rounded-full" onClick={() => navigate(1)} aria-label="Adelante" title="Adelante (Alt+→)">
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>

          <nav aria-label="Principal" className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => {
              const active = pathname === item.to || (item.to !== '/' && pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={active ? 'page' : undefined}
                  className={cn('rounded-full px-3 py-1.5 text-[13px] font-medium transition-all', active ? 'bg-foreground text-background shadow-sm' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground')}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex rounded-full" asChild><Link to="/progreso">Mi avance</Link></Button>
            <Button variant="ghost" size="icon" onClick={cycle} aria-label={`Tema ${theme}`} title={`Tema: ${theme}`} className="rounded-full">
              {theme === 'light' ? <Sun className="size-4" /> : theme === 'dark' ? <Moon className="size-4" /> : <Monitor className="size-4" />}
            </Button>
          </div>
        </div>

        {/* Menú móvil */}
        {mobileOpen && (
          <div className="border-t bg-background lg:hidden">
            <div className="mx-auto max-w-6xl px-4 py-3">
              <div className="flex gap-1 mb-3">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(-1)}><ChevronLeft className="size-4" /> Atrás</Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(1)}>Adelante <ChevronRight className="size-4" /></Button>
              </div>
              <nav aria-label="Móvil" className="grid grid-cols-2 gap-2">
                {NAV.map((item) => {
                  const active = pathname === item.to || (item.to !== '/' && pathname.startsWith(item.to));
                  const Icon = item.icon;
                  return (
                    <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className={cn('flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium', active ? 'bg-foreground text-background border-foreground' : 'bg-card hover:bg-accent')}>
                      <Icon className="size-4" /> {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}
      </header>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-3">
        <Breadcrumbs pathname={pathname} />
      </div>

      <Separator />
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6 py-6 sm:py-8">
        <Outlet />
      </main>

      {/* Barra inferior en móvil — atrás/adelante siempre visible */}
      <div className="sticky bottom-0 z-30 border-t bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}><ChevronLeft className="size-4" /> Atrás</Button>
          <Link to="/" className="text-xs font-medium text-muted-foreground">Menú principal</Link>
          <Button variant="ghost" size="sm" onClick={() => navigate(1)}>Adelante <ChevronRight className="size-4" /></Button>
        </div>
      </div>

      <footer className="border-t py-4 text-center text-xs text-muted-foreground hidden sm:block">NeoType — local-first · PWA · sin telemetría · <Link to="/" className="underline">Inicio</Link> · <Link to="/cursos" className="underline">Cursos</Link></footer>
    </div>
  );
}
