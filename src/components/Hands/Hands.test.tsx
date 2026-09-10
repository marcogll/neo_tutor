import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hands } from './Hands';

describe('Hands', () => {
  it('resalta dedo activo con aria-current', () => {
    render(<Hands activeFinger="LI" />);
    expect(screen.getByLabelText(/índice L activo/)).toBeInTheDocument();
  });
});
