import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CalibrationWizard } from './CalibrationWizard';

describe('CalibrationWizard', () => {
  it('renderiza los 5 pasos y la propuesta', () => {
    render(
      <MemoryRouter>
        <CalibrationWizard />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Calibración del teclado/)).toBeInTheDocument();
    expect(screen.getByText(/Paso 1/)).toBeInTheDocument();
    expect(screen.getByText(/Paso 5/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Pulsa aquí/)).toBeInTheDocument();
  });
});
