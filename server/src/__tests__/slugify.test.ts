import { slugify } from "../utils/slugify";

describe("slugify", () => {
  it("lowercases and hyphenates a title", () => {
    const slug = slugify("Building Real-Time Apps!");
    expect(slug).toMatch(/^building-real-time-apps-[a-z0-9]{5}$/);
  });

  it("strips special characters", () => {
    const slug = slugify("Hello @World# 2026");
    expect(slug.startsWith("hello-world-2026-")).toBe(true);
  });
});
