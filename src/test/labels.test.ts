import { describe, expect, it } from "vitest";
import { leadsToCsv, slugify, slugPattern, validateLead } from "@/lib/labels";

describe("slugify", () => {
  it("makes lowercase hyphen slugs", () => {
    expect(slugify("  Clinic Support Bot!! v2 ")).toBe("clinic-support-bot-v2");
    expect(slugPattern.test(slugify("Booking Site"))).toBe(true);
    expect(slugPattern.test("Bad Slug")).toBe(false);
  });
});

describe("validateLead", () => {
  it("requires name, valid email, service and message", () => {
    const e = validateLead({ name: "", email: "x@", company: "", service: "", budget: "", message: "hi" });
    expect(Object.keys(e).sort()).toEqual(["email", "message", "name", "service"]);
  });
  it("accepts a complete form without company or budget", () => {
    expect(validateLead({ name: "Ali", email: "a@b.co", company: "", service: "website", budget: "", message: "We need a new site." })).toEqual({});
  });
});

describe("leadsToCsv", () => {
  it("quotes cells with commas", () => {
    const csv = leadsToCsv([{ id: "1", created_at: "d", updated_at: "d", name: "A, B", email: "e", company: null, service: "website", budget: null, message: "m", status: "new", notes: null }]);
    expect(csv.split("\n")[1]).toBe('d,"A, B",e,,website,,new,m,');
  });
});
