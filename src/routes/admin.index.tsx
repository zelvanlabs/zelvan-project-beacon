import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { formatDistanceToNow } from "date-fns";
import { weeklyBuckets } from "@/lib/admin-helpers";
import { leadsQuery } from "@/lib/admin-queries";
import { serviceLabels } from "@/lib/labels";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { panelClass } from "@/components/admin/fields";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/admin/")({
  component: Page,
});

const chartConfig = { count: { label: "Leads", color: "var(--verdigris)" } } satisfies ChartConfig;

function Page() {
  const q = useQuery(leadsQuery);
  const leads = q.data ?? [];
  const weeks = useMemo(() => weeklyBuckets(leads.map((l) => l.created_at)), [leads]);
  const stats = [
    { label: "Total leads", value: leads.length },
    { label: "New", value: leads.filter((l) => l.status === "new").length },
    { label: "In progress", value: leads.filter((l) => ["contacted", "qualified", "proposal"].includes(l.status)).length },
    { label: "Won", value: leads.filter((l) => l.status === "won").length },
  ];

  return (
    <div className="max-w-5xl">
      <h1 className="text-3xl">Dashboard</h1>
      {q.isError && <p role="alert" className="mt-6 text-ink">Couldn't load leads: {q.error.message}</p>}

      <dl className={`${panelClass} mt-6 grid grid-cols-2 divide-mist md:grid-cols-4 md:divide-x`}>
        {stats.map((s, i) => (
          <div key={s.label} className={`p-5 ${i < 2 ? "border-b border-mist md:border-b-0" : ""} ${i % 2 === 0 ? "border-r border-mist md:border-r-0" : ""}`}>
            <dt className="text-sm text-ink-soft">{s.label}</dt>
            <dd className="mt-1 text-4xl font-bold tracking-tight">{q.isPending ? <Skeleton className="h-10 w-12" /> : s.value}</dd>
          </div>
        ))}
      </dl>

      <section className={`${panelClass} mt-6 p-5`} aria-labelledby="chart-h">
        <h2 id="chart-h" className="text-lg">Leads per week</h2>
        <p className="text-sm text-ink-soft">Last 12 weeks, weeks start Monday.</p>
        {q.isPending ? (
          <Skeleton className="mt-4 h-56 w-full" />
        ) : (
          <ChartContainer config={chartConfig} className="mt-4 h-56 w-full">
            <BarChart data={weeks} margin={{ left: -20, right: 4 }}>
              <CartesianGrid vertical={false} stroke="var(--mist)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} interval="preserveStartEnd" />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </section>

      <section className={`${panelClass} mt-6`} aria-labelledby="latest-h">
        <div className="flex items-center justify-between p-5 pb-3">
          <h2 id="latest-h" className="text-lg">Latest leads</h2>
          <Link to="/admin/leads" className="text-sm text-verdigris underline-offset-4 hover:underline">All leads</Link>
        </div>
        {q.isPending ? (
          <div className="space-y-2 p-5 pt-0">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
        ) : leads.length === 0 ? (
          <p className="p-5 pt-0 text-ink-soft">No leads yet. They'll appear here when someone sends the contact form.</p>
        ) : (
          <ul className="divide-y divide-mist border-t border-mist">
            {leads.slice(0, 5).map((l) => (
              <li key={l.id}>
                <Link to="/admin/leads" className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-3 hover:bg-muted sm:grid-cols-[minmax(0,1fr)_10rem_6rem_8rem]">
                  <span className="min-w-0 truncate font-medium">{l.name}</span>
                  <span className="hidden text-sm text-ink-soft sm:block">{serviceLabels[l.service]}</span>
                  <span><StatusBadge status={l.status} /></span>
                  <span className="hidden text-right text-sm text-ink-soft sm:block">{formatDistanceToNow(new Date(l.created_at), { addSuffix: true })}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
