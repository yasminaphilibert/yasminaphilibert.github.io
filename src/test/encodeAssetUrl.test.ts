import { describe, it, expect } from "vitest";
import { encodeAssetUrl } from "@/lib/utils";

describe("encodeAssetUrl", () => {
  it("escapes spaces and non-ASCII so strict servers can resolve the file", () => {
    expect(encodeAssetUrl("/videos/Yasyntha-Ākāsadhātu.webm")).toBe(
      "/videos/Yasyntha-%C4%80k%C4%81sadh%C4%81tu.webm"
    );
    expect(encodeAssetUrl("/images/a b.png")).toBe("/images/a%20b.png");
  });

  it("leaves a comma literal — %2C made servers miss the file entirely", () => {
    expect(
      encodeAssetUrl("/images/services/visual-identity/Generated Image January 26, 2026 - 5_33AM.png")
    ).toBe(
      "/images/services/visual-identity/Generated%20Image%20January%2026,%202026%20-%205_33AM.png"
    );
  });

  it("keeps the other path-legal sub-delims literal", () => {
    expect(encodeAssetUrl("/x/a:b@c$d&e=f.png")).toBe("/x/a:b@c$d&e=f.png");
  });

  it("still escapes + and ; which some servers reinterpret", () => {
    expect(encodeAssetUrl("/x/a+b;c.png")).toBe("/x/a%2Bb%3Bc.png");
  });

  it("preserves slashes and does not double the leading one", () => {
    expect(encodeAssetUrl("/a/b/c.png")).toBe("/a/b/c.png");
    expect(encodeAssetUrl("//a/b.png")).toBe("/a/b.png");
  });
});
