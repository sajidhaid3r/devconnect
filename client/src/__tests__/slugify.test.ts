import { describe, it, expect } from "vitest";

// Sanity test mirroring server-side slug format expectations, so the client
// team can validate assumptions about post URLs without hitting the API.
function isValidSlug(slug: string) {
  return /^[a-z0-9-]+$/.test(slug);
}

describe("slug format", () => {
  it("accepts lowercase-hyphen slugs", () => {
    expect(isValidSlug("building-realtime-apps-ab12c")).toBe(true);
  });
  it("rejects slugs with spaces or symbols", () => {
    expect(isValidSlug("Building Realtime Apps!")).toBe(false);
  });
});
