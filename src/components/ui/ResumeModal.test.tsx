import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ResumeModal } from './ResumeModal';

describe('ResumeModal', () => {
  it('renders in a bounded dialog and always exposes a close control', async () => {
    const onClose = vi.fn();
    render(<ResumeModal isOpen onClose={onClose} />);

    const dialog = await screen.findByRole('dialog', { name: /Resume/i });
    expect(dialog.parentElement).toBe(document.body);
    expect(screen.getByTitle('Resume - Kartikey Patel')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /Close resume/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('closes with Escape and restores body scrolling', async () => {
    const onClose = vi.fn();
    const { rerender } = render(<ResumeModal isOpen onClose={onClose} />);

    expect(document.body.style.overflow).toBe('hidden');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();

    rerender(<ResumeModal isOpen={false} onClose={onClose} />);
    await waitFor(() => expect(document.body.style.overflow).toBe(''));
  });
});
