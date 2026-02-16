import { asClass, type AwilixContainer } from "awilix";

import { SubmitContactFormUseCase } from "@/modules/landing-page/application/submit-contact-form-use-case";
import { InfrastructureContactService } from "@/modules/landing-page/infrastructure/services/contact-service";

export function registerModule(container: AwilixContainer<object>): void {
  container.register({
    contactService: asClass(InfrastructureContactService).singleton(),
    submitContactFormUseCase: asClass(SubmitContactFormUseCase).singleton(),
  });
}
