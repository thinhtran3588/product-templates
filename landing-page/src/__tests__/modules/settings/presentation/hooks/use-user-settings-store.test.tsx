import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { useUserSettingsStore } from "@/modules/settings/presentation/hooks/use-user-settings-store";

describe("useUserSettingsStore", () => {
  beforeEach(() => {
    useUserSettingsStore.setState({ settings: {} });
    localStorage.clear();
  });

  it("has initial empty settings", () => {
    expect(useUserSettingsStore.getState().settings).toEqual({});
  });

  it("setSettings updates settings", () => {
    useUserSettingsStore.getState().setSettings({
      locale: "en",
      theme: "dark",
    });
    expect(useUserSettingsStore.getState().settings).toEqual({
      locale: "en",
      theme: "dark",
    });
    useUserSettingsStore.getState().setSettings({});
    expect(useUserSettingsStore.getState().settings).toEqual({});
  });

  it("setLocale updates settings", () => {
    const { result } = renderHook(() => useUserSettingsStore());

    act(() => {
      result.current.setLocale("vi");
    });

    expect(useUserSettingsStore.getState().settings.locale).toBe("vi");
  });

  it("setTheme updates settings", () => {
    const { result } = renderHook(() => useUserSettingsStore());

    act(() => {
      result.current.setTheme("dark");
    });

    expect(useUserSettingsStore.getState().settings.theme).toBe("dark");
  });

  it("setTheme does nothing when theme is undefined", () => {
    const { result } = renderHook(() => useUserSettingsStore());

    act(() => {
      result.current.setTheme(undefined);
    });

    expect(useUserSettingsStore.getState().settings.theme).toBeUndefined();
  });
});
