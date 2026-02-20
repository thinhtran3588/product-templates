import { asClass, asValue, type AwilixContainer } from "awilix";

import { SubmitContactFormUseCase } from "@/modules/landing-page/application/submit-contact-form-use-case";
import { InfrastructureContactService } from "@/modules/landing-page/infrastructure/services/contact-service";

export function registerModule(container: AwilixContainer<object>): void {
  // Register the service first as a singleton class
  container.register({
    contactService: asClass(InfrastructureContactService).singleton(),
  });

  // Resolve contactService explicitly and pass it to the use case constructor.
  // This avoids Awilix's PROXY injection mode passing the entire cradle as the
  // constructor argument, which caused "Could not resolve 'submit'" at runtime.
  const contactService =
    container.resolve<InfrastructureContactService>("contactService");

  container.register({
    submitContactFormUseCase: asValue(
      new SubmitContactFormUseCase(contactService),
    ),
  });
}
