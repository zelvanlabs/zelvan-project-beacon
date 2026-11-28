import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAdminSession } from "@/components/admin/AdminContext";
import { panelClass } from "@/components/admin/fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/settings")({
  component: Page,
});

function Page() {
  const session = useAdminSession();
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ pw?: string; confirm?: string }>({});

  const change = useMutation({
    mutationFn: async (password: string) => {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Password changed");
      setPw("");
      setConfirm("");
    },
    onError: (e) => toast.error(e.message),
  });

  function submit(e: FormEvent) {
    e.preventDefault();
    const next: { pw?: string; confirm?: string } = {};
    if (pw.length < 8) next.pw = "Use at least 8 characters.";
    if (confirm !== pw) next.confirm = "The two passwords don't match.";
    setErrors(next);
    if (!next.pw && !next.confirm) change.mutate(pw);
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl">Settings</h1>
      <section className={`${panelClass} mt-6 p-5`}>
        <h2 className="text-lg">Account</h2>
        <p className="mt-1 text-ink-soft">Signed in as <span className="font-medium text-ink">{session.user.email}</span></p>
        <p className="mt-3 text-sm text-ink-soft">More admins are added by an owner in the database allowlist.</p>
        <Button variant="outline" className="mt-4" onClick={() => void supabase.auth.signOut()}>Sign out</Button>
      </section>
      <form onSubmit={submit} noValidate className={`${panelClass} mt-6 space-y-4 p-5`}>
        <h2 className="text-lg">Change password</h2>
        <div>
          <Label htmlFor="pw">New password</Label>
          <Input id="pw" type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} aria-invalid={!!errors.pw} aria-describedby={errors.pw ? "pw-err" : undefined} className="mt-1" />
          {errors.pw && <p id="pw-err" className="mt-1 text-sm text-ink">{errors.pw}</p>}
        </div>
        <div>
          <Label htmlFor="pw2">Confirm new password</Label>
          <Input id="pw2" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} aria-invalid={!!errors.confirm} aria-describedby={errors.confirm ? "pw2-err" : undefined} className="mt-1" />
          {errors.confirm && <p id="pw2-err" className="mt-1 text-sm text-ink">{errors.confirm}</p>}
        </div>
        <Button type="submit" disabled={change.isPending}>{change.isPending ? "Saving..." : "Change password"}</Button>
      </form>
    </div>
  );
}
