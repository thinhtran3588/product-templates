import { describe, expect, it } from 'vitest';

import { getMainMenuConfig } from '@/application/config/main-menu';

describe('main-menu', () => {
  it('getMainMenuConfig returns menu items with home and contact', () => {
    const menu = getMainMenuConfig();
    expect(menu).toHaveLength(2);
    expect(menu[0]).toEqual({
      id: 'home',
      translationKey: 'navigation.home',
      href: '/',
    });
    expect(menu[1]).toEqual({
      id: 'contact',
      translationKey: 'navigation.contact',
      href: '/contact',
    });
  });
});
