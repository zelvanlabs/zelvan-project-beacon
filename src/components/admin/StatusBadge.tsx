import type { LeadStatus } from "@/lib/supabase";
import { statusLabels } from "@/lib/labels";

const tint: Record<LeadStatus, string> = {
  new: "bg-status-new text-ink",
  contacted: "bg-status-progress text-ink",
  qualified: "bg-status-progress text-ink",
  proposal: "bg-status-progress text-ink",
  won: "bg-status-won text-ink",
  lost: "bg-status-lost text-ink-soft",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return <span className={`inline-block rounded-[2px] px-2 py-0.5 text-xs font-medium ${tint[status]}`}>{statusLabels[status]}</span>;
}
