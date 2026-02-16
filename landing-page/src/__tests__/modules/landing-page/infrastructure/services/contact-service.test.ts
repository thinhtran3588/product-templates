import { beforeEach, describe, expect, it, vi } from "vitest";

import { SUPPORT_API_URL } from "@/common/constants";
import { InfrastructureContactService } from "@/modules/landing-page/infrastructure/services/contact-service";

describe("InfrastructureContactService", () => {
  const service = new InfrastructureContactService();

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it("submits data to the support API", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
    });

    const data = {
      name: "Alice",
      email: "alice@example.com",
      subject: "Test",
      message: "Message content",
      source: "test-source",
    };

    await service.submit(data);

    expect(global.fetch).toHaveBeenCalledWith(
      SUPPORT_API_URL,
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }),
    );
  });

  it("throws error when response is not ok", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
    });

    const data = {
      name: "Bob",
      email: "bob@example.com",
      subject: "Test",
      message: "Message content",
      source: "test-source",
    };

    await expect(service.submit(data)).rejects.toThrow(
      "Failed to send message",
    );
  });
});
