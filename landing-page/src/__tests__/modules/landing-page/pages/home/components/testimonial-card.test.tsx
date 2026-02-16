import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TestimonialCard } from "@/modules/landing-page/presentation/pages/home/components/testimonial-card";

describe("TestimonialCard", () => {
  it("renders with provided props", () => {
    const props = {
      name: "John Doe",
      role: "Developer",
      quote: "Great product!",
      delay: 100,
    };

    render(<TestimonialCard {...props} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Developer")).toBeInTheDocument();
    expect(screen.getByText(/Great product!/)).toBeInTheDocument();
  });
});
