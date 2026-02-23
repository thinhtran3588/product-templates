import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, type Mock } from 'vitest';

import messages from '@/application/localization/en.json';
import { useContainer } from '@/common/hooks/use-container';
import { ContactForm } from '@/modules/landing-page/presentation/pages/contact/components/contact-form';

vi.mock('@/common/hooks/use-container', () => ({
  useContainer: vi.fn(),
}));

const formMessages = messages.modules.contact.pages.contact.form;
const contactMessages = messages.modules.contact.pages.contact;

describe('ContactForm', () => {
  const mockExecute = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useContainer as Mock).mockReturnValue({
      resolve: vi.fn().mockReturnValue({
        execute: mockExecute,
      }),
    });
  });

  it('renders all form fields and submit button', () => {
    render(<ContactForm />);

    expect(
      screen.getByPlaceholderText(formMessages.namePlaceholder)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(formMessages.emailPlaceholder)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(formMessages.subjectPlaceholder)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(formMessages.messagePlaceholder)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: formMessages.submitButton })
    ).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    render(<ContactForm />);

    fireEvent.click(
      screen.getByRole('button', { name: formMessages.submitButton })
    );

    await waitFor(() => {
      expect(
        screen.getByText(formMessages.validation.nameRequired)
      ).toBeInTheDocument();
    });
  });

  it('sends contact request on valid submission', async () => {
    mockExecute.mockResolvedValue({ success: true, data: undefined });

    render(<ContactForm />);

    fireEvent.change(
      screen.getByPlaceholderText(formMessages.namePlaceholder),
      { target: { value: 'Alice' } }
    );
    fireEvent.change(
      screen.getByPlaceholderText(formMessages.emailPlaceholder),
      { target: { value: 'alice@example.com' } }
    );
    fireEvent.change(
      screen.getByPlaceholderText(formMessages.subjectPlaceholder),
      { target: { value: 'Test Subject' } }
    );
    fireEvent.change(
      screen.getByPlaceholderText(formMessages.messagePlaceholder),
      { target: { value: 'Hello, this is a test message.' } }
    );

    fireEvent.click(
      screen.getByRole('button', { name: formMessages.submitButton })
    );

    await waitFor(() => {
      expect(mockExecute).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Alice',
          email: 'alice@example.com',
          subject: 'Test Subject',
          message: 'Hello, this is a test message.',
        })
      );
    });

    // Success: inline message shown, form hidden
    await waitFor(() => {
      expect(
        screen.getByText(contactMessages.successMessage)
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: formMessages.submitButton })
      ).not.toBeInTheDocument();
    });
  });

  it('shows loading state during submission', async () => {
    mockExecute.mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return { success: true, data: undefined };
    });

    render(<ContactForm />);

    fireEvent.change(
      screen.getByPlaceholderText(formMessages.namePlaceholder),
      { target: { value: 'Frank' } }
    );
    fireEvent.change(
      screen.getByPlaceholderText(formMessages.emailPlaceholder),
      { target: { value: 'frank@example.com' } }
    );
    fireEvent.change(
      screen.getByPlaceholderText(formMessages.subjectPlaceholder),
      { target: { value: 'Loading Test' } }
    );
    fireEvent.change(
      screen.getByPlaceholderText(formMessages.messagePlaceholder),
      { target: { value: 'Testing loading state.' } }
    );

    fireEvent.click(
      screen.getByRole('button', { name: formMessages.submitButton })
    );

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: formMessages.submittingButton })
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByText(contactMessages.successMessage)
      ).toBeInTheDocument();
    });
  });

  it('includes source in the request payload', async () => {
    mockExecute.mockResolvedValue({ success: true, data: undefined });

    render(<ContactForm />);

    fireEvent.change(
      screen.getByPlaceholderText(formMessages.namePlaceholder),
      { target: { value: 'Bob' } }
    );
    fireEvent.change(
      screen.getByPlaceholderText(formMessages.emailPlaceholder),
      { target: { value: 'bob@example.com' } }
    );
    fireEvent.change(
      screen.getByPlaceholderText(formMessages.subjectPlaceholder),
      { target: { value: 'Help needed' } }
    );
    fireEvent.change(
      screen.getByPlaceholderText(formMessages.messagePlaceholder),
      { target: { value: 'I need assistance.' } }
    );

    fireEvent.click(
      screen.getByRole('button', { name: formMessages.submitButton })
    );

    await waitFor(() => {
      expect(mockExecute).toHaveBeenCalled();
    });

    const callArguments = mockExecute.mock.calls[0][0];
    expect(callArguments.source).toBeDefined();
    expect(callArguments.name).toBe('Bob');
  });

  it('shows success message only after successful submission', async () => {
    mockExecute.mockResolvedValue({ success: true, data: undefined });

    render(<ContactForm />);

    fireEvent.change(
      screen.getByPlaceholderText(formMessages.namePlaceholder),
      { target: { value: 'Charlie' } }
    );
    fireEvent.change(
      screen.getByPlaceholderText(formMessages.emailPlaceholder),
      { target: { value: 'charlie@example.com' } }
    );
    fireEvent.change(
      screen.getByPlaceholderText(formMessages.subjectPlaceholder),
      { target: { value: 'Feedback' } }
    );
    fireEvent.change(
      screen.getByPlaceholderText(formMessages.messagePlaceholder),
      { target: { value: 'Great site!' } }
    );

    fireEvent.click(
      screen.getByRole('button', { name: formMessages.submitButton })
    );

    await waitFor(() => {
      expect(
        screen.getByText(contactMessages.successMessage)
      ).toBeInTheDocument();
    });
  });

  it('shows inline error on API failure', async () => {
    mockExecute.mockResolvedValue({
      success: false,
      error: 'Failed to send message',
    });

    render(<ContactForm />);

    fireEvent.change(
      screen.getByPlaceholderText(formMessages.namePlaceholder),
      { target: { value: 'Dave' } }
    );
    fireEvent.change(
      screen.getByPlaceholderText(formMessages.emailPlaceholder),
      { target: { value: 'dave@example.com' } }
    );
    fireEvent.change(
      screen.getByPlaceholderText(formMessages.subjectPlaceholder),
      { target: { value: 'Error' } }
    );
    fireEvent.change(
      screen.getByPlaceholderText(formMessages.messagePlaceholder),
      { target: { value: 'Testing error' } }
    );

    fireEvent.click(
      screen.getByRole('button', { name: formMessages.submitButton })
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to send message')).toBeInTheDocument();
    });

    // Form should still be visible so user can retry
    expect(
      screen.getByRole('button', { name: formMessages.submitButton })
    ).toBeInTheDocument();
  });

  it('shows inline error on unexpected exception', async () => {
    mockExecute.mockRejectedValue(new Error('Network Error'));

    render(<ContactForm />);

    fireEvent.change(
      screen.getByPlaceholderText(formMessages.namePlaceholder),
      { target: { value: 'Eve' } }
    );
    fireEvent.change(
      screen.getByPlaceholderText(formMessages.emailPlaceholder),
      { target: { value: 'eve@example.com' } }
    );
    fireEvent.change(
      screen.getByPlaceholderText(formMessages.subjectPlaceholder),
      { target: { value: 'Unexpected' } }
    );
    fireEvent.change(
      screen.getByPlaceholderText(formMessages.messagePlaceholder),
      { target: { value: 'Testing string error' } }
    );

    fireEvent.click(
      screen.getByRole('button', { name: formMessages.submitButton })
    );

    await waitFor(() => {
      expect(
        screen.getByText(contactMessages.errorMessage)
      ).toBeInTheDocument();
    });
  });
});
