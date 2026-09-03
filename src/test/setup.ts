import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => cleanup());

Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true });
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

class IntersectionObserverMock {
  root = null;
  rootMargin = '';
  thresholds = [0];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}

Object.defineProperty(window, 'ResizeObserver', { value: ResizeObserverMock });
Object.defineProperty(globalThis, 'ResizeObserver', { value: ResizeObserverMock });
Object.defineProperty(window, 'IntersectionObserver', { value: IntersectionObserverMock });
Object.defineProperty(globalThis, 'IntersectionObserver', { value: IntersectionObserverMock });
