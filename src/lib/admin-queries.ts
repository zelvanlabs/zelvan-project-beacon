import { queryOptions } from "@tanstack/react-query";
import { supabase, type Lead, type Project } from "./supabase";

export const leadsQuery = queryOptions({
  queryKey: ["leads"],
  queryFn: async (): Promise<Lead[]> => {
    const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as Lead[];
  },
});

export const adminProjectsQuery = queryOptions({
  queryKey: ["projects", "admin"],
  queryFn: async (): Promise<Project[]> => {
    const { data, error } = await supabase.from("projects").select("*").order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as Project[];
  },
});
