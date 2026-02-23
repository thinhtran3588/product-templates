import type { MenuItem } from '@/common/interfaces';

export function getMainMenuConfig(): MenuItem[] {
  return [
    {
      id: 'home',
      translationKey: 'navigation.home',
      href: '/',
    },
    {
      id: 'contact',
      translationKey: 'navigation.contact',
      href: '/contact',
    },
  ];
}
