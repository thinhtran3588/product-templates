import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SubmitContactFormUseCase } from '@/modules/landing-page/application/submit-contact-form-use-case';
import { ContactService } from '@/modules/landing-page/domain/interfaces';

describe('SubmitContactFormUseCase', () => {
  const mockContactService = {
    submit: vi.fn(),
  } as unknown as ContactService;

  const useCase = new SubmitContactFormUseCase(mockContactService);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submits form data using contact service', async () => {
    mockContactService.submit = vi.fn().mockResolvedValue(undefined);

    const data = {
      name: 'Alice',
      email: 'alice@example.com',
      subject: 'Test',
      message: 'Message content',
      source: 'test-source',
    };

    const result = await useCase.execute(data);

    expect(mockContactService.submit).toHaveBeenCalledWith(data);
    expect(result).toEqual({ success: true, data: undefined });
  });

  it('returns failure when service throws an error', async () => {
    mockContactService.submit = vi
      .fn()
      .mockRejectedValue(new Error('Failed to send message'));

    const data = {
      name: 'Bob',
      email: 'bob@example.com',
      subject: 'Test',
      message: 'Message content',
      source: 'test-source',
    };

    const result = await useCase.execute(data);

    expect(result).toEqual({ success: false, error: 'Failed to send message' });
  });

  it('returns default error message when rejection reason is not an Error', async () => {
    mockContactService.submit = vi.fn().mockRejectedValue('Some error');

    const data = {
      name: 'Charlie',
      email: 'charlie@example.com',
      subject: 'Test',
      message: 'Message content',
      source: 'test-source',
    };

    const result = await useCase.execute(data);

    expect(result).toEqual({ success: false, error: 'Has error' });
  });
});
