import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PlatformDownload } from "@/modules/landing-page/presentation/pages/home/components/platform-download";

// Mock translations
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock LINKS
vi.mock("@/common/constants", () => ({
  LINKS: {
    WEB: "https://example.com/web",
    ANDROID: "",
    IOS: "https://example.com/ios",
    MACOS: "",
  },
}));

describe("PlatformDownload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all platform labels correctly", () => {
    render(<PlatformDownload />);

    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("description")).toBeInTheDocument();
    expect(screen.getByText("footer")).toBeInTheDocument();

    expect(screen.getByText("platforms.web")).toBeInTheDocument();
    expect(screen.getByText("platforms.android")).toBeInTheDocument();
    expect(screen.getByText("platforms.ios")).toBeInTheDocument();
    expect(screen.getByText("platforms.macos")).toBeInTheDocument();
  });

  it("shows coming soon only for platforms with empty links", () => {
    render(<PlatformDownload />);

    // Based on our mock: android and macos are coming soon
    const comingSoonElements = screen.getAllByText("comingSoon");
    expect(comingSoonElements).toHaveLength(2);

    // Coming-soon platforms render as <div>, active ones as <a>
    const androidContainer = screen
      .getByText("platforms.android")
      .closest("div[role='img']");
    const macosContainer = screen
      .getByText("platforms.macos")
      .closest("div[role='img']");
    const webContainer = screen.getByText("platforms.web").closest("a");
    const iosContainer = screen.getByText("platforms.ios").closest("a");

    expect(androidContainer).toHaveTextContent("comingSoon");
    expect(macosContainer).toHaveTextContent("comingSoon");
    expect(webContainer).not.toHaveTextContent("comingSoon");
    expect(iosContainer).not.toHaveTextContent("comingSoon");
  });

  it("allows navigation when link is present", () => {
    render(<PlatformDownload />);

    const webLink = screen.getByText("platforms.web").closest("a");
    if (!webLink) throw new Error("Link not found");

    // Check if href is set
    expect(webLink).toHaveAttribute("href", "https://example.com/web");
    expect(webLink).toHaveAttribute("target", "_blank");
    expect(webLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(webLink).toHaveClass("hover:-translate-y-1");

    // Check if icon is present
    expect(webLink.querySelector("svg")).toBeInTheDocument();

    fireEvent.click(webLink);
  });

  it("prevents navigation when link is empty", () => {
    render(<PlatformDownload />);

    // Coming-soon platforms render as <div role="img">, not <a>
    const androidDiv = screen
      .getByText("platforms.android")
      .closest("div[role='img']");
    if (!androidDiv) throw new Error("Coming-soon container not found");

    // Should not be an anchor — no href or navigation attributes
    expect(androidDiv.tagName).toBe("DIV");
    expect(androidDiv).toHaveClass("cursor-not-allowed", "opacity-60");
  });
});
