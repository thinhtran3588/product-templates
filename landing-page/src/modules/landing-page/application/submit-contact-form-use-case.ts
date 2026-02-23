import { BaseUseCase, type UseCaseResult } from '@/common/utils/base-use-case';
import { type ContactService } from '@/modules/landing-page/domain/interfaces';
import { type ContactFormData } from '@/modules/landing-page/domain/schemas';

export type SubmitContactFormResult = UseCaseResult<void, string>;

export class SubmitContactFormUseCase extends BaseUseCase {
  constructor(private readonly contactService: ContactService) {
    super();
  }

  async execute(input: ContactFormData): Promise<SubmitContactFormResult> {
    return this.handle(
      () => this.contactService.submit(input),
      (err) => (err instanceof Error ? err.message : 'Has error')
    );
  }
}
