import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL = "https://yhycienqysoorvxbwfbv.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_UzhBRnFSYeZbduMTQJDbsQ_1jrToJhX";

const isBrowser = typeof window !== "undefined";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: isBrowser, autoRefreshToken: isBrowser, detectSessionInUrl: isBrowser },
});

export type Service = "chatbot" | "website" | "webapp" | "other";
export type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";

export interface Lead {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  company: string | null;
  service: Service;
  budget: string | null;
  message: string;
  status: LeadStatus;
  notes: string | null;
}

export interface Project {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  category: Service;
  summary: string | null;
  tags: string[] | null;
  url: string | null;
  cover_url: string | null;
  is_demo: boolean;
  published: boolean;
  sort_order: number;
}
