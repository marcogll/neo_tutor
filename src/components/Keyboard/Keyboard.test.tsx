import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Keyboard } from './Keyboard';
import { LAYOUTS } from '@/content/layouts';

describe('Keyboard', () => {
  it('renderiza teclas con aria-label y destaca objetivo/error', () => {
    render(<Keyboard layout={LAYOUTS['mac-ansi-us']} highlightedCode="KeyA" errorCode="KeyS" />);
    expect(screen.getByLabelText(/a dedo LP.*objetivo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/s dedo LR.*error/i)).toBeInTheDocument();
    expect(screen.getByText(/objetivo/)).toBeInTheDocument();
  });

  it('ISO tiene IntlBackslash', () => {
    render(<Keyboard layout={LAYOUTS['mac-iso-es']} highlightedCode="IntlBackslash" />);
    expect(screen.getByLabelText(/< dedo LP.*objetivo/i)).toBeInTheDocument();
  });
});
