import type { Lead, LeadStatus, Service } from "./supabase";

/** Monday 00:00 local time of the week containing d. */
export function startOfWeekMonday(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = (x.getDay() + 6) % 7; // 0 = Monday
  x.setDate(x.getDate() - day);
  return x;
}

export interface WeekBucket {
  start: Date;
  label: string;
  count: number;
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Leads per week for the last `weeks` weeks (oldest first), weeks start Monday, empty weeks included. */
export function weeklyBuckets(dates: string[], now: Date = new Date(), weeks = 12): WeekBucket[] {
  const current = startOfWeekMonday(now);
  const buckets: WeekBucket[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const start = new Date(current.getFullYear(), current.getMonth(), current.getDate() - i * 7);
    buckets.push({ start, label: `${start.getDate()} ${months[start.getMonth()]}`, count: 0 });
  }
  const first = buckets[0]?.start.getTime() ?? 0;
  for (const iso of dates) {
    const t = new Date(iso);
    if (Number.isNaN(t.getTime()) || t.getTime() < first) continue;
    const ws = startOfWeekMonday(t).getTime();
    const b = buckets.find((x) => x.start.getTime() === ws);
    if (b) b.count++;
  }
  return buckets;
}

export interface LeadFilters {
  search: string;
  status: LeadStatus | "all";
  service: Service | "all";
  sort: "newest" | "oldest";
}

export function filterLeads(leads: Lead[], f: LeadFilters): Lead[] {
  const q = f.search.trim().toLowerCase();
  const out = leads.filter((l) => {
    if (f.status !== "all" && l.status !== f.status) return false;
    if (f.service !== "all" && l.service !== f.service) return false;
    if (!q) return true;
    return [l.name, l.email, l.company ?? ""].some((v) => v.toLowerCase().includes(q));
  });
  out.sort((a, b) => {
    const d = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    return f.sort === "newest" ? -d : d;
  });
  return out;
}

export function parseTags(input: string): string[] {
  const seen = new Set<string>();
  for (const t of input.split(",")) {
    const v = t.trim();
    if (v) seen.add(v);
  }
  return [...seen];
}

export function isHttpUrl(v: string): boolean {
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

