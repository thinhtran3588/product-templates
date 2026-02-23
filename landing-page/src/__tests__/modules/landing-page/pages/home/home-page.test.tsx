import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import messages from '@/application/localization/en.json';
import { APP_NAME } from '@/common/constants';
import { LandingPage } from '@/modules/landing-page/presentation/pages/home/home-page';

// Mock ScrollReveal since it might use browser APIs
vi.mock('../../components/scroll-reveal', () => ({
  ScrollReveal: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

// Mock PlatformDownload and TestimonialCard to avoid complex rendering in unit test
vi.mock(
  '@/modules/landing-page/presentation/pages/home/components/platform-download',
  () => ({
    PlatformDownload: () => <div data-testid="platform-download">Download</div>,
  })
);
vi.mock(
  '@/modules/landing-page/presentation/pages/home/components/testimonial-card',
  () => ({
    TestimonialCard: ({ name }: { name: string }) => (
      <div data-testid="testimonial-card">{name}</div>
    ),
  })
);

describe('LandingPage', () => {
  const renderPage = () => {
    return render(<LandingPage />);
  };

  // ... inside the test ...
  it(`renders the hero section with ${APP_NAME} title`, () => {
    renderPage();

    expect(
      screen.getByRole('heading', {
        name: messages.modules.landing.pages.home.hero.title,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(messages.modules.landing.pages.home.hero.subtitle)
    ).toBeInTheDocument();
    const downloads = screen.getAllByTestId('platform-download');
    expect(downloads.length).toBeGreaterThan(0);
  });

  it('renders the features section', () => {
    renderPage();

    expect(
      screen.getByRole('heading', {
        name: messages.modules.landing.pages.home.features.title,
      })
    ).toBeInTheDocument();

    // Check for a few features
    expect(
      screen.getByText(
        messages.modules.landing.pages.home.features.items.visualThinking.title
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        messages.modules.landing.pages.home.features.items.collaboration.title
      )
    ).toBeInTheDocument();
  });

  it('renders the testimonials section', () => {
    renderPage();

    expect(
      screen.getByRole('heading', {
        name: messages.modules.landing.pages.home.testimonials.title,
      })
    ).toBeInTheDocument();

    // Check if testimonial cards are rendered
    const cards = screen.getAllByTestId('testimonial-card');
    expect(cards.length).toBeGreaterThan(0);
  });
});
