"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/common/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/common/components/form";
import { Input } from "@/common/components/input";
import { Textarea } from "@/common/components/textarea";
import { useContainer } from "@/common/hooks/use-container";
import { getWindowHost } from "@/common/utils/browser";
import type { SubmitContactFormUseCase } from "@/modules/landing-page/application/submit-contact-form-use-case";
import {
  createContactFormSchema,
  type ContactFormData,
} from "@/modules/landing-page/domain/schemas";

export function ContactForm() {
  const t = useTranslations("modules.contact.pages.contact");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const container = useContainer();

  const contactFormSchema = useMemo(
    () => createContactFormSchema((key) => t(`form.validation.${key}`)),
    [t],
  );

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      source: getWindowHost(),
    },
  });

  async function onSubmit(values: ContactFormData) {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const useCase = container.resolve<SubmitContactFormUseCase>(
        "submitContactFormUseCase",
      );
      const result = await useCase.execute(values);

      if (result.success) {
        setSubmitted(true);
        form.reset();
      } else {
        setErrorMessage(result.error);
      }
    } catch {
      setErrorMessage(t("errorMessage"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {submitted ? (
        <p className="text-sm text-[var(--text-primary)]" role="status">
          {t("successMessage")}
        </p>
      ) : (
        <>
          {errorMessage ? (
            <p className="text-sm text-red-500" role="alert">
              {errorMessage}
            </p>
          ) : null}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.nameLabel")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("form.namePlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.emailLabel")}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t("form.emailPlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.subjectLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.subjectPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.messageLabel")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("form.messagePlaceholder")}
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                variant="primary"
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? t("form.submittingButton")
                  : t("form.submitButton")}
              </Button>
            </form>
          </Form>
        </>
      )}
    </div>
  );
}
