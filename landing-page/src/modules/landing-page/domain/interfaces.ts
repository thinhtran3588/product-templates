import { ContactFormData } from "./schemas";

export interface ContactService {
  submit(data: ContactFormData): Promise<void>;
}
