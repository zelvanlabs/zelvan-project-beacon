import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LayoutDashboard, Inbox, FolderKanban, Settings, LogOut, Menu, X } from "lucide-react";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { AdminSessionContext } from "@/components/admin/AdminContext";
import { Logo, Wordmark } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin | Zelvan Labs" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/leads", label: "Leads", icon: Inbox, exact: false },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban, exact: false },
  { to: "/admin/settings", label: "Settings", icon: Settings, exact: false },
] as const;

function AdminLayout() {
  const auth = useAdminAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (auth.status === "signed-out") void navigate({ to: "/admin/login" });
  }, [auth.status, navigate]);

  if (auth.status === "loading" || auth.status === "signed-out")
    return <div className="flex min-h-screen items-center justify-center text-ink-soft">Checking access...</div>;

  if (auth.status === "denied")
    return (
      <div className="flex min-h-screen items-center justify-center px-5">
        <div className="max-w-md">
          <Logo size={28} />
          <h1 className="mt-6 text-3xl">You do not have access</h1>
          <p className="mt-3 text-ink-soft">
            You're signed in as {auth.session.user.email}, but this account isn't an admin. If you just confirmed your email, try signing out and back in.
          </p>
          <Button variant="secondary" className="mt-6" onClick={() => void supabase.auth.signOut()}>Sign out</Button>
        </div>
      </div>
    );

  const links = (
    <nav aria-label="Admin" className="flex flex-col gap-1">
      {nav.map((n) => (
        <Link
          key={n.to}
          to={n.to}
          activeOptions={{ exact: n.exact }}
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 rounded-[2px] px-3 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground data-[status=active]:bg-sidebar-accent data-[status=active]:text-sidebar-foreground"
        >
          <n.icon className="size-4" aria-hidden="true" />
          {n.label}
        </Link>
      ))}
      <button type="button" onClick={() => void supabase.auth.signOut()} className="mt-4 flex items-center gap-3 rounded-[2px] px-3 py-2 text-left text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent">
        <LogOut className="size-4" aria-hidden="true" /> Sign out
      </button>
    </nav>
  );

  return (
    <AdminSessionContext.Provider value={auth.session}>
      <div className="min-h-screen md:grid md:grid-cols-[14rem_minmax(0,1fr)]">
        <aside className="hidden bg-sidebar p-4 text-sidebar-foreground md:block">
          <div className="sticky top-4">
            <div className="mb-8 flex items-center gap-2 px-2 text-lg"><Logo zColor="var(--chalk)" size={18} /><Wordmark /></div>
            {links}
          </div>
        </aside>
        <div className="flex items-center justify-between bg-sidebar px-4 py-3 text-sidebar-foreground md:hidden">
          <div className="flex items-center gap-2"><Logo zColor="var(--chalk)" size={18} /><Wordmark /></div>
          <button type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {open && <div className="bg-sidebar px-4 pb-4 md:hidden">{links}</div>}
        <main className="min-w-0 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </AdminSessionContext.Provider>
  );
}
