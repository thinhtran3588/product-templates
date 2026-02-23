import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MainFooter } from '@/common/components/main-footer';

describe('MainFooter', () => {
  const defaultProps = {
    privacyLabel: 'Privacy',
    privacyHref: '/privacy-policy',
    termsLabel: 'Terms',
    termsHref: '/terms-of-service',
    copyright: '© 2026 Test. All rights reserved.',
  };

  it('renders privacy link with correct href', () => {
    render(<MainFooter {...defaultProps} />);

    const link = screen.getByRole('link', { name: 'Privacy' });
    expect(link).toHaveAttribute('href', '/privacy-policy');
  });

  it('renders terms link with correct href', () => {
    render(<MainFooter {...defaultProps} />);

    const link = screen.getByRole('link', { name: 'Terms' });
    expect(link).toHaveAttribute('href', '/terms-of-service');
  });

  it('renders copyright text', () => {
    render(<MainFooter {...defaultProps} />);

    expect(
      screen.getByText('© 2026 Test. All rights reserved.')
    ).toBeInTheDocument();
  });

  it('renders footer element', () => {
    render(<MainFooter {...defaultProps} />);

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
