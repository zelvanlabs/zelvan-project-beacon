import { queryOptions } from "@tanstack/react-query";
import { supabase, type Project } from "./supabase";

export const publishedProjectsQuery = queryOptions({
  queryKey: ["projects", "published"],
  queryFn: async (): Promise<Project[]> => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });
    if (error) {
      console.error("projects load failed", error.message);
      return [];
    }
    return (data ?? []) as Project[];
  },
  staleTime: 60_000,
});
