import * as React from 'react';
import { cn } from '@/lib/utils';

export function Kbd({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <kbd
      className={cn(
        'inline-flex items-center justify-center rounded-md border bg-muted px-1.5 py-0.5 font-mono text-xs font-medium text-muted-foreground shadow-sm',
        className,
      )}
      {...props}
    />
  );
}
