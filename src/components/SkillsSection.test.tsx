import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SkillsSection from './SkillsSection';

vi.mock('@/components/ui/img-sphere', () => ({
  default: ({ highlightedImageIds = [] }: { highlightedImageIds?: string[] }) => (
    <div data-testid="sphere" data-highlighted={highlightedImageIds.join(',')} />
  ),
}));

describe('SkillsSection discipline filters', () => {
  it('starts with every technology visible and filters using pressed buttons', () => {
    render(<SkillsSection />);
    const sphere = screen.getByTestId('sphere');
    expect(sphere.getAttribute('data-highlighted')).toBe('');

    const backend = screen.getByRole('button', { name: 'Backend' });
    fireEvent.click(backend);
    expect(backend.getAttribute('aria-pressed')).toBe('true');
    expect(sphere.getAttribute('data-highlighted')).not.toBe('');

    fireEvent.click(screen.getByRole('button', { name: 'All' }));
    expect(sphere.getAttribute('data-highlighted')).toBe('');
  });
});
