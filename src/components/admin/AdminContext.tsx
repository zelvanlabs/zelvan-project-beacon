import { createContext, useContext } from "react";
import type { Session } from "@supabase/supabase-js";

export const AdminSessionContext = createContext<Session | null>(null);
export function useAdminSession(): Session {
  const s = useContext(AdminSessionContext);
  if (!s) throw new Error("useAdminSession outside admin layout");
  return s;
}
