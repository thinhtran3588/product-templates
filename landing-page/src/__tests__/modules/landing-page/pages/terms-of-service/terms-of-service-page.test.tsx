import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import messages from "@/application/localization/en.json";
import { TermsOfServicePage } from "@/modules/landing-page/presentation/pages/terms-of-service/terms-of-service-page";

describe("TermsOfServicePage", () => {
  it("renders the terms of service placeholder", async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const page = await TermsOfServicePage();
    render(page);

    expect(
      screen.getByRole("heading", {
        name: messages.modules.legal.pages["terms-of-service"].title,
      }),
    ).toBeInTheDocument();
  });
});
