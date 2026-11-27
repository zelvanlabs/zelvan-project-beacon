import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type AdminState =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "denied"; session: Session }
  | { status: "admin"; session: Session };

export function useAdminAuth(): AdminState {
  const [state, setState] = useState<AdminState>({ status: "loading" });

  useEffect(() => {
    let active = true;
    async function resolve(session: Session | null) {
      if (!session) {
        if (active) setState({ status: "signed-out" });
        return;
      }
      const { data, error } = await supabase.rpc("has_role", { _user_id: session.user.id, _role: "admin" });
      if (!active) return;
      setState(!error && data === true ? { status: "admin", session } : { status: "denied", session });
    }
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "TOKEN_REFRESHED") return;
      setTimeout(() => void resolve(session), 0);
    });
    void supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return resolve(null);
      const { data: s } = await supabase.auth.getSession();
      return resolve(s.session);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}
