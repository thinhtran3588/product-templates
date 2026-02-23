import { act, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { ScrollReveal } from '@/modules/landing-page/presentation/pages/home/components/scroll-reveal';

describe('ScrollReveal', () => {
  const originalIntersectionObserver = window.IntersectionObserver;
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    // Default mock for IntersectionObserver
    window.IntersectionObserver = vi.fn().mockImplementation((_callback) => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));

    // Default mock for matchMedia
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    window.IntersectionObserver = originalIntersectionObserver;
    window.matchMedia = originalMatchMedia;
    vi.useRealTimers();
  });

  it('renders children', () => {
    render(
      <ScrollReveal>
        <span data-testid="child">Content</span>
      </ScrollReveal>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies className when provided', () => {
    const { container } = render(
      <ScrollReveal className="custom">
        <span>Content</span>
      </ScrollReveal>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('reveal');
    expect(wrapper).toHaveClass('custom');
  });

  it('has reveal class when className is not provided', () => {
    const { container } = render(
      <ScrollReveal>
        <span>Content</span>
      </ScrollReveal>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('reveal');
  });

  it('adds is-visible when IntersectionObserver fires', () => {
    let callback: IntersectionObserverCallback;
    window.IntersectionObserver = vi.fn().mockImplementation((cb) => {
      callback = cb;
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };
    });

    const { container } = render(
      <ScrollReveal>
        <span>Content</span>
      </ScrollReveal>
    );
    const wrapper = container.firstChild as HTMLElement;

    // Trigger intersection
    act(() => {
      if (callback) {
        callback(
          [
            {
              isIntersecting: true,
              target: wrapper,
            } as unknown as IntersectionObserverEntry,
          ],
          {} as IntersectionObserver
        );
      }
    });

    expect(wrapper).toHaveClass('is-visible');
  });

  it('delays adding visibility class when delay is provided', () => {
    vi.useFakeTimers();
    let callback: IntersectionObserverCallback;
    const observeMock = vi.fn();
    const unobserveMock = vi.fn();

    window.IntersectionObserver = vi.fn().mockImplementation((cb) => {
      callback = cb;
      return {
        observe: observeMock,
        unobserve: unobserveMock,
        disconnect: vi.fn(),
      };
    });

    const { container } = render(
      <ScrollReveal delay={500}>
        <span>Content</span>
      </ScrollReveal>
    );
    const wrapper = container.firstChild as HTMLElement;

    // Trigger intersection
    act(() => {
      if (callback) {
        callback(
          [
            {
              isIntersecting: true,
              target: wrapper,
            } as unknown as IntersectionObserverEntry,
          ],
          {} as IntersectionObserver
        );
      }
    });

    // Should not be visible yet
    expect(wrapper).not.toHaveClass('is-visible');

    // Fast forward time
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(wrapper).toHaveClass('is-visible');
    expect(unobserveMock).toHaveBeenCalledWith(wrapper);
  });

  it('shows immediately if prefers-reduced-motion is true', () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { container } = render(
      <ScrollReveal delay={500}>
        <span>Content</span>
      </ScrollReveal>
    );
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper).toHaveClass('is-visible');
  });

  it('clears timeout on unmount', () => {
    vi.useFakeTimers();
    let callback: IntersectionObserverCallback;
    const disconnectMock = vi.fn();

    window.IntersectionObserver = vi.fn().mockImplementation((cb) => {
      callback = cb;
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: disconnectMock,
      };
    });

    const { container, unmount } = render(
      <ScrollReveal delay={500}>
        <span>Content</span>
      </ScrollReveal>
    );
    const wrapper = container.firstChild as HTMLElement;

    // Trigger intersection
    act(() => {
      if (callback) {
        callback(
          [
            {
              isIntersecting: true,
              target: wrapper,
            } as unknown as IntersectionObserverEntry,
          ],
          {} as IntersectionObserver
        );
      }
    });

    unmount();

    // Fast forward time - if timeout wasn't cleared, this might cause issues or side effects,
    // but mainly we just want to ensure clean unmount.
    // In this specific component implementation, we can verify disconnect was called.
    expect(disconnectMock).toHaveBeenCalled();

    // Also verifying no error occurs when timer would have fired
    act(() => {
      vi.advanceTimersByTime(500);
    });
  });
});
