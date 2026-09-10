import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { router } from './app/router';
import { Providers } from './app/providers';
import { ThemeProvider } from './app/theme';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <Providers>
        <RouterProvider router={router} />
      </Providers>
    </ThemeProvider>
  </StrictMode>,
);
