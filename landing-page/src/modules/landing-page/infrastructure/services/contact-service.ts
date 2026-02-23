import { SUPPORT_API_URL } from '@/common/constants';
import { ContactService } from '@/modules/landing-page/domain/interfaces';
import { ContactFormData } from '@/modules/landing-page/domain/schemas';

export class InfrastructureContactService implements ContactService {
  async submit(data: ContactFormData): Promise<void> {
    const response = await fetch(SUPPORT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }
  }
}
