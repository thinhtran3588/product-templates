import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import messages from '@/application/localization/en.json';
import { PrivacyPolicyPage } from '@/modules/landing-page/presentation/pages/privacy-policy/privacy-policy-page';

describe('PrivacyPolicyPage', () => {
  it('renders the privacy policy placeholder', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const page = await PrivacyPolicyPage();
    render(page);

    expect(
      screen.getByRole('heading', {
        name: messages.modules.legal.pages['privacy-policy'].title,
      })
    ).toBeInTheDocument();
  });
});
