import type { LeadStatus, Service, Lead } from "./supabase";

export const serviceLabels: Record<Service, string> = {
  chatbot: "Chatbot or AI agent",
  website: "Website",
  webapp: "Web app",
  other: "Something else",
};

export const statusLabels: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal: "Proposal",
  won: "Won",
  lost: "Lost",
};

export const statuses: LeadStatus[] = ["new", "contacted", "qualified", "proposal", "won", "lost"];
export const services: Service[] = ["chatbot", "website", "webapp", "other"];
export const budgets = ["Under $1k", "$1k to $3k", "$3k to $10k", "$10k+", "Not sure yet"];

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function csvCell(v: unknown): string {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function leadsToCsv(leads: Lead[]): string {
  const cols: (keyof Lead)[] = [
    "created_at", "name", "email", "company", "service", "budget", "status", "message", "notes",
  ];
  return [cols.join(","), ...leads.map((l) => cols.map((c) => csvCell(l[c])).join(","))].join("\n");
}

export interface LeadForm {
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  message: string;
}

export function validateLead(f: LeadForm): Partial<Record<keyof LeadForm, string>> {
  const e: Partial<Record<keyof LeadForm, string>> = {};
  if (f.name.trim().length < 2) e.name = "Please tell us your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()))
    e.email = "That email address doesn't look right. Please check it.";
  if (!f.service) e.service = "Pick the closest option, or choose Something else.";
  if (f.message.trim().length < 10)
    e.message = "A sentence or two about your project helps us reply properly.";
  return e;
}
