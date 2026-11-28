import { describe, expect, it } from "vitest";
import { filterLeads, isHttpUrl, parseTags, weeklyBuckets } from "@/lib/admin-helpers";
import type { Lead } from "@/lib/supabase";

describe("weeklyBuckets", () => {
  const now = new Date(2026, 10, 28, 12); // Sat 28 Nov 2026
  it("returns 12 Monday-start weeks including empty ones", () => {
    const b = weeklyBuckets([], now);
    expect(b).toHaveLength(12);
    expect(b[11]?.label).toBe("23 Nov");
    expect(b[0]?.label).toBe("7 Sep");
    expect(b.every((x) => x.count === 0)).toBe(true);
  });
  it("counts leads into the right week and ignores older ones", () => {
    const b = weeklyBuckets(
      [new Date(2026, 10, 23, 0, 30).toISOString(), new Date(2026, 10, 22, 23).toISOString(), new Date(2026, 0, 1).toISOString()],
      now,
    );
    expect(b[11]?.count).toBe(1);
    expect(b[10]?.count).toBe(1);
    expect(b.reduce((s, x) => s + x.count, 0)).toBe(2);
  });
});

const lead = (p: Partial<Lead>): Lead => ({
  id: "x", created_at: "2026-01-01T00:00:00Z", updated_at: "", name: "A", email: "a@x.co",
  company: null, service: "website", budget: null, message: "m", status: "new", notes: null, ...p,
});

describe("filterLeads", () => {
  const leads = [
    lead({ id: "1", name: "Sara Khan", company: "Clinic Co", created_at: "2026-01-01T00:00:00Z" }),
    lead({ id: "2", name: "Omar", email: "omar@shop.pk", service: "chatbot", status: "won", created_at: "2026-02-01T00:00:00Z" }),
  ];
  const base = { search: "", status: "all", service: "all", sort: "newest" } as const;
  it("searches name, email and company case-insensitively", () => {
    expect(filterLeads(leads, { ...base, search: "clinic" }).map((l) => l.id)).toEqual(["1"]);
    expect(filterLeads(leads, { ...base, search: "SHOP.PK" }).map((l) => l.id)).toEqual(["2"]);
  });
  it("filters by status and service and sorts by date", () => {
    expect(filterLeads(leads, { ...base, status: "won" }).map((l) => l.id)).toEqual(["2"]);
    expect(filterLeads(leads, { ...base, service: "website" }).map((l) => l.id)).toEqual(["1"]);
    expect(filterLeads(leads, base).map((l) => l.id)).toEqual(["2", "1"]);
    expect(filterLeads(leads, { ...base, sort: "oldest" }).map((l) => l.id)).toEqual(["1", "2"]);
  });
});

describe("project form helpers", () => {
  it("trims and de-duplicates tags", () => {
    expect(parseTags(" ai, ai ,, react ")).toEqual(["ai", "react"]);
  });
  it("only accepts http and https urls", () => {
    expect(isHttpUrl("https://x.com")).toBe(true);
    expect(isHttpUrl("ftp://x.com")).toBe(false);
    expect(isHttpUrl("nope")).toBe(false);
  });
});
