import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProjectsSection from './ProjectsSection';

const makeRepositories = (owner: string, count: number, offset = 0) =>
  Array.from({ length: count }, (_, index) => ({
    id: offset + index + 1,
    name: `${owner}-repository-${index + 1}`,
    description: `Repository ${index + 1} built with React`,
    html_url: `https://github.com/${owner}/repository-${index + 1}`,
    homepage: index === 0 ? `https://${owner}.example.com` : null,
    language: index % 2 ? 'TypeScript' : 'Python',
    topics: ['react'],
    fork: false,
    archived: false,
    pushed_at: new Date(2026, 7, 30 - index).toISOString(),
    owner: { login: owner },
    stargazers_count: index,
  }));

describe('ProjectsSection', () => {
  beforeEach(() => {
    const responses = [makeRepositories('kartikeyypatel', 12), makeRepositories('senseikartikey', 12, 100)];
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => responses[0] })
      .mockResolvedValueOnce({ ok: true, json: async () => responses[1] }));
  });

  it('separates featured work and paginates the live GitHub feed without an account filter', async () => {
    render(<ProjectsSection />);
    expect(screen.getByRole('heading', { name: /Featured Projects/i })).toBeTruthy();
    expect(screen.queryByLabelText('Filter by GitHub account')).toBeNull();

    await screen.findByText('24 public repositories');
    expect(screen.getAllByText('Source')).toHaveLength(9);
    expect(screen.getByText('1 / 3')).toBeTruthy();

    fireEvent.click(screen.getAllByRole('button', { name: /Next/i }).at(-1)!);
    expect(await screen.findByText('2 / 3')).toBeTruthy();
  });

  it('opens an accessible project dialog and returns through Back to Projects', async () => {
    render(<ProjectsSection />);
    const featuredHeading = screen.getByRole('heading', { name: 'Consumer Safety Application (Capstone)' });
    fireEvent.click(featuredHeading.closest('button')!);

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByRole('button', { name: /Back to Projects/i })).toBeTruthy();
    expect(within(dialog).getByText('Problem')).toBeTruthy();

    fireEvent.click(within(dialog).getByRole('button', { name: /Back to Projects/i }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });
});
