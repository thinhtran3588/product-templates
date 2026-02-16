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

    const androidContainer = screen.getByText("platforms.android").closest("a");
    const macosContainer = screen.getByText("platforms.macos").closest("a");
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

    const androidLink = screen.getByText("platforms.android").closest("a");
    if (!androidLink) throw new Error("Link not found");

    // Check if href is undefined/missing
    expect(androidLink).not.toHaveAttribute("href");
    expect(androidLink).not.toHaveAttribute("target");
    expect(androidLink).not.toHaveAttribute("rel");
    expect(androidLink).toHaveAttribute("aria-disabled", "true");
    expect(androidLink).toHaveClass("cursor-not-allowed", "opacity-60");

    fireEvent.click(androidLink);
  });
});
