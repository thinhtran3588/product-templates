import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Theme } from '@/common/utils/theme';
import { ThemeSelector } from '@/modules/settings/presentation/components/theme-selector';
import { useUserSettingsStore } from '@/modules/settings/presentation/hooks/use-user-settings-store';

vi.mock(
  '@/modules/settings/presentation/hooks/use-user-settings-store',
  () => ({
    useUserSettingsStore: vi.fn(),
  })
);

describe('ThemeSelector', () => {
  const setThemeMock = vi.fn();

  beforeEach(() => {
    vi.mocked(useUserSettingsStore).mockImplementation((selector) =>
      selector({
        settings: { theme: 'system' },
        setTheme: setThemeMock,
      })
    );
    setThemeMock.mockClear();
  });

  it('renders the trigger with accessible theme label', () => {
    render(<ThemeSelector />);

    expect(
      screen.getByRole('button', { name: 'Theme: System' })
    ).toBeInTheDocument();
  });

  it('opens dropdown when trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<ThemeSelector />);

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Theme: System' }));

    const menu = await screen.findByRole('menu');
    expect(menu).toBeInTheDocument();
    expect(menu).toHaveAttribute('aria-label', 'Theme');
    expect(
      screen.getByRole('menuitem', { name: /System/ })
    ).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /Light/ })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /Dark/ })).toBeInTheDocument();
  });

  it('closes dropdown when clicking outside', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <ThemeSelector />
      </div>
    );

    await user.click(screen.getByRole('button', { name: 'Theme: System' }));
    expect(await screen.findByRole('menu')).toBeInTheDocument();

    fireEvent.pointerDown(screen.getByTestId('outside'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('calls setTheme and closes dropdown when selecting an option', async () => {
    const user = userEvent.setup();
    render(<ThemeSelector />);

    await user.click(screen.getByRole('button', { name: 'Theme: System' }));
    expect(await screen.findByRole('menu')).toBeInTheDocument();

    await user.click(screen.getByRole('menuitem', { name: /Light/ }));

    expect(setThemeMock).toHaveBeenCalledWith('light');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closes dropdown when focus moves outside', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <button type="button" data-testid="outside-button">
          Outside
        </button>
        <ThemeSelector />
      </div>
    );

    await user.click(screen.getByRole('button', { name: 'Theme: System' }));
    expect(await screen.findByRole('menu')).toBeInTheDocument();

    fireEvent.pointerDown(screen.getByTestId('outside-button'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('calls setTheme when a theme option is clicked', async () => {
    const user = userEvent.setup();
    render(<ThemeSelector />);

    await user.click(screen.getByRole('button', { name: 'Theme: System' }));
    const darkItem = await screen.findByRole('menuitem', { name: /Dark/ });
    await user.click(darkItem);

    expect(setThemeMock).toHaveBeenCalledTimes(1);
    expect(setThemeMock).toHaveBeenCalledWith('dark');
  });

  it('renders empty theme label when store theme has no matching option', () => {
    vi.mocked(useUserSettingsStore).mockImplementation((selector) =>
      selector({
        settings: { theme: 'invalid' as Theme },
        setTheme: setThemeMock,
      })
    );

    render(<ThemeSelector />);

    const button = screen.getByRole('button', { name: /^Theme:/ });
    expect(button).toHaveAttribute('aria-label', 'Theme: ');
  });
});
