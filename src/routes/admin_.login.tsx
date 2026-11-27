import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Logo, Wordmark } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin_/login")({
  ssr: false,
  head: () => ({ meta: [{ title: "Sign in | Zelvan Labs admin" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) void navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    setBusy(true);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) {
        setError(/confirm/i.test(error.message) ? "Your email isn't confirmed yet. Open the link we emailed you, then sign in." : error.message);
        return;
      }
      void navigate({ to: "/admin" });
    } else {
      if (password.length < 8) {
        setBusy(false);
        setError("Use at least 8 characters for your password.");
        return;
      }
      const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
      setBusy(false);
      if (error) return setError(error.message);
      if (!data.session) setInfo("Check your inbox and click the confirmation link. Then come back here and sign in.");
      else void navigate({ to: "/admin" });
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 text-xl"><Logo size={22} /><Wordmark /></div>
        <h1 className="mt-8 text-3xl">{mode === "in" ? "Sign in" : "Create the admin account"}</h1>
        {mode === "up" && (
          <p className="mt-3 text-sm text-ink-soft">
            Only the owner's email gets admin access. We'll send a confirmation email; once you confirm, you can sign in.
          </p>
        )}
        <form onSubmit={submit} className="mt-6 space-y-4 rounded-[2px] border border-mist bg-card p-5">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" autoComplete={mode === "in" ? "current-password" : "new-password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" />
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          {info && <p role="status" className="text-sm text-verdigris">{info}</p>}
          <Button type="submit" className="w-full" disabled={busy}>{busy ? "Please wait..." : mode === "in" ? "Sign in" : "Create account"}</Button>
        </form>
        <button type="button" className="mt-4 text-sm text-verdigris underline underline-offset-4" onClick={() => { setMode(mode === "in" ? "up" : "in"); setError(""); setInfo(""); }}>
          {mode === "in" ? "First time? Create the admin account" : "Already have an account? Sign in"}
        </button>
      </div>
    </main>
  );
}
