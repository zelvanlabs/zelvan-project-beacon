import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase, type Lead, type LeadStatus, type Service } from "@/lib/supabase";
import { filterLeads, type LeadFilters } from "@/lib/admin-helpers";
import { leadsQuery } from "@/lib/admin-queries";
import { leadsToCsv, serviceLabels, services, statusLabels, statuses } from "@/lib/labels";
import { site } from "@/config/site";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { panelClass, selectClass } from "@/components/admin/fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/admin/leads")({
  component: Page,
});

function downloadCsv(rows: Lead[]) {
  const blob = new Blob([leadsToCsv(rows)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `zelvan-leads-${format(new Date(), "yyyy-MM-dd")}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function Page() {
  const q = useQuery(leadsQuery);
  const [filters, setFilters] = useState<LeadFilters>({ search: "", status: "all", service: "all", sort: "newest" });
  const [openId, setOpenId] = useState<string | null>(null);
  const rows = useMemo(() => filterLeads(q.data ?? [], filters), [q.data, filters]);
  const open = q.data?.find((l) => l.id === openId) ?? null;

  return (
    <div className="max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-3xl">Leads</h1>
        <Button variant="secondary" onClick={() => downloadCsv(rows)} disabled={rows.length === 0}>Export CSV</Button>
      </div>

      <div className="mt-6 flex flex-wrap items-end gap-3">
        <div className="min-w-0 grow basis-56">
          <Label htmlFor="lead-search" className="sr-only">Search leads</Label>
          <Input id="lead-search" type="search" placeholder="Search name, email or company" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        </div>
        <select aria-label="Status filter" className={selectClass} value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value as LeadStatus | "all" })}>
          <option value="all">All statuses</option>
          {statuses.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
        </select>
        <select aria-label="Service filter" className={selectClass} value={filters.service} onChange={(e) => setFilters({ ...filters, service: e.target.value as Service | "all" })}>
          <option value="all">All services</option>
          {services.map((s) => <option key={s} value={s}>{serviceLabels[s]}</option>)}
        </select>
        <Button variant="outline" onClick={() => setFilters({ ...filters, sort: filters.sort === "newest" ? "oldest" : "newest" })}>
          {filters.sort === "newest" ? "Newest first" : "Oldest first"}
        </Button>
      </div>

      <div className={`${panelClass} mt-4 overflow-x-auto`}>
        {q.isPending ? (
          <div className="space-y-2 p-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-9 w-full" />)}</div>
        ) : q.isError ? (
          <p role="alert" className="p-4">Couldn't load leads: {q.error.message}</p>
        ) : rows.length === 0 ? (
          <p className="p-4 text-ink-soft">{(q.data ?? []).length === 0 ? "No leads yet. They'll appear here when someone sends the contact form." : "No leads match these filters."}</p>
        ) : (
          <Table className="min-w-[40rem]">
            <TableHeader>
              <TableRow><TableHead>Date</TableHead><TableHead>Name</TableHead><TableHead>Company</TableHead><TableHead>Service</TableHead><TableHead>Status</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((l) => (
                <TableRow
                  key={l.id}
                  tabIndex={0}
                  aria-label={`Open lead from ${l.name}`}
                  className="cursor-pointer focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring"
                  onClick={() => setOpenId(l.id)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpenId(l.id); } }}
                >
                  <TableCell className="whitespace-nowrap">{format(new Date(l.created_at), "d MMM yyyy")}</TableCell>
                  <TableCell className="font-medium">{l.name}</TableCell>
                  <TableCell>{l.company ?? "—"}</TableCell>
                  <TableCell>{serviceLabels[l.service]}</TableCell>
                  <TableCell><StatusBadge status={l.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Sheet open={!!open} onOpenChange={(o) => { if (!o) setOpenId(null); }}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
          {open && <LeadDetail key={open.id} lead={open} onDeleted={() => setOpenId(null)} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function LeadDetail({ lead, onDeleted }: { lead: Lead; onDeleted: () => void }) {
  const qc = useQueryClient();
  const [notes, setNotes] = useState(lead.notes ?? "");
  useEffect(() => setNotes(lead.notes ?? ""), [lead.notes]);

  const setStatus = useMutation({
    mutationFn: async (status: LeadStatus) => {
      const { error } = await supabase.from("leads").update({ status }).eq("id", lead.id);
      if (error) throw new Error(error.message);
    },
    onMutate: async (status) => {
      await qc.cancelQueries({ queryKey: leadsQuery.queryKey });
      const prev = qc.getQueryData(leadsQuery.queryKey);
      qc.setQueryData(leadsQuery.queryKey, (old) => old?.map((l) => (l.id === lead.id ? { ...l, status } : l)));
      return { prev };
    },
    onError: (e, _s, ctx) => {
      if (ctx?.prev) qc.setQueryData(leadsQuery.queryKey, ctx.prev);
      toast.error(e.message);
    },
    onSuccess: (_d, status) => toast.success(`Status set to ${statusLabels[status]}`),
    onSettled: () => void qc.invalidateQueries({ queryKey: leadsQuery.queryKey }),
  });

  const saveNotes = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("leads").update({ notes: notes.trim() ? notes : null }).eq("id", lead.id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => { toast.success("Notes saved"); void qc.invalidateQueries({ queryKey: leadsQuery.queryKey }); },
    onError: (e) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("leads").delete().eq("id", lead.id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => { toast.success("Lead deleted"); onDeleted(); void qc.invalidateQueries({ queryKey: leadsQuery.queryKey }); },
    onError: (e) => toast.error(e.message),
  });

  const subject = encodeURIComponent(`Re: your enquiry to ${site.name}`);
  const field = (label: string, value: React.ReactNode) => (
    <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3 border-b border-mist py-2 text-sm">
      <dt className="text-ink-soft">{label}</dt><dd className="min-w-0 break-words">{value}</dd>
    </div>
  );

  return (
    <div>
      <SheetHeader>
        <SheetTitle className="text-2xl">{lead.name}</SheetTitle>
        <SheetDescription>Received {format(new Date(lead.created_at), "d MMM yyyy, HH:mm")}</SheetDescription>
      </SheetHeader>
      <dl className="mt-4 border-t border-mist">
        {field("Email", <a className="text-verdigris underline" href={`mailto:${lead.email}`}>{lead.email}</a>)}
        {field("Company", lead.company ?? "—")}
        {field("Service", serviceLabels[lead.service])}
        {field("Budget", lead.budget ?? "—")}
        {field("Received", format(new Date(lead.created_at), "d MMM yyyy, HH:mm"))}
      </dl>
      <h3 className="mt-5 text-sm font-medium">Message</h3>
      <p className="mt-1 whitespace-pre-wrap text-sm">{lead.message}</p>

      <div className="mt-6">
        <Label htmlFor="lead-status">Status</Label>
        <select id="lead-status" className={`${selectClass} mt-1 block w-full`} value={lead.status} disabled={setStatus.isPending} onChange={(e) => setStatus.mutate(e.target.value as LeadStatus)}>
          {statuses.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
        </select>
      </div>

      <div className="mt-5">
        <Label htmlFor="lead-notes">Notes</Label>
        <Textarea id="lead-notes" rows={5} className="mt-1" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <Button variant="secondary" className="mt-2" disabled={notes === (lead.notes ?? "") || saveNotes.isPending} onClick={() => saveNotes.mutate()}>
          {saveNotes.isPending ? "Saving..." : "Save notes"}
        </Button>
      </div>

      <div className="mt-8 flex flex-wrap gap-3 border-t border-mist pt-5">
        <Button asChild><a href={`mailto:${lead.email}?subject=${subject}`}>Reply by email</a></Button>
        <AlertDialog>
          <AlertDialogTrigger asChild><Button variant="outline">Delete lead</Button></AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this lead?</AlertDialogTitle>
              <AlertDialogDescription>The enquiry from {lead.name} will be removed for good.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => remove.mutate()}>Delete lead</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
